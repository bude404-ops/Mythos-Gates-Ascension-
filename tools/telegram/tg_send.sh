#!/bin/bash
# tg_send.sh — Telegram send with DUPLICATE PROTECTION
# Blocks identical sends (same chat + same content) within the TTL window.
# Fixes the double-response issue: if an agent turn is interrupted/restarted
# and the send is retried, the ledger blocks the second identical send.
#
# Usage:
#   tg_send.sh <chat_id> <TOKEN_ENV_VAR> text  "message text"
#   tg_send.sh <chat_id> <TOKEN_ENV_VAR> photo /path/to/photo "caption"
#   tg_send.sh <chat_id> <TOKEN_ENV_VAR> markdown "message text"

set -u
LEDGER="/app/.agents/.tg_ledger.log"
TTL="${TG_SEND_TTL:-600}"   # duplicate window in seconds (default 10 min)

CHAT_ID="$1"; TOKEN_VAR="$2"; MODE="$3"; PAYLOAD="$4"; CAPTION="${5:-}"
TOKEN="${!TOKEN_VAR:-}"
[ -z "$TOKEN" ] && { echo "ERROR: token env var '$TOKEN_VAR' not set" >&2; exit 1; }
[ -z "$CHAT_ID" ] && { echo "ERROR: chat_id required" >&2; exit 1; }

mkdir -p /app/.agents
NOW=$(date +%s)

# Build content fingerprint
case "$MODE" in
  photo)
    [ ! -f "$PAYLOAD" ] && { echo "ERROR: photo file not found: $PAYLOAD" >&2; exit 1; }
    FPHASH=$(md5sum "$PAYLOAD" | cut -d' ' -f1)
    CONTENT="${MODE}:${FPHASH}:${CAPTION}"
    ;;
  text|markdown)
    CONTENT="${MODE}:${PAYLOAD}"
    ;;
  *)
    echo "ERROR: mode must be text|markdown|photo" >&2; exit 1
    ;;
esac

KEY=$(printf '%s:%s:%s' "$CHAT_ID" "$TOKEN_VAR" "$CONTENT" | md5sum | cut -d' ' -f1)

# Duplicate check — same key sent within TTL?
if [ -f "$LEDGER" ]; then
  MATCH=$(awk -v key="$KEY" -v cutoff=$((NOW - TTL)) -F'|' \
    '$1==key && $2 > cutoff {print $2}' "$LEDGER" | tail -1)
  if [ -n "$MATCH" ]; then
    echo "BLOCKED-DUPLICATE key=${KEY:0:10} chat=$CHAT_ID (${MODE})"
    exit 0
  fi
fi

# Send
case "$MODE" in
  photo)
    RESP=$(curl -s --max-time 60 "https://api.telegram.org/bot${TOKEN}/sendPhoto" \
      -F "chat_id=${CHAT_ID}" -F "photo=@${PAYLOAD}" -F "caption=${CAPTION}" 2>&1)
    ;;
  markdown)
    RESP=$(curl -s --max-time 30 "https://api.telegram.org/bot${TOKEN}/sendMessage" \
      --data-urlencode "chat_id=${CHAT_ID}" \
      --data-urlencode "text=${PAYLOAD}" \
      --data-urlencode "parse_mode=HTML" 2>&1)
    ;;
  text)
    RESP=$(curl -s --max-time 30 "https://api.telegram.org/bot${TOKEN}/sendMessage" \
      --data-urlencode "chat_id=${CHAT_ID}" \
      --data-urlencode "text=${PAYLOAD}" 2>&1)
    ;;
esac

# Record ONLY on confirmed success
if printf '%s' "$RESP" | grep -q '"ok":true'; then
  echo "${KEY}|${NOW}" >> "$LEDGER"
  tail -500 "$LEDGER" > "${LEDGER}.tmp" 2>/dev/null && mv "${LEDGER}.tmp" "$LEDGER"
  echo "SENT ${MODE} chat=${CHAT_ID} ok"
  exit 0
else
  echo "SEND-FAILED: $RESP" >&2
  exit 2
fi
