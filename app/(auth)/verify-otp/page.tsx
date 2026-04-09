'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

function VerifyOtpContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const lastFilledIndex = Math.min(index + digits.length, 5);
      focusInput(lastFilledIndex);
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Entrez le code à 6 chiffres');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: code }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.needsOnboarding) {
          router.push(`/register?vendorId=${data.vendor.id}`);
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Code invalide');
        setOtp(['', '', '', '', '', '']);
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-warm-lg">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold text-text-1 mb-2">
          Vérification
        </h1>
        <p className="text-text-2">
          Entrez le code envoyé au<br />
          <span className="font-semibold text-primary">{phone}</span>
        </p>
      </motion.div>

      <Card className="w-full" padding="lg">
        <div className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={(e) => e.preventDefault()}>
            {otp.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                name={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-12 text-center text-xl font-outfit font-bold"
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-danger">{error}</p>}

          <Button
            onClick={handleVerify}
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Vérifier
          </Button>

          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-sm text-text-3">
                Renvoyer dans {resendCooldown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-primary font-medium hover:underline"
              >
                Renvoyer le code
              </button>
            )}
          </div>
        </div>
      </Card>

      <Button
        variant="ghost"
        className="mt-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Modifier le numéro
      </Button>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center"><div className="animate-pulse">Chargement...</div></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
