#!/bin/bash

# Ensure script fails on first error
set -e

# Get the specified test category and test file
TEST_CATEGORY=$1
TEST_FILE=$2

# Define base test paths
MODEL_TEST_PATH="tests/unit/test_models"
SERVICE_TEST_PATH="tests/unit/test_services"
API_TEST_PATH="tests/api"

# Determine which set of tests to run
if [ "$TEST_CATEGORY" == "model" ]; then
    if [ -n "$TEST_FILE" ]; then
        if [ "$TEST_FILE" == "all" ]; then
            echo "Running all model tests..."
            python -m unittest discover -s "$MODEL_TEST_PATH"
        else
            echo "Running test: $MODEL_TEST_PATH/$TEST_FILE.py"
            python -m unittest "$MODEL_TEST_PATH/$TEST_FILE.py"
        fi
    else
        echo "Running all model tests..."
        python -m unittest discover -s "$MODEL_TEST_PATH"
    fi
elif [ "$TEST_CATEGORY" == "service" ]; then
    if [ -n "$TEST_FILE" ]; then
        if [ "$TEST_FILE" == "all" ]; then
            echo "Running all service tests..."
            python -m unittest discover -s "$SERVICE_TEST_PATH"
        else
            echo "Running test: $SERVICE_TEST_PATH/$TEST_FILE.py"
            python -m unittest "$SERVICE_TEST_PATH/$TEST_FILE.py"
        fi
    else
        echo "Running all service tests..."
        python -m unittest discover -s "$SERVICE_TEST_PATH"
    fi
elif [ "$TEST_CATEGORY" == "api" ]; then
    if [ -n "$TEST_FILE" ]; then
        if [ "$TEST_FILE" == "all" ]; then
            echo "Running all API tests..."
            python -m unittest discover -s "$API_TEST_PATH"
        else
            echo "Running test: $API_TEST_PATH/$TEST_FILE.py"
            python -m unittest "$API_TEST_PATH/$TEST_FILE.py"
        fi
    else
        echo "Running all API tests..."
        python -m unittest discover -s "$API_TEST_PATH"
    fi
else
    echo "Running all tests..."
    python -m unittest discover -s tests/unit
fi
