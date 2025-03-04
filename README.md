# autoquiz

## Feedback
- The generated quiz sometimes uses too specific examples in the notes. The example makes sense in the context of reading the notes, but loses meaning when standalone in the questions
  For example:
    ```
    Which page is read twice in the 'Repeated Scan' operation following a reset, as per the study note data?

    Page 2
    Page 5
    Page 4
    Page 1
    ```

    I might want to restrict the quiz question to be more abstract and focus more on concepts. Maybe I can give another settings for the users to tweak their own questions.

- It might also be a good idea to have one batch be focused on concepts and one batch be focused on examples. That way we have the best of both worlds.

- One optimization technique I think up of while shitting: Instead of separating context in between generation of sections, maybe we should also add a compounding summary after each of generation. For example, let's say we generate quiz for 10 sections. Instead of prompting to generate only the questions for section 1, we can also prompt to generate a quick overview of the section, which we can also add to generating questions for section 2. The cycle repeats.

- For static sectioning, I think I should also include from which note section does it come from also. Maybe not useful in the user perspective, but it might be useful for me, the devs, to see if any funny tomfoolery is going on.

- Add a "Session" that is a quiz interface with more details and shit using the generated quiz. A Session would have more functionality like gradings and mistakes and all that, while Quiz is just a template for a Session.

## API Documentation

### **Base URL**

```url
https://<specified URL here>
```

### **Authentication**

- Describe any authentication requirements here (e.g., token-based, OAuth, etc.).

---

### **Endpoints**
<!-- 
#### 1. **`GET /example/data`**
##### Description:
This endpoint retrieves example data based on a query parameter (`param`).

##### Request:
- **HTTP Method:** `GET`
- **Endpoint:** `/example/data`
- **Query Parameters:**
  - `param` (required): A string parameter used to fetch data from the service.

##### Example Request:
```
GET /example/data?param=value
```

##### Response:
- **HTTP Status Code:**
  - `200 OK`: When data is successfully retrieved.
  - `400 Bad Request`: If the `param` is missing or invalid.
- **Response Body (JSON):**
  ```json
  {
    "key": "value"
  }
  ```

##### Example Response:
```json
{
  "key": "mocked_value"
}
```

##### Expected Behavior:
- The API should return data corresponding to the value of the `param` query parameter.
- If `param` is not provided or is invalid, return a `400 Bad Request` with an error message.

--- -->

#### 2. **`POST /api/quiz/create`**

##### Description

This endpoint creates a list of quiz based on the given data in the request body.
Typically, this would contain a plaintext of a study note and sectioning
strategy.

##### Request

- **HTTP Method:** `POST`
- **Endpoint:** `/api/quiz/create`
- **Request Body (JSON):**

```json
{
  "debug_mode": "<true> special use for debugging, will return 5 valid MCQ questions. This overrides all other settings",
  "note_content": "<str> Content of a note the user wants to create quiz out of.",
  "sectioning_strategy": "<'static_sectioning'>The desired sectioning strategy to split the note_content for processing. Currently supports 'static_sectioning'.",
  "num_section": "<int> The number of sections by which the quiz will be split up.",
  "num_quiz_per_section": "<int> The number of quiz questions per section."
}
```

##### Example Request

```json
{
  "note_content": "Today we are going to learn about Computer Networking <1000 words more>",
  "sectioning_strategy": "static_sectioning",
  "num_section": 5,
  "num_quiz_per_section": 4
}
```

##### Response

- **HTTP Status Code:**
  - `200 OK`: When a quiz list is succesfully created.
  - `400 Bad Request`: If any required param field is missing in the request body.
- **Response Body (JSON):**

  ```json
  {
    "results": [
      {
        "question": "<str> The question for the quiz",
        "choices": [
          {
            "description": "<str> The description of the quiz",
            "is_correct": "<bool> Determines if this choice is correct or not" 
          },
          // More choices here
        ]
      },
      // More question here
    ]
  }
  ```

##### Example Response

```json
{
  "results": [
    {
      "question": "What is the primary function of the Internet Control Message Protocol (ICMP)?",
      "choices": [
        {
          "description": "To communicate issues in network transmissions to the source",
          "is_correct": true
        },
        {
          "description": "To establish secure connections between devices",
          "is_correct": false
        },
        {
          "description": "To provide high-speed data transfer",
          "is_correct": false
        },
        {
          "description": "To route data through the internet using IP addresses",
          "is_correct": false
        }
      ]
    },
    // More question here
  ]
}
```
<!-- 
##### Expected Behavior:
- The API should successfully create data based on the provided `param` field.
- If the `param` field is missing in the request body, return a `400 Bad Request` response with a relevant error message.

---

### **Error Responses**

- **400 Bad Request:** Indicates a malformed request or missing required parameters.
- **404 Not Found:** If the requested resource doesn't exist.
- **500 Internal Server Error:** If something goes wrong on the server.
 -->

## Testing

### **Test Directory Structure**  

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

### **Commit Message Tags**

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
