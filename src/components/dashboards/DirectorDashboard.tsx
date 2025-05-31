
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Filiere {
  id: string;
  name: string;
  description: string;
}

interface Module {
  id: string;
  name: string;
  code: string;
  filiereId: string;
}

interface Exam {
  id: string;
  moduleId: string;
  room: string;
  date: string;
  time: string;
}

const DirectorDashboard = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([
    { id: '1', name: 'Computer Science', description: 'Software Engineering and Programming' },
    { id: '2', name: 'Business Administration', description: 'Management and Finance' }
  ]);
  
  const [modules, setModules] = useState<Module[]>([
    { id: '1', name: 'Data Structures', code: 'CS101', filiereId: '1' },
    { id: '2', name: 'Database Systems', code: 'CS201', filiereId: '1' },
    { id: '3', name: 'Financial Management', code: 'BA101', filiereId: '2' }
  ]);

  const [exams, setExams] = useState<Exam[]>([
    { id: '1', moduleId: '1', room: 'Room A101', date: '2024-06-15', time: '09:00' },
    { id: '2', moduleId: '2', room: 'Room B202', date: '2024-06-16', time: '14:00' }
  ]);

  const [newFiliere, setNewFiliere] = useState({ name: '', description: '' });
  const [newModule, setNewModule] = useState({ name: '', code: '', filiereId: '' });
  const [newExam, setNewExam] = useState({ moduleId: '', room: '', date: '', time: '' });
  
  const { toast } = useToast();

  const handleAddFiliere = (e: React.FormEvent) => {
    e.preventDefault();
    const filiere: Filiere = {
      id: Date.now().toString(),
      ...newFiliere
    };
    setFilieres([...filieres, filiere]);
    setNewFiliere({ name: '', description: '' });
    toast({ title: "Success", description: "Filière added successfully!" });
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    const module: Module = {
      id: Date.now().toString(),
      ...newModule
    };
    setModules([...modules, module]);
    setNewModule({ name: '', code: '', filiereId: '' });
    toast({ title: "Success", description: "Module added successfully!" });
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const exam: Exam = {
      id: Date.now().toString(),
      ...newExam
    };
    setExams([...exams, exam]);
    setNewExam({ moduleId: '', room: '', date: '', time: '' });
    toast({ title: "Success", description: "Exam scheduled successfully!" });
  };

  const generatePDF = (type: string) => {
    toast({
      title: "PDF Generated",
      description: `${type} has been generated and is ready for download.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Director Dashboard</h2>
        <p className="text-gray-600">Manage academic programs, modules, and examinations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Filière</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFiliere} className="space-y-4">
              <div>
                <Label htmlFor="filiere-name">Name</Label>
                <Input
                  id="filiere-name"
                  value={newFiliere.name}
                  onChange={(e) => setNewFiliere({...newFiliere, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="filiere-desc">Description</Label>
                <Input
                  id="filiere-desc"
                  value={newFiliere.description}
                  onChange={(e) => setNewFiliere({...newFiliere, description: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Filière</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Module</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  value={newModule.name}
                  onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="module-code">Code</Label>
                <Input
                  id="module-code"
                  value={newModule.code}
                  onChange={(e) => setNewModule({...newModule, code: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="filiere-select">Filière</Label>
                <select
                  id="filiere-select"
                  value={newModule.filiereId}
                  onChange={(e) => setNewModule({...newModule, filiereId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Filière</option>
                  {filieres.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">Add Module</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExam} className="space-y-4">
              <div>
                <Label htmlFor="exam-module">Module</Label>
                <select
                  id="exam-module"
                  value={newExam.moduleId}
                  onChange={(e) => setNewExam({...newExam, moduleId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Module</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="exam-room">Room</Label>
                <Input
                  id="exam-room"
                  value={newExam.room}
                  onChange={(e) => setNewExam({...newExam, room: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="exam-date">Date</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="exam-time">Time</Label>
                <Input
                  id="exam-time"
                  type="time"
                  value={newExam.time}
                  onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Schedule Exam</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PDF Generation</CardTitle>
          <CardDescription>Generate reports and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => generatePDF('Grade Report')}>
              Generate Grade Report
            </Button>
            <Button onClick={() => generatePDF('Transcript')}>
              Generate Transcripts
            </Button>
            <Button onClick={() => generatePDF('Certificate')}>
              Generate Certificates
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Filières</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filieres.map(f => (
                <div key={f.id} className="p-3 border rounded-lg">
                  <h4 className="font-semibold">{f.name}</h4>
                  <p className="text-sm text-gray-600">{f.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exams.map(e => {
                const module = modules.find(m => m.id === e.moduleId);
                return (
                  <div key={e.id} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{module?.name} ({module?.code})</h4>
                    <p className="text-sm text-gray-600">{e.room} - {e.date} at {e.time}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectorDashboard;
