# Backend

Here's a set of example JSON requests for testing each endpoint in Postman:

### 1. **Get All Users** (`GET /users`)
This endpoint doesn't require any body data.

- **Request Type:** `GET`
- **URL:** `/users`

### 2. **Create a New User** (`POST /users`)

- **Request Type:** `POST`
- **URL:** `/users`
- **Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### 3. **Update Onboarding Data** (`POST /users/:id/onboarding`)

- **Request Type:** `POST`
- **URL:** `/users/{id}/onboarding`
- **Body (raw JSON):**
```json
{
  "role": "Software Engineer",
  "experience": "5 years",
  "location": "New York, NY",
  "desire": "Full-time remote work",
  "career": "Advancing to a senior position"
}
```

### 4. **Update Onboarding Questions** (`POST /users/:id/onboardingQuestions`)

- **Request Type:** `POST`
- **URL:** `/users/{id}/onboardingQuestions`
- **Body (raw JSON):**
```json
{
  "q1": "What are your strengths?",
  "q2": "What are your weaknesses?",
  "q3": "Where do you see yourself in 5 years?",
  "q4": "Why do you want this job?",
  "q5": "Describe a challenging project you worked on.",
  "q6": "How do you handle tight deadlines?",
  "q7": "What motivates you?",
  "q8": "What is your ideal work environment?"
}
```

### 5. **Get Onboarding Questions for a Specific User** (`GET /users/:id/onboardingQuestions`)

- **Request Type:** `GET`
- **URL:** `/users/{id}/onboardingQuestions`

This endpoint does not require any body data.

### Note:
- Replace `{id}` with the actual user ID you want to test against.
- Ensure that the Content-Type is set to `application/json` in the headers for the POST requests.

