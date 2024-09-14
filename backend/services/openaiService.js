const OpenAI = require('openai');
const puppeteer = require('puppeteer');

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
            Generate a list of detailed activities for an experienced user (25-45 years old, advanced technical skills, high web navigation experience) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, link, form, input field, etc.)
            - The type of action (e.g., click, form submission, typing)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
            `;
            break;
        case 'inexperienced':
            prompt = `
            Generate a list of detailed activities for an inexperienced user (18-35 years old, medium-low web navigation experience, moderate technical skills) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, link, form, input field, etc.)
            - The type of action (e.g., click, form submission, typing)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
            `;
            break;
        case 'low_tech_skills':
            prompt = `
            Generate a list of detailed activities for a user with low technical skills (50+ years old, low web navigation experience) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, link, form, input field, etc.)
            - The type of action (e.g., click, form submission, typing)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
            `;
            break;
        case 'novice':
            prompt = `
            Generate a list of detailed activities for a novice user (18-25 years old, very low web navigation experience, low technical skills) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., button, link, form, input field, etc.)
            - The type of action (e.g., random clicks, typing, struggling with form submission)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
            `;
            break;
        case 'explorer':
            prompt = `
            Generate a list of detailed activities for an explorer user (25-40 years old, medium-high web navigation experience, high technical skills) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., category menu, advanced filters, product links)
            - The type of action (e.g., click, exploring filters, sorting)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
            `;
            break;
        case 'indecisive':
            prompt = `
            Generate a list of detailed activities for an indecisive user (age variable, medium web navigation experience, moderate technical skills) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., cart, product pages, comparison tools)
            - The type of action (e.g., adding and removing items from cart, revisiting product pages, hesitating at checkout)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
            `;
            break;
        case 'impulsive':
            prompt = `
            Generate a list of detailed activities for an impulsive user (18-35 years old, medium web navigation experience, high technical skills) on an informative website.
            Each activity should include:
            - Activity description
            - The HTML element involved (e.g., promotional banners, buy buttons)
            - The type of action (e.g., clicking promotions, making quick purchases, skipping reviews)
            Format each activity as:
            1. Activity: <Activity Description>
            2. HTML Element: <HTML Element>
            3. Action: <Action Type>
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

        // Split and parse the OpenAI response content
        const activities = response.choices[0].message.content.trim().split('\n\n').map((block) => {
            const activityMatch = block.match(/Activity: (.+)/);
            const elementMatch = block.match(/HTML Element: (.+)/);
            const actionMatch = block.match(/Action: (.+)/);

            return {
                activity: activityMatch ? activityMatch[1] : 'Unknown activity',
                element: elementMatch ? elementMatch[1] : 'Unknown element',
                action_type: actionMatch ? actionMatch[1] : 'Unknown action',
            };
        });

        return activities;
    } catch (error) {
        console.error('Error generating user activities:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to simulate user activities using Puppeteer
async function simulateUserActions(url, activities) {
    const browser = await puppeteer.launch({ headless: false });  // Set to false to see the browser in action
    const page = await browser.newPage();
    await page.goto(url);

    for (const activity of activities) {
        try {
            console.log(`Executing activity: ${activity.activity}`);

            if (activity.element === 'Unknown element' || activity.action_type === 'Unknown action') {
                console.log('Skipping unknown activity...');
                continue;
            }

            switch (activity.action_type.toLowerCase()) {
                case 'click':
                    await page.click(activity.element);
                    break;
                case 'typing':
                    await page.type(activity.element, 'test input');  // Replace 'test input' with actual text if needed
                    break;
                case 'form submission':
                    await page.$eval(activity.element, form => form.submit());
                    break;
                case 'scroll and click':
                    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                    await page.click(activity.element);
                    break;
                case 'select':
                    await page.select(activity.element, 'value');  // Replace 'value' with actual option if needed
                    break;
                default:
                    console.log(`Unknown action type: ${activity.action_type}`);
            }
        } catch (error) {
            console.error(`Error executing activity ${activity.activity}:`, error);
        }
    }

    await browser.close();
}

module.exports = { generateUserActivities, simulateUserActions };
