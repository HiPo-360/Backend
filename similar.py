# import os
# from openai import AzureOpenAI

# # Directly provide the endpoint and deployment values
# endpoint = "https://hipo-openai.openai.azure.com/"
# deployment = "openai-test"
# api_key = "0f534cc13f2e43e884220e0bdbcd6723"  # Replace with your actual API key

# client = AzureOpenAI(
#     azure_endpoint=endpoint,
#     api_key=api_key,  # Use the API key for authentication
#     api_version="2024-05-01-preview"
# )

# # Lists of sentences to compare
# set1 = [
#     "I enjoy hiking in the mountains.",
#     "Reading books is my favorite hobby.",
#     "Cooking new recipes is fun."
# ]

# set2 = [
#     "I love going on mountain hikes.",
#     "My favorite pastime is reading books.",
#     "Trying out new recipes is enjoyable."
# ]

# # Function to compare sentences for similarity
# def compare_sentences(sentence1, sentence2):
#     prompt = f"Determine if the following two sentences are similar or have the same meaning:\n\nSentence 1: {sentence1}\nSentence 2: {sentence2}\n\nAre these sentences similar or not? Please provide a brief explanation."
#     completion = client.chat.completions.create(
#         model=deployment,
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         max_tokens=150,
#         temperature=0.5,
#         top_p=1.0,
#         frequency_penalty=0,
#         presence_penalty=0,
#         stop=None,
#         stream=False
#     )
#     return completion.choices[0].message.content.strip()

# # Compare each sentence in set1 with each sentence in set2
# for sentence1 in set1:
#     for sentence2 in set2:
#         result = compare_sentences(sentence1, sentence2)
#         print(f"Sentence 1: {sentence1}\nSentence 2: {sentence2}\nResult: {result}\n")

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

# Lists of sentences to compare
set1 = [
    "I love painting landscapes.",
    "Taking care of plants brings me satisfaction",
    "Cooking new recipes is fun."
]

set2 = [
    "I love going on mountain hikes.",
    "My favorite pastime is reading books.",
    "Trying out new recipes is enjoyable."
]



# Function to compare sentences for similarity
def compare_sentences(sentence1, sentence2):
    prompt = f"Determine if the following two sentences are similar or have the same meaning:\n\nSentence 1: {sentence1}\nSentence 2: {sentence2}\n\nAre these sentences similar or not? Please provide a brief explanation."
    completion = client.chat.completions.create(
        model=deployment,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=150,
        temperature=0.5,
        top_p=1.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False
    )
    response = completion.choices[0].message.content.strip()
    if "Yes" in response:
        return response
    return None

# Compare each sentence in set1 with each sentence in set2
for sentence1 in set1:
    for sentence2 in set2:
        result = compare_sentences(sentence1, sentence2)
        if result:
            print(f"Sentence 1: {sentence1}\nSentence 2: {sentence2}\nResult: {result}\n")
