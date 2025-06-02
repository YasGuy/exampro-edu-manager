
# ExamPro Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Installation Steps

1. **Clone or copy the backend files**
   ```bash
   mkdir exampro-backend
   cd exampro-backend
   # Copy all files from backend-reference folder here
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   - Create a new MySQL database
   - Run the SQL script from `database-schema.sql`
   ```bash
   mysql -u root -p < database-schema.sql
   ```

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/change-password` - Change user password

### Students
- GET `/api/students` - Get all students
- POST `/api/students` - Create new student

### Grades
- GET `/api/grades` - Get all grades
- POST `/api/grades` - Create/update grade

### Exams
- GET `/api/exams` - Get all exams

### Modules
- GET `/api/modules` - Get all modules

### Filieres
- GET `/api/filieres` - Get all study programs

### System Settings
- GET `/api/settings` - Get system settings
- PUT `/api/settings/:key` - Update setting

## Frontend Integration

To connect your React frontend to this backend, update the API calls in your React components to point to:
`http://localhost:3001/api/...`

Example:
```javascript
// In your React components
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});
```

## Security Notes

1. Change the JWT_SECRET in production
2. Use environment variables for sensitive data
3. Implement rate limiting for production
4. Add input validation and sanitization
5. Use HTTPS in production
6. Implement proper error handling and logging

## Database Schema

The system includes the following main tables:
- `users` - Base user authentication
- `students` - Student-specific data
- `teachers` - Teacher-specific data
- `filieres` - Study programs
- `modules` - Course modules
- `grades` - Student grades
- `exams` - Exam schedules
- `system_settings` - System configuration
