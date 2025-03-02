#!/bin/bash

if [ ! -d "./venv" ]; then
  echo "Environment has not been initialized yet, doing it now"
  ./scripts/init.sh
fi

if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
  source venv/Scripts/activate
else
  source venv/bin/activate
fi

export FLASK_ENV=development
export TESTING=true
flask --app api run --debug 
