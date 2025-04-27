#!/bin/bash

if [ ! -d "./venv" ]; then
  echo "Environment has not been initialized yet, doing it now"
  ./scripts/init.sh
fi

if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
  # Deploy on Windows
  source venv/Scripts/activate
  waitress-serve --listen=127.0.0.1:5000 app:app
else
  # Deploy on Linux
  source venv/bin/activate
  gunicorn -w 4 -b 127.0.0.1:5000 wsgi:app
fi
