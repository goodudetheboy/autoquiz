
export async function createQuiz(request_body) {
    const response = await fetch(`/api/quiz/create`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(request_body)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const response_json = await response.json();

    return response_json;
}
