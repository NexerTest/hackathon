const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  try {
    // Llamada a la API para obtener la historia de usuario
    const userStoryResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are a user story generator. Always follow this format: "As a [ROLE], I want [FUNCTIONALITY] so that [BENEFIT]." Focus on components of a web page such as forms, navigation bars, buttons, and other UI elements.`
        },
        {
          role: 'user',
          content: 'Generate a user story with a role, functionality, and benefit related to a specific UI component on a web page.'
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      }
    });

    const userStory = userStoryResponse.data.choices[0]?.message?.content?.trim();
    if (!userStory) {
      throw new Error('User story not found in response');
    }

    // Llamada a la API para obtener los casos de prueba basados en la historia de usuario
    const testCasesResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are a test case generator. Generate test cases based on the following user story. Provide the test cases in a format where each case has a number, description, steps, and expected result. Format each test case clearly, with the steps as a numbered list, and separate by line breaks:
1. **Test Case X: Title**
   - **Description:** Description
   - **Steps:**
     1. Open the application.
     2. Navigate to the specific UI component (e.g., form, button).
     3. Perform the action (e.g., fill out the form, click the button).
     4. Verify the result (e.g., form submission, button action).
   - **Expected Result:** Expected outcome of the action.
Ensure the test cases focus on components such as forms, navigation bars, buttons, and other UI elements, and specify roles like developer, tester, product owner, or client where applicable.`
        },
        {
          role: 'user',
          content: `Generate test cases based on this user story: ${userStory}`
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      }
    });

    const testCasesText = testCasesResponse.data.choices[0]?.message?.content?.trim();
    if (!testCasesText) {
      throw new Error('Test cases not found in response');
    }

    // Procesar los test cases y formatear en columnas
    const testCases = testCasesText.split('\n\n').map(testCase => {
      const lines = testCase.split('\n').map(line => line.trim());
      const stepsIndex = lines.findIndex(line => line.startsWith('- **Steps:**'));
      return {
        number: lines[0]?.match(/Test Case (\d+)/)?.[1] || '',
        description: lines.find(line => line.startsWith('- **Description:**'))?.replace('- **Description:**', '').trim() || '',
        steps: stepsIndex !== -1 ? lines.slice(stepsIndex + 1, lines.findIndex((line, idx) => idx > stepsIndex && line.startsWith('- **Expected Result:**'))).join('\n').trim() : '',
        results: lines.find(line => line.startsWith('- **Expected Result:**'))?.replace('- **Expected Result:**', '').trim() || ''
      };
    });

    res.json({
      userStory: userStory,
      testCases: testCases
    });

  } catch (error) {
    console.error('Error generating user story and test cases:', error);
    res.status(500).json({ error: 'Error generating user story and test cases.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});