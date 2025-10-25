import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("student");
  const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3001';
  const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '';
  const { setUser } = useAuth(); // only one declaration here

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // signup flow state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhase, setSignupPhase] = useState<'form'|'otp'>('form');
  const [signupOtp, setSignupOtp] = useState('');

  useEffect(() => {
    // inject Google Identity Services script
    if (!GOOGLE_CLIENT_ID) return;
    const existing = document.getElementById('google-identity');
    if (existing) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.id = 'google-identity';
    document.body.appendChild(s);

    s.onload = () => {
      try {
        const g = (window as any).google;
        if (!g) return;
        g.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (resp: any) => {
            const idToken = resp?.credential;
            if (!idToken) return;
            try {
              const r = await fetch(`${API_BASE}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
              });
              const data = await r.json();
              if (!r.ok) throw new Error(data?.error || 'Auth failed');
              setUser(data.user || null, data.token || null);
              toast.success('Signed in');
              navigate('/dashboard');
            } catch (err: any) {
              console.error('Google sign-in failed', err);
              toast.error(err?.message || 'Google sign-in failed');
            }
          }
        });
        const container = document.getElementById('g_id_signin');
        if (container) {
          g.accounts.id.renderButton(container, { theme: 'outline', size: 'large' });
        }
      } catch (e) {
        console.warn('Google identity init error', e);
      }
    };
  }, [GOOGLE_CLIENT_ID]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'Login failed');
      setUser(data.user || null, data.token || null);
      toast.success('Signed in');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error', err);
      toast.error(err?.message || 'Login failed');
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, name: signupName, password: signupPassword })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'Signup failed');
      toast.success('OTP sent to your email');
      setSignupPhase('otp');
    } catch (err: any) {
      console.error('Signup error', err);
      toast.error(err?.message || 'Signup failed');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, otp: signupOtp })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'OTP verification failed');
      setUser(data.user || null, data.token || null);
      toast.success('Signup complete');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Verify OTP error', err);
      toast.error(err?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
      
      <Card className="w-full max-w-md relative z-10 shadow-glow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-hero rounded-full">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome to Smart Campus</CardTitle>
          <CardDescription>Sign in to access your campus ecosystem</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="you@klh.edu" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>

                <Button type="submit" className="w-full bg-gradient-card hover:shadow-glow transition-all">
                  Sign In
                </Button>
              </form>
              <div className="my-4">
                <div id="g_id_signin" />
                <div className="text-sm text-center mt-2">or</div>
                <div className="flex justify-center mt-2">
                  <Button variant="outline" onClick={() => {
                    const g = (window as any).google;
                    if (g && g.accounts && g.accounts.id) g.accounts.id.prompt();
                    else toast.error('Google SDK not loaded');
                  }}>Sign in with Google</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              {signupPhase === 'form' ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" placeholder="John Doe" required value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@klh.edu" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-accent hover:shadow-glow-accent transition-all">
                    Create Account
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <Label>Enter OTP sent to {signupEmail}</Label>
                    <Input value={signupOtp} onChange={(e) => setSignupOtp(e.target.value)} required />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Verify</Button>
                    <Button variant="ghost" onClick={() => setSignupPhase('form')}>Back</Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
