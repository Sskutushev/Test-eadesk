import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;
  private readonly lokiHost: string;
  private readonly lokiFallbackEnabled: boolean;

  constructor() {
    this.lokiHost = process.env.LOKI_HOST || 'http://loki:3100';
    this.lokiFallbackEnabled = process.env.LOKI_FALLBACK === 'true';

    this.logger = winston.createLogger({
      level: 'info',
      defaultMeta: {
        app: 'signal-lab',
        env: process.env.NODE_ENV || 'development',
      },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new LokiTransport({
          host: this.lokiHost,
          labels: {
            app: 'signal-lab',
            env: process.env.NODE_ENV || 'development',
            service: 'backend',
          },
          json: true,
          batching: true,
          interval: 2,
          replaceTimestamp: true,
          onConnectionError: (err: Error) => {
            console.error('Loki connection error:', err);
          },
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
    this.sendToLoki('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
    this.sendToLoki('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
    this.sendToLoki('warn', message, context);
  }

  private async sendToLoki(level: string, message: string, context?: string, trace?: string) {
    if (!this.lokiFallbackEnabled) return;

    const timestamp = `${Date.now()}000000`;
    const labels = {
      app: 'signal-lab',
      env: process.env.NODE_ENV || 'development',
      service: 'backend',
      level,
      context: context || 'unknown',
      source: 'fallback',
    };

    const payload = {
      streams: [
        {
          stream: labels,
          values: [[timestamp, trace ? `${message}\n${trace}` : message]],
        },
      ],
    };

    try {
      await fetch(`${this.lokiHost}/loki/api/v1/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Loki fallback error:', err);
    }
  }
}
