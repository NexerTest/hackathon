// Importing directly from the OpenAI package
const OpenAI = require('openai');

// Initialize the OpenAI API with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this key is set in your .env file
});

// Function to generate a user profile using OpenAI
async function generateUserProfile(profileType) {
    let prompt;

    switch (profileType) {
        case 'experienced':
            prompt = "Create an experienced user profile...";
            break;
        case 'impulsive':
            prompt = "Create an impulsive user profile...";
            break;
        // Add more profile cases here
        default:
            throw new Error('Invalid profile type');
    }

    try {
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 300,
        });

        return response.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating profile:', error);
        throw error;
    }
}

module.exports = { generateUserProfile };
