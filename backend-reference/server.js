
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
        
        // Create database if it doesn't exist
        await db.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await db.execute(`USE ${dbConfig.database}`);
        
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

    jwt.verify(token, process.env.JWT_SECRET || 'exampro_secret_key_2024', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Role middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
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
            process.env.JWT_SECRET || 'exampro_secret_key_2024',
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

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

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

// Admin Routes
app.post('/api/admin/change-user-password', authenticateToken, requireRole(['administrator']), async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await db.execute(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hashedNewPassword, userId]
        );

        res.json({ message: 'User password updated successfully' });
    } catch (error) {
        console.error('Admin change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/users', authenticateToken, requireRole(['administrator']), async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/users', authenticateToken, requireRole(['administrator']), async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        // Default password for new users
        const defaultPassword = 'temp123456';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, role, name]
        );

        res.json({ 
            message: 'User created successfully', 
            id: result.insertId,
            defaultPassword: defaultPassword 
        });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

app.delete('/api/admin/users/:id', authenticateToken, requireRole(['administrator']), async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Students Routes
app.get('/api/students', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT s.id, u.name, u.email, s.filiere_id, f.name as filiere_name, s.student_number, s.enrollment_date
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN filieres f ON s.filiere_id = f.id
            ORDER BY u.name
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', authenticateToken, requireRole(['administrator', 'director']), async (req, res) => {
    try {
        const { name, email, filiereId } = req.body;
        
        const defaultPassword = 'student123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        const [userResult] = await db.execute(
            'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, 'student', name]
        );

        // Generate student number
        const studentNumber = `STU${new Date().getFullYear()}${String(userResult.insertId).padStart(4, '0')}`;

        await db.execute(
            'INSERT INTO students (user_id, filiere_id, student_number, enrollment_date) VALUES (?, ?, ?, CURDATE())',
            [userResult.insertId, filiereId, studentNumber]
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
        let query = `
            SELECT g.*, s.id as student_id, u.name as student_name, m.name as module_name, m.code as module_code
            FROM grades g
            JOIN students s ON g.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN modules m ON g.module_id = m.id
        `;
        
        // Filter by student if user is a student
        if (req.user.role === 'student') {
            query += ' WHERE u.id = ?';
            const [rows] = await db.execute(query, [req.user.id]);
            res.json(rows);
        } else {
            const [rows] = await db.execute(query);
            res.json(rows);
        }
    } catch (error) {
        console.error('Get grades error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/grades', authenticateToken, requireRole(['administrator', 'director', 'teacher']), async (req, res) => {
    try {
        const { studentId, moduleId, grade } = req.body;
        const status = grade >= 10 ? 'admis' : grade === 0 ? 'en-attente' : 'non-admis';

        await db.execute(`
            INSERT INTO grades (student_id, module_id, grade, status, exam_date) 
            VALUES (?, ?, ?, ?, CURDATE())
            ON DUPLICATE KEY UPDATE grade = ?, status = ?, exam_date = CURDATE()
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
            SELECT e.*, m.name as module_name, m.code as module_code, f.name as filiere_name
            FROM exams e
            JOIN modules m ON e.module_id = m.id
            JOIN filieres f ON m.filiere_id = f.id
            ORDER BY e.exam_date, e.exam_time
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/exams', authenticateToken, requireRole(['administrator', 'director']), async (req, res) => {
    try {
        const { moduleId, examDate, examTime, room, durationMinutes } = req.body;

        const [result] = await db.execute(
            'INSERT INTO exams (module_id, exam_date, exam_time, room, duration_minutes) VALUES (?, ?, ?, ?, ?)',
            [moduleId, examDate, examTime, room, durationMinutes || 120]
        );

        res.json({ message: 'Exam scheduled successfully', id: result.insertId });
    } catch (error) {
        console.error('Create exam error:', error);
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
            ORDER BY f.name, m.name
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get modules error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/modules', authenticateToken, requireRole(['administrator', 'director']), async (req, res) => {
    try {
        const { name, code, filiereId, teacherId, coefficient, semester } = req.body;

        const [result] = await db.execute(
            'INSERT INTO modules (name, code, filiere_id, teacher_id, coefficient, semester) VALUES (?, ?, ?, ?, ?, ?)',
            [name, code, filiereId, teacherId || null, coefficient || 1.0, semester || 1]
        );

        res.json({ message: 'Module created successfully', id: result.insertId });
    } catch (error) {
        console.error('Create module error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Filieres Routes
app.get('/api/filieres', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM filieres ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error('Get filieres error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/filieres', authenticateToken, requireRole(['administrator', 'director']), async (req, res) => {
    try {
        const { name, code, duration } = req.body;

        const [result] = await db.execute(
            'INSERT INTO filieres (name, code, duration) VALUES (?, ?, ?)',
            [name, code, duration]
        );

        res.json({ message: 'Filiere created successfully', id: result.insertId });
    } catch (error) {
        console.error('Create filiere error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Teachers Routes
app.get('/api/teachers', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT t.*, u.name, u.email
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            ORDER BY u.name
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get teachers error:', error);
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

app.put('/api/settings/:key', authenticateToken, requireRole(['administrator']), async (req, res) => {
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
});
