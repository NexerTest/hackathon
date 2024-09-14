const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Crear la app de Express
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Permitir solicitudes CORS

// Ajustar la ruta de la base de datos para que apunte a 'backend/database'
const dbPath = path.resolve(__dirname, '../backend/database/user_activities.db');
console.log(`Usando la base de datos desde: ${dbPath}`);

// Conectar a la base de datos SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
       
        // Consultar todas las tablas de la base de datos
        db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, rows) => {
            if (err) {
                console.error('Error al recuperar las tablas:', err.message);
            } else {
                console.log('Tablas en la base de datos:', rows);
            }
        });
    }
});

// Middleware para servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta para servir `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Ruta para obtener todos los perfiles
app.get('/profiles', (req, res) => {
    db.all('SELECT profile_type FROM profiles', (err, rows) => {
        if (err) {
            console.error('Error al obtener perfiles:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('Perfiles obtenidos de la base de datos:', rows);
        res.json({ profiles: rows });
    });
});

// Ruta para crear un nuevo perfil
app.post('/profiles', (req, res) => {
    const { profile_type } = req.body;
    const created_at = new Date().toISOString();
    console.log('Datos recibidos para crear perfil:', { profile_type, created_at });

    if (!profile_type) {
        return res.status(400).json({ error: 'El tipo de perfil es obligatorio' });
    }

    db.run(`INSERT INTO profiles (profile_type, created_at) VALUES (?, ?)`, [profile_type, created_at], function(err) {
        if (err) {
            console.error('Error al insertar perfil:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Perfil añadido con ID ${this.lastID}`);
        res.json({ id: this.lastID, profile_type, created_at });
    });
});

// Ruta para generar user story y casos de prueba
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
                    content: `You are a test case generator. Generate test cases based on the following user story. Provide the test cases in a format where each case has a number, description, steps, and expected result. Format each test case clearly, with the steps as a numbered list, and separate by line breaks: 1. **Test Case X: Title** - **Description:** Description - **Steps:** 1. Open the application. 2. Navigate to the specific UI component (e.g., form, button). 3. Perform the action (e.g., fill out the form, click the button). 4. Verify the result (e.g., form submission, button action). - **Expected Result:** Expected outcome of the action. Ensure the test cases focus on components such as forms, navigation bars, buttons, and other UI elements, and specify roles like developer, tester, product owner, or client where applicable.`
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

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
