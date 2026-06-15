import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ShieldCheck, AlertTriangle, Timer } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'mourya_admin_attempts';

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
}

function getAttemptRecord(): AttemptRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttemptRecord(record: AttemptRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function clearAttemptRecord() {
  localStorage.removeItem(STORAGE_KEY);
}

function formatTimeLeft(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`;
}

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdmin();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockedFor, setLockedFor] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Admin Login — Mourya Green World';
    if (isAuthenticated) setLocation('/admin');

    // Check for existing lockout on mount
    const record = getAttemptRecord();
    if (record.lockedUntil) {
      const remaining = record.lockedUntil - Date.now();
      if (remaining > 0) {
        setLockedFor(remaining);
      } else {
        // Lockout expired — clear
        clearAttemptRecord();
      }
    } else if (record.count > 0) {
      setAttemptsLeft(MAX_ATTEMPTS - record.count);
    }
  }, [isAuthenticated]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockedFor === null) return;
    const interval = setInterval(() => {
      setLockedFor(prev => {
        if (prev === null || prev <= 1000) {
          clearAttemptRecord();
          setAttemptsLeft(null);
          clearInterval(interval);
          return null;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedFor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check lockout
    const record = getAttemptRecord();
    if (record.lockedUntil) {
      const remaining = record.lockedUntil - Date.now();
      if (remaining > 0) {
        setLockedFor(remaining);
        return;
      } else {
        clearAttemptRecord();
      }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // deliberate delay to slow brute force
    const ok = login(username.trim(), password);
    setLoading(false);

    if (ok) {
      clearAttemptRecord();
      setLocation('/admin');
    } else {
      const current = getAttemptRecord();
      const newCount = current.count + 1;

      if (newCount >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_MS;
        saveAttemptRecord({ count: newCount, lockedUntil });
        setLockedFor(LOCKOUT_MS);
        setAttemptsLeft(0);
        setError('');
      } else {
        saveAttemptRecord({ count: newCount, lockedUntil: null });
        const left = MAX_ATTEMPTS - newCount;
        setAttemptsLeft(left);
        setError(`Incorrect username or password. ${left} attempt${left !== 1 ? 's' : ''} remaining.`);
      }
      setPassword('');
    }
  };

  const isLocked = lockedFor !== null && lockedFor > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`px-8 py-8 text-center transition-colors ${isLocked ? 'bg-red-500' : 'bg-primary'}`}>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              {isLocked
                ? <AlertTriangle className="h-8 w-8 text-white" />
                : <ShieldCheck className="h-8 w-8 text-white" />
              }
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">
              {isLocked ? 'Access Locked' : 'Admin Login'}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {isLocked ? 'Too many failed attempts' : 'Mourya Green World Dashboard'}
            </p>
          </div>

          {/* Lockout screen */}
          {isLocked ? (
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <Timer className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Login is temporarily disabled</p>
                <p className="text-sm text-gray-500">
                  After {MAX_ATTEMPTS} incorrect attempts, access has been locked for 15 minutes to protect your admin panel.
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl py-4 px-6">
                <p className="text-xs text-red-400 font-medium uppercase tracking-wide mb-1">Try again in</p>
                <p className="text-3xl font-bold text-red-500 font-mono">
                  {formatTimeLeft(lockedFor!)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                If this was you, please wait. If not, your panel is protected.
              </p>
            </div>
          ) : (
            /* Login form */
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    data-testid="input-admin-username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    data-testid="input-admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}

              {attemptsLeft !== null && attemptsLeft <= 2 && !error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3">
                  ⚠️ {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout.
                </div>
              )}

              <Button
                data-testid="button-admin-login"
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : 'Login to Dashboard'}
              </Button>
            </form>
          )}

          <div className="px-8 pb-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Lock className="h-3 w-3" />
              This panel is for authorised admin use only
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🌿 Mourya Green World — Secure Admin Portal
        </p>
      </motion.div>
    </div>
  );
}
