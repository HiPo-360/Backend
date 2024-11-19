from azure.core.credentials import AzureKeyCredential
from azure.ai.openai import AzureOpenAI

# Azure OpenAI client setup
endpoint = "https://hipo-ai.openai.azure.com/"
api_key = "1Uty3zR2yIuFmz75r9nDwkAh3mLbNbWZu4XlFDn6AjBoP9foaAE0JQQJ99AJACYeBjFXJ3w3AAAAACOGOqBp"
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=api_key,
    api_version="2024-05-01-preview"
)

def analyze_sentiment_with_gpt(paragraph, keywords):
    # Prepare the prompt for GPT model
    prompt = f"""
    Please analyze the sentiment of the following paragraph with respect to these keywords: {', '.join(keywords)}. 
    For each keyword, determine if the sentiment is positive, negative, or neutral based on its context in the paragraph.
    
    Paragraph: "{paragraph}"

    Provide the sentiment for each keyword in the following format:
    - Keyword: Sentiment
    """
    
    # Make a call to the GPT model with the constructed prompt
    response = client.completion(
        model="gpt-4",
        prompt=prompt,
        max_tokens=100,
        temperature=0.5
    )
    
    # Parse and return the sentiment results
    sentiment_output = response.result['choices'][0]['text']
    return sentiment_output

# List of keywords to match
keywords = ["leadership", "motivation", "teamwork", "stress", "failure"]

# User's input paragraph
paragraph = "Innovation and creativity are crucial for progress in any industry. New ideas challenge the status quo, pushing us toward better solutions and encouraging constant improvement."

# Get sentiment analysis for each keyword in the paragraph
sentiment_for_keywords = analyze_sentiment_with_gpt(paragraph, keywords)

# Print the results
print("Sentiment analysis for each keyword:")
print(sentiment_for_keywords)
