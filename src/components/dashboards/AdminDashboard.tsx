
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import AdminChangeUserPasswordForm from '../AdminChangeUserPasswordForm';
import ExamCalendar from '../ExamCalendar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { refreshData } = useData();
  
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Directeur Académique', email: 'director@exampro.com', role: 'director' },
    { id: '2', name: 'Jean Enseignant', email: 'teacher@exampro.com', role: 'teacher' },
    { id: '3', name: 'Marie Étudiante', email: 'student@exampro.com', role: 'student' },
  ]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student'
  });
  
  const { toast } = useToast();

  const getAuthToken = (): string | null => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        console.log('Retrieved auth token:', parsed.token ? 'Found' : 'Not found');
        return parsed.token;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    return null;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting to add user:', newUser);
    
    const token = getAuthToken();
    
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Making API request to add user...');
      const response = await fetch('http://localhost:3001/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        })
      });

      console.log('Add user response status:', response.status);
      
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, trying demo mode...');
        // Handle demo mode - add user locally
        const user: User = {
          id: Date.now().toString(),
          ...newUser
        };
        setUsers([...users, user]);
        setNewUser({ name: '', email: '', role: 'student' });
        
        toast({
          title: "Utilisateur Ajouté (Mode Démo)",
          description: `${user.name} a été ajouté localement. Mot de passe par défaut: temp123456`
        });
        return;
      }

      const data = await response.json();
      console.log('Add user response data:', data);

      if (response.ok) {
        // Add to local state for immediate UI update
        const user: User = {
          id: data.id?.toString() || Date.now().toString(),
          ...newUser
        };
        setUsers([...users, user]);
        setNewUser({ name: '', email: '', role: 'student' });
        
        // If it's a student, also refresh the data context to get updated students
        if (newUser.role === 'student') {
          await refreshData();
        }
        
        toast({
          title: "Utilisateur Ajouté",
          description: `${user.name} a été ajouté avec succès. Mot de passe par défaut: ${data.defaultPassword || 'temp123456'}`
        });
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de l'ajout de l'utilisateur",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      
      // Fallback to demo mode on network error
      console.log('Network error, adding user in demo mode...');
      const user: User = {
        id: Date.now().toString(),
        ...newUser
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'student' });
      
      toast({
        title: "Utilisateur Ajouté (Mode Démo)",
        description: `${user.name} a été ajouté localement en raison d'une erreur de connexion.`
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    console.log('Attempting to delete user:', id);
    
    const token = getAuthToken();
    
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);

      if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, trying demo mode...');
        // Handle demo mode - delete user locally
        setUsers(users.filter(u => u.id !== id));
        toast({
          title: "Utilisateur Supprimé (Mode Démo)",
          description: "L'utilisateur a été retiré localement."
        });
        return;
      }

      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        // Refresh data context to get updated students
        await refreshData();
        toast({
          title: "Utilisateur Supprimé",
          description: "L'utilisateur a été retiré du système."
        });
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la suppression",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Fallback to demo mode on network error
      console.log('Network error, deleting user in demo mode...');
      setUsers(users.filter(u => u.id !== id));
      toast({
        title: "Utilisateur Supprimé (Mode Démo)",
        description: "L'utilisateur a été retiré localement en raison d'une erreur de connexion."
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrator': return 'Administrateur';
      case 'director': return 'Directeur';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Étudiant';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 bg-[#F9FAFB] min-h-screen p-6 font-inter">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] font-inter uppercase">Tableau de Bord Administrateur</h1>
        <p className="text-[#6B7280] font-inter">Gérer tous les comptes utilisateur et les paramètres système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Ajouter un Nouvel Utilisateur</CardTitle>
            <CardDescription className="text-[#6B7280] font-inter">Créer un nouveau compte utilisateur</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#111827] font-inter">Nom</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-[#111827] font-inter">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-[#111827] font-inter">Rôle</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md font-inter text-[#111827]"
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Enseignant</option>
                  <option value="director">Directeur</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
                Ajouter l'Utilisateur
              </Button>
            </form>
          </CardContent>
        </Card>

        <AdminChangeUserPasswordForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-[#1E293B] font-inter font-semibold">Paramètres Système</CardTitle>
            <CardDescription className="text-[#6B7280] font-inter">Configurer les paramètres du système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="institution" className="text-[#111827] font-inter">Nom de l'Institution</Label>
              <Input id="institution" defaultValue="Université ExamPro" className="font-inter" />
            </div>
            <div>
              <Label htmlFor="academic-year" className="text-[#111827] font-inter">Année Académique</Label>
              <Input id="academic-year" defaultValue="2023-2024" className="font-inter" />
            </div>
            <div>
              <Label htmlFor="announcement" className="text-[#111827] font-inter">Annonce Système</Label>
              <Textarea 
                id="announcement" 
                placeholder="Entrez une annonce système..."
                rows={3}
                className="font-inter"
              />
            </div>
            <Button className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter">
              Mettre à Jour les Paramètres
            </Button>
          </CardContent>
        </Card>

        <ExamCalendar />
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-[#1E293B] font-inter font-semibold">Gestion des Utilisateurs</CardTitle>
          <CardDescription className="text-[#6B7280] font-inter">Voir et gérer tous les utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#1E293B]">
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Nom</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Rôle</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-white font-inter">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2 font-inter text-[#111827]">
                      <span className="capitalize">{getRoleLabel(user.role)}</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="font-inter"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
