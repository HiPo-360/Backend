const axios = require('axios');

// Directly provide the endpoint and deployment values
const endpoint = 'https://hipo-openai.openai.azure.com';
const deployment = 'openai-test';
const apiKey = '0f534cc13f2e43e884220e0bdbcd6723'; // Replace with your actual API key

// Lists for questions, answers, and prompts
const questions = [
  "How would you describe your leadership style?",
  "What motivates you in your work?",
  "How do you handle conflict in a team?"
];

const answers = [
  "I believe in leading by example and empowering my team members to take ownership of their projects.",
  "I am motivated by the opportunity to solve complex problems and deliver impactful results for my clients.",
  "I address conflicts directly and seek to understand all perspectives before working towards a resolution."
];

const prompts = [
  "Based on the following answer, provide detailed insights and analysis on leadership style:",
  "Based on the following answer, provide detailed insights and analysis on work motivation:",
  "Based on the following answer, provide detailed insights and analysis on handling team conflict:"
];

// Function to generate insights for a question and answer pair
async function generateInsights(prompt, question, answer) {
  const fullPrompt = `${prompt}\n\nQuestion: ${question}\nAnswer: ${answer}\n\nInsights:`;

  try {
    const response = await axios.post(`${endpoint}/openai/deployments/${deployment}/completions?api-version=2024-05-01-preview`, {
      prompt: fullPrompt,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error generating insights:', error.response ? error.response.data : error.message);
    return '';
  }
}

// Loop through each question, answer, and prompt to generate insights
(async () => {
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answer = answers[i];
    const prompt = prompts[i];
    const insights = await generateInsights(prompt, question, answer);
    console.log(`Question: ${question}\nAnswer: ${answer}\nInsights: ${insights}\n\n`);
  }
})();
