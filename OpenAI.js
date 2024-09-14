const axios = require('axios');

// Function to generate a user story and test cases
async function generateUserStoryAndTestCases() {
  const prompt = `
  Act as a QA Automation Tester. Your task is to generate a user story and, based on that story, create several test cases. 
  Follow these steps:

  1. Generate a user story in the following format:
     "As a [ROLE], I want [FUNCTIONALITY] so that [BENEFIT]."

  2. Based on the user story, create at least three test cases. Each test case should include:
     - Description: A summary of the test case.
     - Steps to Reproduce: The steps that need to be followed to execute the test case.
     - Expected Result: What is expected to happen after following the steps.

  Return the user story and test cases in JSON format with the following fields:
  - userStory: The generated user story.
  - testCases: A list of generated test cases, where each test case is an object with 'description', 'steps', and 'expectedResult'.
  `;

  const payload = {
    model: "gpt-4o-mini",  // Use the model you have
    messages: [
      {
        role: 'system',
        content: "You are an expert QA Automation Tester. You need to generate a user story and several test cases based on that story."
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  const config = {
    headers: {
      'Authorization': 'Bearer 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',  // Your API key
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, config);
    const result = response.data.choices[0].message.content;
    console.log('Generated result:', result);
  } catch (error) {
    console.error('Error generating user story and test cases:', error);
  }
}

// Execute the function
generateUserStoryAndTestCases();
