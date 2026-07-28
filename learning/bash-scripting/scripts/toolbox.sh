#!/usr/bin/env bash
# Module 04 companion — small function toolkit

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: toolbox.sh <command>

Commands:
  ping    Print a friendly status line
  disk    Show disk usage for /
  help    Show this help
EOF
}

cmd_ping() {
  echo "pong — $(date '+%Y-%m-%d %H:%M:%S')"
}

cmd_disk() {
  df -h /
}

main() {
  local cmd=${1:-help}
  case "$cmd" in
    ping) cmd_ping ;;
    disk) cmd_disk ;;
    help|-h|--help) usage ;;
    *)
      echo "Unknown command: $cmd" >&2
      usage >&2
      exit 1
      ;;
  esac
}

main "$@"
