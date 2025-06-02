
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ChangePasswordForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (passwords.newPassword.length < 8) {
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
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwords.currentPassword,
      //     newPassword: passwords.newPassword
      //   })
      // });

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Succès",
        description: "Mot de passe modifié avec succès"
      });

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
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
        <CardTitle className="text-[#1E293B] font-inter font-semibold">Changer le Mot de Passe</CardTitle>
        <CardDescription className="text-[#6B7280] font-inter">Modifier votre mot de passe de connexion</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-[#111827] font-inter">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              required
              className="font-inter"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-[#111827] font-inter">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
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
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
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

export default ChangePasswordForm;
