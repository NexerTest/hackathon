const OpenAI = require('openai');

// Initialize OpenAI with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate possible user activities based on their profile
async function generateUserActivities(profileType) {
    let prompt;

    switch (profileType) {
        case 'experienced':
            prompt = `
            Generate a list of activities that an experienced user (25-45 years old, advanced technical skills, high web navigation experience) might perform on an e-commerce website.
            Include actions such as:
            - Fast navigation (visiting product pages and categories)
            - Form submissions (e.g., filling out checkout forms)
            - Clicking buttons (e.g., add to cart, buy now)
            - Interacting with advanced filters or sorting options
            - Quick decision-making with minimal errors.
            `;
            break;
        case 'inexperienced':
            prompt = `
            Generate a list of activities that an inexperienced user (18-35 years old, medium-low web navigation experience, moderate technical skills) might perform on an e-commerce website.
            Include actions such as:
            - Slow navigation through product categories
            - Mistakes in filling out forms (e.g., incorrect input fields)
            - Clicking on help or support links
            - Delaying decisions on product purchases
            - Frequently revisiting the same product pages.
            `;
            break;
        case 'low_tech_skills':
            prompt = `
            Generate a list of activities that a user with low technical skills (50+ years old, low web navigation experience, low technical skills) might perform on an e-commerce website.
            Include actions such as:
            - Struggling to navigate between different menus
            - Clicking on incorrect buttons multiple times
            - Slow form submissions, requiring guidance for each field
            - Confusion over checkout steps or options
            - Requesting assistance through support pages.
            `;
            break;
        case 'novice':
            prompt = `
            Generate a list of activities that a novice user (18-25 years old, very low web navigation experience, low technical skills) might perform on an e-commerce website.
            Include actions such as:
            - Random navigation across product categories
            - Clicking many incorrect links or buttons
            - Frustration with form inputs and repeated mistakes
            - Giving up on purchases due to confusion
            - Erratic behavior with multiple back-and-forth actions.
            `;
            break;
        case 'explorer':
            prompt = `
            Generate a list of activities that an explorer user (25-40 years old, medium-high web navigation experience, high technical skills) might perform on an e-commerce website.
            Include actions such as:
            - Exploring various product filters and sorting options
            - Testing out advanced features or tools available on the site
            - Clicking on multiple categories and subcategories to see all options
            - Experimenting with different settings or preferences
            - Navigating quickly but spending time on exploring new features.
            `;
            break;
        case 'indecisive':
            prompt = `
            Generate a list of activities that an indecisive user (age variable, medium web navigation experience, moderate technical skills) might perform on an e-commerce website.
            Include actions such as:
            - Pausing frequently between browsing products
            - Adding items to the cart and removing them several times
            - Frequently comparing different products or pages
            - Delaying decision-making during the checkout process
            - Seeking reviews or external opinions before purchasing.
            `;
            break;
        case 'impulsive':
            prompt = `
            Generate a list of activities that an impulsive user (18-35 years old, medium web navigation experience, high technical skills) might perform on an e-commerce website.
            Include actions such as:
            - Quickly navigating through product pages
            - Making fast purchase decisions without thorough review
            - Clicking on flashy promotions or offers
            - Overlooking important details, such as terms or return policies
            - Frequently adding items to the cart and buying them impulsively.
            `;
            break;
        default:
            prompt = `Please select a valid profile type to generate user activities.`;
            break;
    }

    try {
        // Make the API request to generate the activities
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // Use a chat-based model
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
        });

        // Return the generated list of activities
        return response.choices[0].message.content.trim().split('\n').filter(Boolean);
    } catch (error) {
        console.error('Error generating user activities:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { generateUserActivities };
