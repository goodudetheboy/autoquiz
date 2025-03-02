#!/bin/bash

python -m venv venv

if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
  echo "Initializing on Windows"
  source venv/Scripts/activate
else
  echo "Initializing on Linux"
  source venv/bin/activate
fi

pip install -r requirements.txt
