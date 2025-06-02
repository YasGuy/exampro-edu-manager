
# ExamPro Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Quick Setup

1. **Install MySQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   
   # macOS with Homebrew
   brew install mysql
   
   # Windows: Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Setup the project**
   ```bash
   mkdir exampro-backend
   cd exampro-backend
   # Copy all files from backend-reference folder here
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup MySQL Database**
   ```bash
   # Start MySQL service
   sudo systemctl start mysql  # Linux
   brew services start mysql   # macOS
   
   # Login to MySQL as root (no password by default)
   mysql -u root
   
   # Run the database setup
   mysql -u root < database-schema.sql
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Configuration

The `.env` file is already configured with default MySQL root credentials:
- Database Host: localhost
- Database User: root
- Database Password: (empty)
- Database Name: exampro_db

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change current user password

### Admin Only
- `POST /api/admin/change-user-password` - Admin changes any user's password
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `DELETE /api/admin/users/:id` - Delete user

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student (Admin/Director only)

### Grades
- `GET /api/grades` - Get grades (filtered by role)
- `POST /api/grades` - Create/update grade (Teacher/Admin/Director only)

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create new exam (Admin/Director only)

### Modules
- `GET /api/modules` - Get all modules
- `POST /api/modules` - Create new module (Admin/Director only)

### Filieres (Study Programs)
- `GET /api/filieres` - Get all study programs
- `POST /api/filieres` - Create new filiere (Admin/Director only)

### Teachers
- `GET /api/teachers` - Get all teachers

### System Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings/:key` - Update setting (Admin only)

### Health Check
- `GET /api/health` - Server health status

## Frontend Integration

Update your React frontend API calls to:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';

// Example login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});

// Example authenticated request
const response = await fetch(`${API_BASE_URL}/students`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
```

## Demo Accounts

The system comes with pre-configured demo accounts:

- **Admin**: admin@exampro.com / AdminSecure2024!
- **Director**: director@exampro.com / DirectorPass2024!
- **Teacher**: teacher@exampro.com / TeacherKey2024!
- **Student**: marie@etudiant.com / StudentAccess2024!

## Security Features

- JWT token authentication
- Role-based access control
- Password hashing with bcrypt
- SQL injection protection
- CORS configuration

## Database Schema

The system includes:
- `users` - Authentication and user data
- `students` - Student-specific information
- `teachers` - Teacher-specific information
- `filieres` - Study programs
- `modules` - Course modules
- `grades` - Student grades
- `exams` - Exam schedules
- `system_settings` - System configuration

## Production Considerations

1. Change JWT_SECRET to a strong random string
2. Use environment variables for sensitive data
3. Implement rate limiting
4. Add input validation and sanitization
5. Use HTTPS
6. Set up proper logging
7. Configure MySQL with secure settings
8. Regular database backups

## Troubleshooting

**Database Connection Issues:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Reset MySQL root password if needed
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

**Port Already in Use:**
```bash
# Check what's using port 3001
sudo lsof -i :3001

# Kill the process if needed
sudo kill -9 <PID>
```
