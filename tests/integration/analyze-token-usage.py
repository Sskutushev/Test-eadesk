import json
import sys

if len(sys.argv) < 2:
  print("Usage: analyze-token-usage.py <session.jsonl>")
  sys.exit(1)

path = sys.argv[1]
total = 0
with open(path, "r", encoding="utf-8") as f:
  for line in f:
    try:
      data = json.loads(line)
      usage = data.get("usage") or {}
      total += int(usage.get("total_tokens", 0))
    except Exception:
      continue

print(f"total_tokens={total}")
