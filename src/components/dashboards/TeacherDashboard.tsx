
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Grade {
  studentId: string;
  moduleId: string;
  grade: number;
}

interface Module {
  id: string;
  name: string;
  code: string;
}

interface Exam {
  id: string;
  moduleName: string;
  date: string;
  time: string;
  room: string;
}

const TeacherDashboard = () => {
  const [modules] = useState<Module[]>([
    { id: '1', name: 'Data Structures', code: 'CS101' },
    { id: '2', name: 'Database Systems', code: 'CS201' }
  ]);

  const [students] = useState<Student[]>([
    { id: '1', name: 'Jane Student', email: 'jane@student.com' },
    { id: '2', name: 'John Doe', email: 'john@student.com' },
    { id: '3', name: 'Alice Smith', email: 'alice@student.com' }
  ]);

  const [grades, setGrades] = useState<Grade[]>([
    { studentId: '1', moduleId: '1', grade: 85 },
    { studentId: '2', moduleId: '1', grade: 78 },
    { studentId: '1', moduleId: '2', grade: 92 }
  ]);

  const [exams] = useState<Exam[]>([
    { id: '1', moduleName: 'Data Structures', date: '2024-06-15', time: '09:00', room: 'Room A101' },
    { id: '2', moduleName: 'Database Systems', date: '2024-06-16', time: '14:00', room: 'Room B202' }
  ]);

  const [selectedModule, setSelectedModule] = useState('1');
  const [newGrades, setNewGrades] = useState<{[key: string]: string}>({});
  
  const { toast } = useToast();

  const handleGradeChange = (studentId: string, grade: string) => {
    setNewGrades({
      ...newGrades,
      [studentId]: grade
    });
  };

  const handleSaveGrades = () => {
    const updatedGrades = [...grades];
    
    Object.entries(newGrades).forEach(([studentId, gradeValue]) => {
      const grade = parseFloat(gradeValue);
      if (!isNaN(grade) && grade >= 0 && grade <= 100) {
        const existingIndex = updatedGrades.findIndex(
          g => g.studentId === studentId && g.moduleId === selectedModule
        );
        
        if (existingIndex >= 0) {
          updatedGrades[existingIndex].grade = grade;
        } else {
          updatedGrades.push({
            studentId,
            moduleId: selectedModule,
            grade
          });
        }
      }
    });
    
    setGrades(updatedGrades);
    setNewGrades({});
    toast({
      title: "Grades Saved",
      description: "Student grades have been updated successfully."
    });
  };

  const getStudentGrade = (studentId: string, moduleId: string) => {
    const grade = grades.find(g => g.studentId === studentId && g.moduleId === moduleId);
    return grade ? grade.grade : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>
        <p className="text-gray-600">Manage student grades and view exam schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Student Grades</CardTitle>
            <CardDescription>Select a module and enter grades for students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="module-select">Select Module</Label>
              <select
                id="module-select"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder={getStudentGrade(student.id, selectedModule).toString() || "Grade"}
                      value={newGrades[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveGrades} className="w-full">
              Save Grades
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Modules</CardTitle>
            <CardDescription>Modules assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map(module => {
                const moduleGrades = grades.filter(g => g.moduleId === module.id);
                const avgGrade = moduleGrades.length > 0 
                  ? moduleGrades.reduce((sum, g) => sum + g.grade, 0) / moduleGrades.length
                  : 0;

                return (
                  <div key={module.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{module.name}</h4>
                    <p className="text-sm text-gray-600">Code: {module.code}</p>
                    <p className="text-sm text-gray-600">
                      Students: {students.length} | Avg Grade: {avgGrade.toFixed(1)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
          <CardDescription>Upcoming exams for your modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Module</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Room</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id}>
                    <td className="border border-gray-300 px-4 py-2">{exam.moduleName}</td>
                    <td className="border border-gray-300 px-4 py-2">{exam.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{exam.time}</td>
                    <td className="border border-gray-300 px-4 py-2">{exam.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Overview</CardTitle>
          <CardDescription>Current grades by module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map(module => (
              <div key={module.id}>
                <h4 className="font-semibold mb-2">{module.name} ({module.code})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {students.map(student => {
                    const grade = getStudentGrade(student.id, module.id);
                    return (
                      <div key={student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{student.name}</span>
                        <span className={`text-sm font-medium ${
                          grade >= 70 ? 'text-green-600' : grade >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {grade || 'N/A'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
