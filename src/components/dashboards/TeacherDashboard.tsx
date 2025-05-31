
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
    { id: '1', name: 'Structures de Données', code: 'INFO101' },
    { id: '2', name: 'Systèmes de Base de Données', code: 'INFO201' }
  ]);

  const [students] = useState<Student[]>([
    { id: '1', name: 'Marie Dubois', email: 'marie@etudiant.com' },
    { id: '2', name: 'Pierre Martin', email: 'pierre@etudiant.com' },
    { id: '3', name: 'Sophie Laurent', email: 'sophie@etudiant.com' }
  ]);

  const [grades, setGrades] = useState<Grade[]>([
    { studentId: '1', moduleId: '1', grade: 85 },
    { studentId: '2', moduleId: '1', grade: 78 },
    { studentId: '1', moduleId: '2', grade: 92 }
  ]);

  const [exams] = useState<Exam[]>([
    { id: '1', moduleName: 'Structures de Données', date: '2024-06-15', time: '09:00', room: 'Salle A101' },
    { id: '2', moduleName: 'Systèmes de Base de Données', date: '2024-06-16', time: '14:00', room: 'Salle B202' }
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
      if (!isNaN(grade) && grade >= 0 && grade <= 20) {
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
      title: "Notes sauvegardées",
      description: "Les notes des étudiants ont été mises à jour avec succès."
    });
  };

  const getStudentGrade = (studentId: string, moduleId: string): number => {
    const grade = grades.find(g => g.studentId === studentId && g.moduleId === moduleId);
    return grade ? grade.grade : 0;
  };

  return (
    <div className="space-y-6 bg-[#F9FAFB] min-h-screen p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] font-inter uppercase">Tableau de Bord Enseignant</h1>
        <p className="text-[#6B7280] font-inter">Gérer les notes des étudiants et consulter les plannings d'examens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Saisie des Notes</CardTitle>
            <CardDescription className="text-[#6B7280] font-inter">Sélectionnez un module et saisissez les notes des étudiants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="module-select" className="text-[#111827] font-inter">Sélectionner un Module</Label>
              <select
                id="module-select"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md font-inter text-[#111827]"
              >
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg bg-[#F9FAFB]">
                  <div>
                    <p className="font-medium text-[#111827] font-inter">{student.name}</p>
                    <p className="text-sm text-[#6B7280] font-inter">{student.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      placeholder={getStudentGrade(student.id, selectedModule).toString() || "Note"}
                      value={newGrades[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      className="w-20 font-inter"
                    />
                    <span className="text-sm text-[#6B7280] font-inter">/20</span>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveGrades} className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
              Sauvegarder les Notes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Mes Modules</CardTitle>
            <CardDescription className="text-[#6B7280] font-inter">Modules qui vous sont assignés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map(module => {
                const moduleGrades = grades.filter(g => g.moduleId === module.id);
                const avgGrade = moduleGrades.length > 0 
                  ? moduleGrades.reduce((sum, g) => sum + g.grade, 0) / moduleGrades.length
                  : 0;

                return (
                  <div key={module.id} className="p-4 border rounded-lg bg-[#F9FAFB]">
                    <h4 className="font-semibold text-[#111827] font-inter">{module.name}</h4>
                    <p className="text-sm text-[#6B7280] font-inter">Code: {module.code}</p>
                    <p className="text-sm text-[#6B7280] font-inter">
                      Étudiants: {students.length} | Note Moyenne: {avgGrade.toFixed(1)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-[#1E293B] font-inter font-semibold">Planning des Examens</CardTitle>
          <CardDescription className="text-[#6B7280] font-inter">Examens à venir pour vos modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#1E293B]">
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Module</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Heure</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Salle</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id}>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">{exam.moduleName}</td>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">{exam.date}</td>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">{exam.time}</td>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">{exam.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-[#1E293B] font-inter font-semibold">Aperçu des Notes</CardTitle>
          <CardDescription className="text-[#6B7280] font-inter">Notes actuelles par module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map(module => (
              <div key={module.id}>
                <h4 className="font-semibold mb-2 text-[#111827] font-inter">{module.name} ({module.code})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {students.map(student => {
                    const grade = getStudentGrade(student.id, module.id);
                    return (
                      <div key={student.id} className="flex justify-between items-center p-2 bg-[#F9FAFB] rounded">
                        <span className="text-sm font-inter text-[#111827]">{student.name}</span>
                        <span className={`text-sm font-medium font-inter ${
                          grade >= 14 ? 'text-[#22C55E]' : grade >= 10 ? 'text-[#FACC15]' : 'text-red-600'
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
