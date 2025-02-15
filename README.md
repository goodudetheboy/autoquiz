# autoquiz

## Testing

#### **Test Directory Structure**  

TBD

---

#### **Running Tests**  

#### **Run All Tests**  

To execute all unit tests:  

```bash
bash scripts/run_tests.sh
```

#### **Run All Model Tests**  

To run all tests inside `tests/unit/test_models/`:  

```bash
bash scripts/run_tests.sh model
```

#### **Run All Service Tests**  

To run all tests inside `tests/unit/test_services/`:  

```bash
bash scripts/run_tests.sh service
```

#### **Run a Specific Model Test**  

To run a specific model test, such as `test_user.py`:  

```bash
bash scripts/run_tests.sh model test_user
```

This runs `tests/unit/test_models/test_user.py`.

#### **Run a Specific Service Test**  

To run a specific service test, such as `test_user_service.py`:  

```bash
bash scripts/run_tests.sh service test_user_service
```

This runs `tests/unit/test_services/test_user_service.py`.

#### **Run All Model Tests Explicitly**  

To run all model-related tests:  

```bash
bash scripts/run_tests.sh model all
```

#### **Run All Service Tests Explicitly**  

To run all service-related tests:  

```bash
bash scripts/run_tests.sh service all
```

---

## **Script Behavior**  

- **No parameters**: Runs all tests using `unittest discover -s tests/unit`.  
- **First parameter: "model"**: Runs all tests in `tests/unit/test_models/`.  
- **First parameter: "service"**: Runs all tests in `tests/unit/test_services/`.  
- **First parameter + second parameter**: Runs a specific test file.  
- **First parameter + "all"**: Runs all tests in the specified category.  

---

## **Additional Notes**  

- The script automatically stops on the first failed test (`set -e` in Bash).  
- Tests are executed using Python’s built-in `unittest` module.  
- The script is located at `scripts/run_tests.sh`.  

---

## **Examples**  

| Command | Description |
|---------|-------------|
| `bash scripts/run_tests.sh` | Runs all tests. |
| `bash scripts/run_tests.sh model` | Runs all model-related tests. |
| `bash scripts/run_tests.sh service` | Runs all service-related tests. |
| `bash scripts/run_tests.sh model test_user` | Runs `tests/unit/test_models/test_user.py`. |
| `bash scripts/run_tests.sh service test_user_service` | Runs `tests/unit/test_services/test_user_service.py`. |
| `bash scripts/run_tests.sh model all` | Runs all tests in `tests/unit/test_models/`. |
| `bash scripts/run_tests.sh service all` | Runs all tests in `tests/unit/test_services/`. |

This document serves as a reference for executing tests in a structured and efficient manner.

## Contribution Guidelines

#### **Commit Message Tags**

To keep our commit history clean and organized, we use the following tags to categorize our commit messages:

- **`[feat]`**: A new feature or enhancement.
  - Example: `[feat] add user login functionality`
  
- **`[fix]`**: A bug fix.
  - Example: `[fix] correct login form validation`
  
- **`[docs]`**: Documentation changes or updates.
  - Example: `[docs] update README with setup instructions`
  
- **`[style]`**: Code style changes (e.g., formatting, white space, etc.).
  - Example: `[style] reformat code to conform to PEP 8`
  
- **`[refactor]`**: Code refactoring that doesn't change functionality.
  - Example: `[refactor] improve user authentication service`
  
- **`[test]`**: Adding or updating tests.
  - Example: `[test] add unit tests for User model`
  
- **`[chore]`**: Maintenance tasks (e.g., dependencies, build configuration).
  - Example: `[chore] update dependencies`
  
- **`[perf]`**: Performance improvements.
  - Example: `[perf] optimize image processing algorithm`
  
- **`[ci]`**: Continuous integration related changes.
  - Example: `[ci] update GitHub Actions workflow`
  
- **`[build]`**: Build system or external tool changes.
  - Example: `[build] update Dockerfile to include new base image`
  
- **`[release]`**: A release version tag.
  - Example: `[release] v1.0.0`
  
- **`[WIP]`**: Work in progress; unfinished commit.
  - Example: `[WIP] start implementing profile page`
