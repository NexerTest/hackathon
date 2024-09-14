const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
 
// Crear la app de Express
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Permitir solicitudes CORS
 
// Ajustar la ruta de la base de datos para que apunte a 'backend/database'
const dbPath = path.resolve(__dirname, '../backend/database/user_activities.db'); // Ruta corregida
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
  db.all('SELECT profile_type FROM profiles p ', (err, rows) => {
    if (err) {
      console.error('Error al obtener perfiles:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Perfiles obtenidos de la base de datos:', rows); // Verificar los datos obtenidos en la consola del servidor
    res.json({ profiles: rows });
  });
});
 
// Ruta para crear un nuevo perfil
app.post('/profiles', (req, res) => {
  const { profile_type } = req.body;
  const created_at = new Date().toISOString(); // Captura la fecha actual
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
 
// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 