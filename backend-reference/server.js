
// Node.js Express Server for ExamPro Educational Management System
// Install dependencies: npm install express mysql2 bcryptjs jsonwebtoken cors dotenv

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'exampro_db'
};

let db;

async function initDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get current user
        const [rows] = await db.execute(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await db.execute(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hashedNewPassword, userId]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Students Routes
app.get('/api/students', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT s.id, u.name, u.email, s.filiere_id, f.name as filiere_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN filieres f ON s.filiere_id = f.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', authenticateToken, async (req, res) => {
    try {
        const { name, email, filiereId } = req.body;
        
        // Create user first
        const defaultPassword = 'student123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        const [userResult] = await db.execute(
            'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, 'student', name]
        );

        // Create student record
        await db.execute(
            'INSERT INTO students (user_id, filiere_id) VALUES (?, ?)',
            [userResult.insertId, filiereId]
        );

        res.json({ message: 'Student created successfully', id: userResult.insertId });
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Grades Routes
app.get('/api/grades', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT g.*, s.id as student_id, u.name as student_name, m.name as module_name
            FROM grades g
            JOIN students s ON g.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN modules m ON g.module_id = m.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get grades error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/grades', authenticateToken, async (req, res) => {
    try {
        const { studentId, moduleId, grade } = req.body;
        const status = grade >= 10 ? 'admis' : grade === 0 ? 'en-attente' : 'non-admis';

        await db.execute(`
            INSERT INTO grades (student_id, module_id, grade, status) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE grade = ?, status = ?
        `, [studentId, moduleId, grade, status, grade, status]);

        res.json({ message: 'Grade updated successfully' });
    } catch (error) {
        console.error('Update grade error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Exams Routes
app.get('/api/exams', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, m.name as module_name, m.code as module_code
            FROM exams e
            JOIN modules m ON e.module_id = m.id
            ORDER BY e.exam_date, e.exam_time
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Modules Routes
app.get('/api/modules', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT m.*, f.name as filiere_name, u.name as teacher_name
            FROM modules m
            JOIN filieres f ON m.filiere_id = f.id
            LEFT JOIN teachers t ON m.teacher_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get modules error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Filieres Routes
app.get('/api/filieres', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM filieres');
        res.json(rows);
    } catch (error) {
        console.error('Get filieres error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// System Settings Routes
app.get('/api/settings', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM system_settings');
        res.json(rows);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/settings/:key', authenticateToken, async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        await db.execute(
            'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
            [value, key]
        );

        res.json({ message: 'Setting updated successfully' });
    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
