const axios = require('axios');

// Function to generate a user story and test cases based on UI elements
async function generateUserStoryAndTestCases() {
  const prompt = `
  Act as a QA Automation Tester. Your task is to generate a user story and, based on that story, create several test cases. 
  Make sure to include various UI elements in your test cases such as navigation bars, forms, footers, and different page blocks. 
  Follow these steps:

  1. Generate a user story in the following format:
     "As a [ROLE], I want [FUNCTIONALITY] so that [BENEFIT]."
     Ensure the user story is relevant to a web application with diverse UI components.

  2. Based on the user story, create at least three test cases. Each test case should cover different UI elements and include:
     - Description: A summary of the test case.
     - Steps to Reproduce: The steps that need to be followed to execute the test case.
     - Expected Result: What is expected to happen after following the steps.

  Examples of UI elements to include in your test cases:
  - Navigation bars: Verify links, dropdowns, or menus.
  - Forms: Check input validation, form submission, and error handling.
  - Footers: Validate the presence of links, copyright information, and other footer elements.
  - Page blocks: Test content visibility, interactive elements, and layout consistency.

  Return the user story and test cases in JSON format with the following fields:
  - userStory: The generated user story.
  - testCases: A list of generated test cases, where each test case is an object with 'description', 'steps', and 'expectedResult'.
  `;

  const payload = {
    model: "gpt-4o-mini",  // Use the model you have
    messages: [
      {
        role: 'system',
        content: "You are an expert QA Automation Tester. Generate a user story and several test cases based on various UI elements."
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
