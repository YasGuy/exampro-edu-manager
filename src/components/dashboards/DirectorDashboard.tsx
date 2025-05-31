
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
    { id: '1', name: 'Informatique', description: 'Génie Logiciel et Programmation' },
    { id: '2', name: 'Administration des Affaires', description: 'Gestion et Finance' }
  ]);
  
  const [modules, setModules] = useState<Module[]>([
    { id: '1', name: 'Structures de Données', code: 'INFO101', filiereId: '1' },
    { id: '2', name: 'Systèmes de Base de Données', code: 'INFO201', filiereId: '1' },
    { id: '3', name: 'Gestion Financière', code: 'GA101', filiereId: '2' }
  ]);

  const [exams, setExams] = useState<Exam[]>([
    { id: '1', moduleId: '1', room: 'Salle A101', date: '2024-06-15', time: '09:00' },
    { id: '2', moduleId: '2', room: 'Salle B202', date: '2024-06-16', time: '14:00' }
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
    toast({ 
      title: "Succès", 
      description: "Filière ajoutée avec succès!" 
    });
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    const module: Module = {
      id: Date.now().toString(),
      ...newModule
    };
    setModules([...modules, module]);
    setNewModule({ name: '', code: '', filiereId: '' });
    toast({ 
      title: "Succès", 
      description: "Module ajouté avec succès!" 
    });
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const exam: Exam = {
      id: Date.now().toString(),
      ...newExam
    };
    setExams([...exams, exam]);
    setNewExam({ moduleId: '', room: '', date: '', time: '' });
    toast({ 
      title: "Succès", 
      description: "Examen programmé avec succès!" 
    });
  };

  const generatePDF = (type: string) => {
    toast({
      title: "PDF Généré",
      description: `${type} a été généré et est prêt pour téléchargement.`
    });
  };

  return (
    <div className="space-y-6 bg-[#F9FAFB] min-h-screen p-6 font-inter">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] font-inter uppercase">Tableau de Bord Directeur</h1>
        <p className="text-[#6B7280] font-inter">Gérer les programmes académiques, modules et examens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Ajouter une Filière</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFiliere} className="space-y-4">
              <div>
                <Label htmlFor="filiere-name" className="text-[#111827] font-inter">Nom</Label>
                <Input
                  id="filiere-name"
                  value={newFiliere.name}
                  onChange={(e) => setNewFiliere({...newFiliere, name: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="filiere-desc" className="text-[#111827] font-inter">Description</Label>
                <Input
                  id="filiere-desc"
                  value={newFiliere.description}
                  onChange={(e) => setNewFiliere({...newFiliere, description: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <Button type="submit" className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
                Ajouter la Filière
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Ajouter un Module</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <Label htmlFor="module-name" className="text-[#111827] font-inter">Nom du Module</Label>
                <Input
                  id="module-name"
                  value={newModule.name}
                  onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="module-code" className="text-[#111827] font-inter">Code</Label>
                <Input
                  id="module-code"
                  value={newModule.code}
                  onChange={(e) => setNewModule({...newModule, code: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="filiere-select" className="text-[#111827] font-inter">Filière</Label>
                <select
                  id="filiere-select"
                  value={newModule.filiereId}
                  onChange={(e) => setNewModule({...newModule, filiereId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md font-inter text-[#111827]"
                  required
                >
                  <option value="">Sélectionner une Filière</option>
                  {filieres.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
                Ajouter le Module
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Programmer un Examen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExam} className="space-y-4">
              <div>
                <Label htmlFor="exam-module" className="text-[#111827] font-inter">Module</Label>
                <select
                  id="exam-module"
                  value={newExam.moduleId}
                  onChange={(e) => setNewExam({...newExam, moduleId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md font-inter text-[#111827]"
                  required
                >
                  <option value="">Sélectionner un Module</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="exam-room" className="text-[#111827] font-inter">Salle</Label>
                <Input
                  id="exam-room"
                  value={newExam.room}
                  onChange={(e) => setNewExam({...newExam, room: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="exam-date" className="text-[#111827] font-inter">Date</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="exam-time" className="text-[#111827] font-inter">Heure</Label>
                <Input
                  id="exam-time"
                  type="time"
                  value={newExam.time}
                  onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <Button type="submit" className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
                Programmer l'Examen
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-[#1E293B] font-inter font-semibold">Génération de PDF</CardTitle>
          <CardDescription className="text-[#6B7280] font-inter">Générer des rapports et documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => generatePDF('Rapport de Notes')} className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
              Générer Rapport de Notes
            </Button>
            <Button onClick={() => generatePDF('Relevé de Notes')} className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
              Générer Relevés de Notes
            </Button>
            <Button onClick={() => generatePDF('Attestation')} className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
              Générer Attestations
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Filières</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filieres.map(f => (
                <div key={f.id} className="p-3 border rounded-lg bg-[#F9FAFB]">
                  <h4 className="font-semibold text-[#111827] font-inter">{f.name}</h4>
                  <p className="text-sm text-[#6B7280] font-inter">{f.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Examens à Venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exams.map(e => {
                const module = modules.find(m => m.id === e.moduleId);
                return (
                  <div key={e.id} className="p-3 border rounded-lg bg-[#F9FAFB]">
                    <h4 className="font-semibold text-[#111827] font-inter">{module?.name} ({module?.code})</h4>
                    <p className="text-sm text-[#6B7280] font-inter">{e.room} - {e.date} à {e.time}</p>
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
