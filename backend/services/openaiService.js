const OpenAI = require('openai');

// Initialize OpenAI with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate possible user activities based on their profile, including element and action type
async function generateUserActivities(profileType) {
    let prompt;

    switch (profileType) {
        case 'experienced':
            prompt = `
            Generate a list of activities for an experienced user (25-45 years old, advanced technical skills, high web navigation experience) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, link, form)
            - The type of action (e.g., click, form submission)
            `;
            break;
        case 'inexperienced':
            prompt = `
            Generate a list of activities for an inexperienced user (18-35 years old, medium-low web navigation experience, moderate technical skills) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, link, form)
            - The type of action (e.g., click, form submission)
            `;
            break;
        case 'low_tech_skills':
            prompt = `
            Generate a list of activities for a user with low technical skills (50+ years old, low web navigation experience, low technical skills) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, navigation link, help section)
            - The type of action (e.g., click, struggling with navigation, form submission)
            `;
            break;
        case 'novice':
            prompt = `
            Generate a list of activities for a novice user (18-25 years old, very low web navigation experience, low technical skills) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., navigation links, product images, buttons)
            - The type of action (e.g., random clicking, back-and-forth navigation, frustration with forms)
            `;
            break;
        case 'explorer':
            prompt = `
            Generate a list of activities for an explorer user (25-40 years old, medium-high web navigation experience, high technical skills) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., advanced filters, category menus, sorting options)
            - The type of action (e.g., exploring filters, navigating product categories, testing features)
            `;
            break;
        case 'indecisive':
            prompt = `
            Generate a list of activities for an indecisive user (age variable, medium web navigation experience, moderate technical skills) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., comparison tools, cart, product pages)
            - The type of action (e.g., adding and removing items from the cart, revisiting products, hesitating at checkout)
            `;
            break;
        case 'impulsive':
            prompt = `
            Generate a list of activities for an impulsive user (18-35 years old, medium web navigation experience, high technical skills) on an e-commerce website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., promotional banners, product pages, buy buttons)
            - The type of action (e.g., clicking on promotions, making fast purchases, skipping reviews)
            `;
            break;
        default:
            return null;
    }

    try {
        // Make the API request to generate the activities
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // Use a chat-based model
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
        });

        // Parse the generated activities and format them as JSON
        const activities = response.choices[0].message.content.trim().split('\n').filter(Boolean).map(activity => {
            const parts = activity.split(' - ');  // Assume each activity follows the format: Activity - Element - Action
            return {
                activity: parts[0] || 'Unknown activity',
                element: parts[1] || 'Unknown element',
                action_type: parts[2] || 'Unknown action'
            };
        });

        return activities;
    } catch (error) {
        console.error('Error generating user activities:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { generateUserActivities };
