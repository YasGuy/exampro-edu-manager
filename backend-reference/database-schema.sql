
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

-- Insert sample data
INSERT INTO users (email, password_hash, role, name) VALUES
('admin@exampro.com', '$2b$10$example_hash_admin', 'administrator', 'System Administrator'),
('director@exampro.com', '$2b$10$example_hash_director', 'director', 'Academic Director'),
('teacher@exampro.com', '$2b$10$example_hash_teacher', 'teacher', 'John Teacher'),
('marie@etudiant.com', '$2b$10$example_hash_student', 'student', 'Marie Dubois');

INSERT INTO filieres (name, code, duration) VALUES
('Informatique', 'INFO', 3),
('Mathématiques', 'MATH', 3),
('Physique', 'PHYS', 3);

-- Note: You'll need to insert the corresponding records in students, teachers, modules, etc.
-- based on the user IDs generated above
