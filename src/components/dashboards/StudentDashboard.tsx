
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Grade {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  grade: number;
  status: 'passed' | 'failed' | 'pending';
}

interface Exam {
  id: string;
  moduleName: string;
  moduleCode: string;
  date: string;
  time: string;
  room: string;
  status: 'upcoming' | 'completed';
}

const StudentDashboard = () => {
  const [grades] = useState<Grade[]>([
    { moduleId: '1', moduleName: 'Data Structures', moduleCode: 'CS101', grade: 85, status: 'passed' },
    { moduleId: '2', moduleName: 'Database Systems', moduleCode: 'CS201', grade: 78, status: 'passed' },
    { moduleId: '3', moduleName: 'Web Development', moduleCode: 'CS301', grade: 92, status: 'passed' },
    { moduleId: '4', moduleName: 'Software Engineering', moduleCode: 'CS401', grade: 0, status: 'pending' }
  ]);

  const [exams] = useState<Exam[]>([
    { 
      id: '1', 
      moduleName: 'Software Engineering', 
      moduleCode: 'CS401', 
      date: '2024-06-15', 
      time: '09:00', 
      room: 'Room A101',
      status: 'upcoming'
    },
    { 
      id: '2', 
      moduleName: 'Machine Learning', 
      moduleCode: 'CS501', 
      date: '2024-06-18', 
      time: '14:00', 
      room: 'Room B202',
      status: 'upcoming'
    },
    { 
      id: '3', 
      moduleName: 'Data Structures', 
      moduleCode: 'CS101', 
      date: '2024-05-20', 
      time: '10:00', 
      room: 'Room C301',
      status: 'completed'
    }
  ]);

  const { toast } = useToast();

  const downloadTranscript = () => {
    toast({
      title: "Download Started",
      description: "Your transcript is being generated and will download shortly."
    });
  };

  const downloadCertificate = () => {
    toast({
      title: "Download Started", 
      description: "Your certificate is being generated and will download shortly."
    });
  };

  const getGradeColor = (grade: number, status: string) => {
    if (status === 'pending') return 'text-gray-500';
    if (grade >= 70) return 'text-green-600';
    if (grade >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'passed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  const upcomingExams = exams.filter(e => e.status === 'upcoming');
  const completedExams = exams.filter(e => e.status === 'completed');
  const gpa = grades.filter(g => g.status !== 'pending').reduce((sum, g) => sum + g.grade, 0) / grades.filter(g => g.status !== 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="text-gray-600">View your exam schedules, results, and academic progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Academic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{gpa.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Current GPA</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-semibold">{grades.filter(g => g.status === 'passed').length}</p>
                  <p className="text-xs text-gray-600">Passed</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{grades.filter(g => g.status === 'pending').length}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={downloadTranscript} className="w-full">
              Download Transcript
            </Button>
            <Button onClick={downloadCertificate} variant="outline" className="w-full">
              Download Certificate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Exam</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-semibold">{upcomingExams[0].moduleName}</h4>
                <p className="text-sm text-gray-600">{upcomingExams[0].moduleCode}</p>
                <p className="text-sm">{upcomingExams[0].date} at {upcomingExams[0].time}</p>
                <p className="text-sm text-gray-600">{upcomingExams[0].room}</p>
              </div>
            ) : (
              <p className="text-gray-500">No upcoming exams</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Grades</CardTitle>
            <CardDescription>Current academic results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {grades.map(grade => (
                <div key={grade.moduleId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{grade.moduleName}</h4>
                    <p className="text-sm text-gray-600">{grade.moduleCode}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getGradeColor(grade.grade, grade.status)}`}>
                      {grade.status === 'pending' ? 'Pending' : grade.grade}
                    </p>
                    <span className={getStatusBadge(grade.status)}>
                      {grade.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exam Schedule</CardTitle>
            <CardDescription>Upcoming and completed exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Upcoming Exams</h4>
                {upcomingExams.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingExams.map(exam => (
                      <div key={exam.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium">{exam.moduleName} ({exam.moduleCode})</h5>
                        <p className="text-sm text-gray-600">{exam.date} at {exam.time}</p>
                        <p className="text-sm text-gray-600">{exam.room}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming exams</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-600 mb-2">Completed Exams</h4>
                {completedExams.length > 0 ? (
                  <div className="space-y-2">
                    {completedExams.map(exam => (
                      <div key={exam.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <h5 className="font-medium">{exam.moduleName} ({exam.moduleCode})</h5>
                        <p className="text-sm text-gray-600">{exam.date} at {exam.time}</p>
                        <p className="text-sm text-gray-600">{exam.room}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No completed exams</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription>Your performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{grades.length}</p>
              <p className="text-sm text-gray-600">Total Modules</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{grades.filter(g => g.status === 'passed').length}</p>
              <p className="text-sm text-gray-600">Modules Passed</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{upcomingExams.length}</p>
              <p className="text-sm text-gray-600">Upcoming Exams</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{gpa.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Current GPA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
