import os
from openai import AzureOpenAI

# Directly provide the endpoint and deployment values
endpoint = "https://hipo-openai.openai.azure.com/"
deployment = "openai-test"
api_key = "0f534cc13f2e43e884220e0bdbcd6723"  # Replace with your actual API key

client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=api_key,  # Use the API key for authentication
    api_version="2024-05-01-preview"
)

# Lists for questions, answers, and prompts
questions = [
    "How would you describe your leadership style?",
    "What motivates you in your work?",
    "How do you handle conflict in a team?"
]

answers = [
    "I believe in leading by example and empowering my team members to take ownership of their projects.",
    "I am motivated by the opportunity to solve complex problems and deliver impactful results for my clients.",
    "I address conflicts directly and seek to understand all perspectives before working towards a resolution."
]

prompts = [
    "Based on the following answer, provide detailed insights and analysis on leadership style:",
    "Based on the following answer, provide detailed insights and analysis on work motivation:",
    "Based on the following answer, provide detailed insights and analysis on handling team conflict:"
]


# Function to generate insights for a question and answer pair
def generate_insights(prompt, question, answer):
    full_prompt = f"{prompt}\n\nQuestion: {question}\nAnswer: {answer}\n\nInsights:"
    completion = client.chat.completions.create(
        model=deployment,
        messages=[
            {
                "role": "user",
                "content": full_prompt
            }
        ],
        max_tokens=800,
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False
    )
    return completion.choices[0].message.content

# Loop through each question, answer, and prompt to generate insights
for question, answer, prompt in zip(questions, answers, prompts):
    insights = generate_insights(prompt, question, answer)
    print(f"Question: {question}\nAnswer: {answer}\nInsights: {insights}\n\n")

