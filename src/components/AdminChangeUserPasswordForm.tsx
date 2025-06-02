
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminChangeUserPasswordForm = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const users = [
    { id: '1', name: 'System Administrator', email: 'admin@exampro.com' },
    { id: '2', name: 'Academic Director', email: 'director@exampro.com' },
    { id: '3', name: 'John Teacher', email: 'teacher@exampro.com' },
    { id: '4', name: 'Marie Dubois', email: 'marie@etudiant.com' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un utilisateur",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // This would normally call your backend API
      // const response = await fetch('/api/admin/change-user-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: selectedUser,
      //     newPassword: newPassword
      //   })
      // });

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = users.find(u => u.id === selectedUser);
      toast({
        title: "Succès",
        description: `Mot de passe modifié pour ${user?.name}`
      });

      setSelectedUser('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du mot de passe",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-[#1E293B] font-inter font-semibold">Changer le Mot de Passe d'un Utilisateur</CardTitle>
        <CardDescription className="text-[#6B7280] font-inter">Modifier le mot de passe de n'importe quel utilisateur</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="user" className="text-[#111827] font-inter">Sélectionner l'utilisateur</Label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md font-inter text-[#111827]"
              required
            >
              <option value="">Choisir un utilisateur...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-[#111827] font-inter">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="font-inter"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-[#111827] font-inter">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="font-inter"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter"
            disabled={isLoading}
          >
            {isLoading ? 'Modification...' : 'Changer le Mot de Passe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminChangeUserPasswordForm;
