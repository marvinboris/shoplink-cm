'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Mot de passe incorrect');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A2E] mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Admin ShopLink CM</h1>
          <p className="text-gray-500 mt-1">Accès réservé</p>
        </div>

        <Card className="p-6" padding="lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              label="Mot de passe"
              placeholder="Entrez le mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Connexion
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
