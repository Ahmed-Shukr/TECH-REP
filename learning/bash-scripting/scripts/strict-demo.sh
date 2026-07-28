#!/usr/bin/env bash
# Module 07 companion — strict mode and intentional failure

set -euo pipefail

log() {
  printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" >&2
}

need_arg() {
  if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <word>" >&2
    echo "Try: $0 hello   or   $0 boom" >&2
    exit 2
  fi
}

main() {
  need_arg "$@"
  local word=$1
  log "received: $word"

  if [[ "$word" == "boom" ]]; then
    log "simulating failure"
    false
  fi

  log "success"
  echo "Handled '$word' cleanly"
}

main "$@"
