#!/usr/bin/env bash
# Module 01 companion — hello

echo "Hello from Bash"
echo "User: ${USER:-unknown}"
echo "Home: ${HOME:-unknown}"
echo "PWD:  $(pwd)"
echo "Bash: $BASH_VERSION"
