
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast({
          title: "Connexion Échouée",
          description: "Email ou mot de passe invalide",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-inter">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1E293B] font-inter uppercase">ExamPro</h1>
          <p className="mt-2 text-sm text-[#6B7280] font-inter">Système de Gestion Éducative</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#111827] font-inter">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrez votre email"
                className="font-inter"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#111827] font-inter">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Entrez votre mot de passe"
                className="font-inter"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 font-inter"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 text-xs text-[#6B7280] space-y-1 font-inter">
          <p><strong>Comptes de Démonstration :</strong></p>
          <p>Admin : admin@exampro.com / AdminSecure2024!</p>
          <p>Directeur : director@exampro.com / DirectorPass2024!</p>
          <p>Enseignant : teacher@exampro.com / TeacherKey2024!</p>
          <p>Étudiant : marie@etudiant.com / StudentAccess2024!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
