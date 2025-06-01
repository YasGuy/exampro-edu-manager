
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  filiereId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  moduleIds: string[];
}

export interface Module {
  id: string;
  name: string;
  code: string;
  filiereId: string;
  teacherId: string;
  coefficient: number;
}

export interface Filiere {
  id: string;
  name: string;
  code: string;
  duration: number;
}

export interface Grade {
  id: string;
  studentId: string;
  moduleId: string;
  grade: number;
  status: 'admis' | 'non-admis' | 'en-attente';
}

export interface Exam {
  id: string;
  moduleId: string;
  date: string;
  time: string;
  room: string;
  status: 'a-venir' | 'termine';
}

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  modules: Module[];
  filieres: Filiere[];
  grades: Grade[];
  exams: Exam[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addModule: (module: Omit<Module, 'id'>) => void;
  updateModule: (id: string, module: Partial<Module>) => void;
  deleteModule: (id: string) => void;
  addFiliere: (filiere: Omit<Filiere, 'id'>) => void;
  updateFiliere: (id: string, filiere: Partial<Filiere>) => void;
  deleteFiliere: (id: string) => void;
  updateGrade: (studentId: string, moduleId: string, grade: number) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getStudentsByFiliere: (filiereId: string) => Student[];
  getModulesByFiliere: (filiereId: string) => Module[];
  getModulesByTeacher: (teacherId: string) => Module[];
  getGradesByStudent: (studentId: string) => Grade[];
  getGradesByModule: (moduleId: string) => Grade[];
  getExamsByModule: (moduleId: string) => Exam[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filieres, setFilieres] = useState<Filiere[]>([
    { id: '1', name: 'Informatique', code: 'INFO', duration: 3 },
    { id: '2', name: 'Mathématiques', code: 'MATH', duration: 3 },
    { id: '3', name: 'Physique', code: 'PHYS', duration: 3 }
  ]);

  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Marie Dubois', email: 'marie@etudiant.com', filiereId: '1' },
    { id: '2', name: 'Pierre Martin', email: 'pierre@etudiant.com', filiereId: '1' },
    { id: '3', name: 'Sophie Laurent', email: 'sophie@etudiant.com', filiereId: '2' },
    { id: '4', name: 'Ahmed Benali', email: 'ahmed@etudiant.com', filiereId: '1' }
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Hassan Alami', email: 'hassan@prof.com', moduleIds: ['1', '2'] },
    { id: '2', name: 'Prof. Fatima Zahra', email: 'fatima@prof.com', moduleIds: ['3', '4'] },
    { id: '3', name: 'Dr. Mohamed Tazi', email: 'mohamed@prof.com', moduleIds: ['5'] }
  ]);

  const [modules, setModules] = useState<Module[]>([
    { id: '1', name: 'Structures de Données', code: 'INFO101', filiereId: '1', teacherId: '1', coefficient: 3 },
    { id: '2', name: 'Systèmes de Base de Données', code: 'INFO201', filiereId: '1', teacherId: '1', coefficient: 4 },
    { id: '3', name: 'Développement Web', code: 'INFO301', filiereId: '1', teacherId: '2', coefficient: 3 },
    { id: '4', name: 'Génie Logiciel', code: 'INFO401', filiereId: '1', teacherId: '2', coefficient: 4 },
    { id: '5', name: 'Algèbre Linéaire', code: 'MATH101', filiereId: '2', teacherId: '3', coefficient: 4 }
  ]);

  const [grades, setGrades] = useState<Grade[]>([
    { id: '1', studentId: '1', moduleId: '1', grade: 17, status: 'admis' },
    { id: '2', studentId: '1', moduleId: '2', grade: 15.5, status: 'admis' },
    { id: '3', studentId: '1', moduleId: '3', grade: 18.5, status: 'admis' },
    { id: '4', studentId: '1', moduleId: '4', grade: 0, status: 'en-attente' },
    { id: '5', studentId: '2', moduleId: '1', grade: 14, status: 'admis' },
    { id: '6', studentId: '2', moduleId: '2', grade: 12.5, status: 'admis' },
    { id: '7', studentId: '4', moduleId: '1', grade: 16, status: 'admis' }
  ]);

  const [exams, setExams] = useState<Exam[]>([
    { id: '1', moduleId: '4', date: '2024-06-15', time: '09:00', room: 'Salle A101', status: 'a-venir' },
    { id: '2', moduleId: '5', date: '2024-06-18', time: '14:00', room: 'Salle B202', status: 'a-venir' },
    { id: '3', moduleId: '1', date: '2024-05-20', time: '10:00', room: 'Salle C301', status: 'termine' }
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addStudent = (student: Omit<Student, 'id'>) => {
    setStudents(prev => [...prev, { ...student, id: generateId() }]);
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...student } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setGrades(prev => prev.filter(g => g.studentId !== id));
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    setTeachers(prev => [...prev, { ...teacher, id: generateId() }]);
  };

  const updateTeacher = (id: string, teacher: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...teacher } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    setModules(prev => prev.map(m => m.teacherId === id ? { ...m, teacherId: '' } : m));
  };

  const addModule = (module: Omit<Module, 'id'>) => {
    setModules(prev => [...prev, { ...module, id: generateId() }]);
  };

  const updateModule = (id: string, module: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...module } : m));
  };

  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
    setGrades(prev => prev.filter(g => g.moduleId !== id));
    setExams(prev => prev.filter(e => e.moduleId !== id));
  };

  const addFiliere = (filiere: Omit<Filiere, 'id'>) => {
    setFilieres(prev => [...prev, { ...filiere, id: generateId() }]);
  };

  const updateFiliere = (id: string, filiere: Partial<Filiere>) => {
    setFilieres(prev => prev.map(f => f.id === id ? { ...f, ...filiere } : f));
  };

  const deleteFiliere = (id: string) => {
    setFilieres(prev => prev.filter(f => f.id !== id));
    setStudents(prev => prev.filter(s => s.filiereId !== id));
    setModules(prev => prev.filter(m => m.filiereId !== id));
  };

  const updateGrade = (studentId: string, moduleId: string, grade: number) => {
    const status = grade >= 10 ? 'admis' : grade === 0 ? 'en-attente' : 'non-admis';
    
    setGrades(prev => {
      const existingIndex = prev.findIndex(g => g.studentId === studentId && g.moduleId === moduleId);
      if (existingIndex >= 0) {
        return prev.map((g, index) => 
          index === existingIndex ? { ...g, grade, status } : g
        );
      } else {
        return [...prev, {
          id: generateId(),
          studentId,
          moduleId,
          grade,
          status
        }];
      }
    });
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams(prev => [...prev, { ...exam, id: generateId() }]);
  };

  const updateExam = (id: string, exam: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...exam } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const getStudentsByFiliere = (filiereId: string) => {
    return students.filter(s => s.filiereId === filiereId);
  };

  const getModulesByFiliere = (filiereId: string) => {
    return modules.filter(m => m.filiereId === filiereId);
  };

  const getModulesByTeacher = (teacherId: string) => {
    return modules.filter(m => m.teacherId === teacherId);
  };

  const getGradesByStudent = (studentId: string) => {
    return grades.filter(g => g.studentId === studentId);
  };

  const getGradesByModule = (moduleId: string) => {
    return grades.filter(g => g.moduleId === moduleId);
  };

  const getExamsByModule = (moduleId: string) => {
    return exams.filter(e => e.moduleId === moduleId);
  };

  return (
    <DataContext.Provider value={{
      students,
      teachers,
      modules,
      filieres,
      grades,
      exams,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addModule,
      updateModule,
      deleteModule,
      addFiliere,
      updateFiliere,
      deleteFiliere,
      updateGrade,
      addExam,
      updateExam,
      deleteExam,
      getStudentsByFiliere,
      getModulesByFiliere,
      getModulesByTeacher,
      getGradesByStudent,
      getGradesByModule,
      getExamsByModule
    }}>
      {children}
    </DataContext.Provider>
  );
};
