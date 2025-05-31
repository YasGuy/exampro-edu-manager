
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Grade {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  grade: number;
  status: 'admis' | 'non-admis' | 'en-attente';
}

interface Exam {
  id: string;
  moduleName: string;
  moduleCode: string;
  date: string;
  time: string;
  room: string;
  status: 'a-venir' | 'termine';
}

const StudentDashboard = () => {
  const [grades] = useState<Grade[]>([
    { moduleId: '1', moduleName: 'Structures de Données', moduleCode: 'INFO101', grade: 17, status: 'admis' },
    { moduleId: '2', moduleName: 'Systèmes de Base de Données', moduleCode: 'INFO201', grade: 15.5, status: 'admis' },
    { moduleId: '3', moduleName: 'Développement Web', moduleCode: 'INFO301', grade: 18.5, status: 'admis' },
    { moduleId: '4', moduleName: 'Génie Logiciel', moduleCode: 'INFO401', grade: 0, status: 'en-attente' }
  ]);

  const [exams] = useState<Exam[]>([
    { 
      id: '1', 
      moduleName: 'Génie Logiciel', 
      moduleCode: 'INFO401', 
      date: '2024-06-15', 
      time: '09:00', 
      room: 'Salle A101',
      status: 'a-venir'
    },
    { 
      id: '2', 
      moduleName: 'Intelligence Artificielle', 
      moduleCode: 'INFO501', 
      date: '2024-06-18', 
      time: '14:00', 
      room: 'Salle B202',
      status: 'a-venir'
    },
    { 
      id: '3', 
      moduleName: 'Structures de Données', 
      moduleCode: 'INFO101', 
      date: '2024-05-20', 
      time: '10:00', 
      room: 'Salle C301',
      status: 'termine'
    }
  ]);

  const { toast } = useToast();

  const downloadTranscript = () => {
    toast({
      title: "Téléchargement Commencé",
      description: "Votre relevé de notes est en cours de génération et sera téléchargé sous peu."
    });
  };

  const downloadCertificate = () => {
    toast({
      title: "Téléchargement Commencé", 
      description: "Votre attestation est en cours de génération et sera téléchargée sous peu."
    });
  };

  const getGradeColor = (grade: number, status: string) => {
    if (status === 'en-attente') return 'text-[#6B7280]';
    if (grade >= 16) return 'text-[#22C55E]';
    if (grade >= 12) return 'text-[#FACC15]';
    if (grade >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium font-inter";
    switch (status) {
      case 'admis':
        return `${baseClasses} bg-[#22C55E]/10 text-[#22C55E]`;
      case 'non-admis':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'en-attente':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  const upcomingExams = exams.filter(e => e.status === 'a-venir');
  const completedExams = exams.filter(e => e.status === 'termine');
  const validGrades = grades.filter(g => g.status !== 'en-attente');
  const moyenne = validGrades.length > 0 ? validGrades.reduce((sum, g) => sum + g.grade, 0) / validGrades.length : 0;

  return (
    <div className="space-y-6 bg-[#F9FAFB] min-h-screen p-6 font-inter">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] font-inter uppercase">Tableau de Bord Étudiant</h1>
        <p className="text-[#6B7280] font-inter">Consultez vos planning d'examens, résultats et progrès académique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Aperçu Académique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#22C55E] font-inter">{moyenne.toFixed(1)}/20</p>
                <p className="text-sm text-[#6B7280] font-inter">Moyenne Actuelle</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-semibold text-[#111827] font-inter">{grades.filter(g => g.status === 'admis').length}</p>
                  <p className="text-xs text-[#6B7280] font-inter">Admis</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-[#111827] font-inter">{grades.filter(g => g.status === 'en-attente').length}</p>
                  <p className="text-xs text-[#6B7280] font-inter">En Attente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={downloadTranscript} className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
              Télécharger Relevé de Notes
            </Button>
            <Button onClick={downloadCertificate} variant="outline" className="w-full font-inter border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10">
              Télécharger Attestation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Prochain Examen</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-[#111827] font-inter">{upcomingExams[0].moduleName}</h4>
                <p className="text-sm text-[#6B7280] font-inter">{upcomingExams[0].moduleCode}</p>
                <p className="text-sm text-[#111827] font-inter">{upcomingExams[0].date} à {upcomingExams[0].time}</p>
                <p className="text-sm text-[#6B7280] font-inter">{upcomingExams[0].room}</p>
              </div>
            ) : (
              <p className="text-[#6B7280] font-inter">Aucun examen à venir</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Mes Notes</CardTitle>
            <CardDescription className="text-[#6B7280] font-inter">Résultats académiques actuels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {grades.map(grade => (
                <div key={grade.moduleId} className="flex items-center justify-between p-3 border rounded-lg bg-[#F9FAFB]">
                  <div>
                    <h4 className="font-medium text-[#111827] font-inter">{grade.moduleName}</h4>
                    <p className="text-sm text-[#6B7280] font-inter">{grade.moduleCode}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold font-inter ${getGradeColor(grade.grade, grade.status)}`}>
                      {grade.status === 'en-attente' ? 'En Attente' : `${grade.grade}/20`}
                    </p>
                    <span className={getStatusBadge(grade.status)}>
                      {grade.status === 'admis' ? 'ADMIS' : grade.status === 'non-admis' ? 'NON ADMIS' : 'EN ATTENTE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Planning des Examens</CardTitle>
            <CardDescription className="text-[#6B7280] font-inter">Examens à venir et terminés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#22C55E] mb-2 font-inter">Examens à Venir</h4>
                {upcomingExams.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingExams.map(exam => (
                      <div key={exam.id} className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
                        <h5 className="font-medium text-[#111827] font-inter">{exam.moduleName} ({exam.moduleCode})</h5>
                        <p className="text-sm text-[#6B7280] font-inter">{exam.date} à {exam.time}</p>
                        <p className="text-sm text-[#6B7280] font-inter">{exam.room}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6B7280] text-sm font-inter">Aucun examen à venir</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-[#6B7280] mb-2 font-inter">Examens Terminés</h4>
                {completedExams.length > 0 ? (
                  <div className="space-y-2">
                    {completedExams.map(exam => (
                      <div key={exam.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-[#111827] font-inter">{exam.moduleName} ({exam.moduleCode})</h5>
                        <p className="text-sm text-[#6B7280] font-inter">{exam.date} à {exam.time}</p>
                        <p className="text-sm text-[#6B7280] font-inter">{exam.room}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6B7280] text-sm font-inter">Aucun examen terminé</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-[#1E293B] font-inter font-semibold">Progrès Académique</CardTitle>
          <CardDescription className="text-[#6B7280] font-inter">Aperçu de vos performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#22C55E]/10 rounded-lg">
              <p className="text-2xl font-bold text-[#22C55E] font-inter">{grades.length}</p>
              <p className="text-sm text-[#6B7280] font-inter">Total Modules</p>
            </div>
            <div className="text-center p-4 bg-[#22C55E]/10 rounded-lg">
              <p className="text-2xl font-bold text-[#22C55E] font-inter">{grades.filter(g => g.status === 'admis').length}</p>
              <p className="text-sm text-[#6B7280] font-inter">Modules Réussis</p>
            </div>
            <div className="text-center p-4 bg-[#FACC15]/10 rounded-lg">
              <p className="text-2xl font-bold text-[#FACC15] font-inter">{upcomingExams.length}</p>
              <p className="text-sm text-[#6B7280] font-inter">Examens à Venir</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B]/10 rounded-lg">
              <p className="text-2xl font-bold text-[#1E293B] font-inter">{moyenne.toFixed(1)}/20</p>
              <p className="text-sm text-[#6B7280] font-inter">Moyenne Actuelle</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
