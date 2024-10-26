Here’s some raw JSON you can use to test the endpoints in your Express application:

### 1. Create a User (POST `/`)
```json
{
  "email": "testuser@example.com",
  "password": "securepassword"
}
```

### 2. Onboard User (POST `/:id/onboarding`)
Replace `:id` with the user ID you receive from creating the user.
```json
{
  "role": "Software Developer",
  "experience": "5 years",
  "location": "New York",
  "desire": "Growth in career",
  "career": "Tech Lead"
}
```

### 3. Onboarding Questions (POST `/:id/onboardingQuestions`)
Replace `:id` with the user ID.
```json
{
  "q1": "What is your main goal?",
  "q2": "What technologies do you prefer?",
  "q3": "What is your experience level?",
  "q4": "What type of projects do you like?",
  "q5": "What is your preferred work environment?",
  "q6": "What are your salary expectations?",
  "q7": "What is your availability?",
  "q8": "Any additional comments?"
}
```

### 4. Get All Users (GET `/`)
No JSON needed; just send a request.

### 5. Get Onboarding Questions for a User (GET `/:id/onboardingQuestions`)
Replace `:id` with the user ID. No JSON needed; just send a request.

Make sure to adjust the `:id` placeholder in the URLs to match the actual user ID from your database.