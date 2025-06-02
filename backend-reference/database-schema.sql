
-- MySQL Database Schema for ExamPro Educational Management System
-- Run this script to create the database and all required tables

CREATE DATABASE IF NOT EXISTS exampro_db;
USE exampro_db;

-- Users table for authentication and basic user info
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('administrator', 'director', 'teacher', 'student') NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Filieres (Study Programs) table
CREATE TABLE filieres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table (extends users for students)
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    filiere_id INT NOT NULL,
    student_number VARCHAR(50) UNIQUE,
    enrollment_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE RESTRICT
);

-- Teachers table (extends users for teachers)
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_number VARCHAR(50) UNIQUE,
    department VARCHAR(255),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Modules table
CREATE TABLE modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    filiere_id INT NOT NULL,
    teacher_id INT,
    coefficient DECIMAL(3,1) NOT NULL DEFAULT 1.0,
    semester INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE RESTRICT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- Grades table
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    module_id INT NOT NULL,
    grade DECIMAL(4,2) NOT NULL,
    status ENUM('admis', 'non-admis', 'en-attente') DEFAULT 'en-attente',
    exam_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_module (student_id, module_id)
);

-- Exams table
CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    room VARCHAR(100) NOT NULL,
    status ENUM('a-venir', 'termine') DEFAULT 'a-venir',
    duration_minutes INT DEFAULT 120,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('institution_name', 'Université ExamPro', 'Name of the educational institution'),
('academic_year', '2023-2024', 'Current academic year'),
('system_announcement', '', 'System-wide announcement message');

-- Insert sample filieres
INSERT INTO filieres (name, code, duration) VALUES
('Informatique', 'INFO', 3),
('Mathématiques', 'MATH', 3),
('Physique', 'PHYS', 3),
('Génie Civil', 'GC', 4),
('Électronique', 'ELEC', 3);

-- Insert demo users with hashed passwords
-- Admin: AdminSecure2024!
INSERT INTO users (email, password_hash, role, name) VALUES
('admin@exampro.com', '$2b$10$vGZhT8YG7tZjCd3.QrU8HOKnlCxYz1FkPjHxhZk7lDyqDvzSGJGP2', 'administrator', 'System Administrator');

-- Director: DirectorPass2024!
INSERT INTO users (email, password_hash, role, name) VALUES
('director@exampro.com', '$2b$10$xMnCvB4uN5tPqWz2sE6rFu8yLgK3jH9mVcX7bN2rDq4sW8vE1yT5p', 'director', 'Academic Director');

-- Teacher: TeacherKey2024!
INSERT INTO users (email, password_hash, role, name) VALUES
('teacher@exampro.com', '$2b$10$zQpLwX3rY6vU9sT8mK4nEo7iJhG2fD5cR9vB6xN8qA3sL7mP4wE1r', 'teacher', 'John Teacher');

-- Student: StudentAccess2024!
INSERT INTO users (email, password_hash, role, name) VALUES
('marie@etudiant.com', '$2b$10$aBcD3fG6hI9jK2lM5nO8pQ7rS4tU1vW9xY2zA5bC8dE7fG0hI3jK6', 'student', 'Marie Dubois');

-- Insert teacher record
INSERT INTO teachers (user_id, employee_number, department, hire_date) VALUES
((SELECT id FROM users WHERE email = 'teacher@exampro.com'), 'EMP001', 'Computer Science', '2023-01-15');

-- Insert student record
INSERT INTO students (user_id, filiere_id, student_number, enrollment_date) VALUES
((SELECT id FROM users WHERE email = 'marie@etudiant.com'), 1, 'STU20240001', '2024-01-15');

-- Insert sample modules
INSERT INTO modules (name, code, filiere_id, teacher_id, coefficient, semester) VALUES
('Programmation Web', 'INFO101', 1, 1, 2.0, 1),
('Base de Données', 'INFO102', 1, 1, 2.5, 1),
('Algorithmes', 'INFO201', 1, 1, 3.0, 2),
('Calcul Différentiel', 'MATH101', 2, NULL, 2.0, 1),
('Algèbre Linéaire', 'MATH102', 2, NULL, 2.5, 1);

-- Insert sample exams
INSERT INTO exams (module_id, exam_date, exam_time, room, duration_minutes, status) VALUES
(1, '2024-06-15', '09:00:00', 'Salle A101', 120, 'a-venir'),
(2, '2024-06-17', '14:00:00', 'Salle B205', 180, 'a-venir'),
(3, '2024-06-20', '10:00:00', 'Salle C301', 150, 'a-venir'),
(1, '2024-05-10', '09:00:00', 'Salle A101', 120, 'termine'),
(2, '2024-05-12', '14:00:00', 'Salle B205', 180, 'termine');

-- Insert sample grades
INSERT INTO grades (student_id, module_id, grade, status, exam_date) VALUES
(1, 1, 15.5, 'admis', '2024-05-10'),
(1, 2, 12.0, 'admis', '2024-05-12');
