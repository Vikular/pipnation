import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle, XCircle, Loader2, User, LogIn, UserPlus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function AuthTester() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test1234');
  const [fullName, setFullName] = useState('Test User');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testSignup = async () => {
    clearResults();
    setIsLoading(true);

    try {
      // Step 1: Create user via backend (with auto-confirmed email)
      addResult({ step: 'Creating user...', status: 'pending', message: 'Calling backend signup endpoint' });
      
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;
      const signupResponse = await fetch(`${apiUrl}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Required by Supabase Edge Functions
        },
        body: JSON.stringify({
          email,
          password,
          firstName: fullName,
          country: 'US',
          signupData: {},
        }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        addResult({ 
          step: 'Backend Signup', 
          status: 'error', 
          message: `HTTP ${signupResponse.status}: ${errorData.error || 'Unknown error'}`,
          details: errorData 
        });
        setIsLoading(false);
        return;
      }

      const signupData = await signupResponse.json();
      addResult({ 
        step: 'Backend Signup', 
        status: 'success', 
        message: `User created with ID: ${signupData.userId}`,
        details: signupData
      });

      // Step 2: Sign in to get session
      addResult({ step: 'Getting session...', status: 'pending', message: 'Signing in to get access token' });

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        addResult({ 
          step: 'Session Creation', 
          status: 'error', 
          message: authError.message,
          details: authError 
        });
        setIsLoading(false);
        return;
      }

      if (!authData.session?.access_token) {
        addResult({ 
          step: 'Session Creation', 
          status: 'error', 
          message: 'No session created',
          details: authData 
        });
        setIsLoading(false);
        return;
      }

      addResult({ 
        step: 'Session Creation', 
        status: 'success', 
        message: 'Session created successfully',
        details: { hasToken: true, userId: authData.user.id }
      });

      // Step 3: Fetch profile
      addResult({ step: 'Fetching profile...', status: 'pending', message: 'Getting user profile from backend' });

      const profileResponse = await fetch(`${apiUrl}/user/${signupData.userId}`, {
        headers: {
          Authorization: `Bearer ${authData.session.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        addResult({ 
          step: 'Profile Fetch', 
          status: 'error', 
          message: `HTTP ${profileResponse.status}: ${errorText}`,
          details: { status: profileResponse.status, error: errorText }
        });
      } else {
        const profileData = await profileResponse.json();
        addResult({ 
          step: 'Profile Fetch', 
          status: 'success', 
          message: 'Profile fetched successfully',
          details: profileData
        });
      }

    } catch (error) {
      addResult({ 
        step: 'Signup Process', 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }

    setIsLoading(false);
  };

  const testLogin = async () => {
    clearResults();
    setIsLoading(true);

    try {
      // Step 1: Sign in with Supabase Auth
      addResult({ step: 'Signing in...', status: 'pending', message: 'Calling Supabase Auth signIn' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addResult({ 
          step: 'Supabase Auth Login', 
          status: 'error', 
          message: error.message,
          details: error 
        });
        setIsLoading(false);
        return;
      }

      if (!data.session?.access_token || !data.user?.id) {
        addResult({ 
          step: 'Supabase Auth Login', 
          status: 'error', 
          message: 'No session created',
          details: data 
        });
        setIsLoading(false);
        return;
      }

      addResult({ 
        step: 'Supabase Auth Login', 
        status: 'success', 
        message: `Logged in as: ${data.user.email}`,
        details: { userId: data.user.id, email: data.user.email }
      });

      // Step 2: Fetch user profile from backend
      addResult({ step: 'Fetching profile...', status: 'pending', message: 'Calling backend API' });

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;
      const profileResponse = await fetch(`${apiUrl}/user/${data.user.id}`, {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        addResult({ 
          step: 'Backend Profile Fetch', 
          status: 'error', 
          message: `HTTP ${profileResponse.status}: ${errorText}`,
          details: { status: profileResponse.status, error: errorText }
        });
      } else {
        const profileData = await profileResponse.json();
        addResult({ 
          step: 'Backend Profile Fetch', 
          status: 'success', 
          message: 'Profile fetched successfully',
          details: profileData
        });
      }

    } catch (error) {
      addResult({ 
        step: 'Login Process', 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }

    setIsLoading(false);
  };

  const testCurrentSession = async () => {
    clearResults();
    setIsLoading(true);

    try {
      addResult({ step: 'Checking session...', status: 'pending', message: 'Getting current session' });
      
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        addResult({ 
          step: 'Session Check', 
          status: 'error', 
          message: error.message,
          details: error 
        });
        setIsLoading(false);
        return;
      }

      if (!session) {
        addResult({ 
          step: 'Session Check', 
          status: 'error', 
          message: 'No active session found',
          details: null
        });
        setIsLoading(false);
        return;
      }

      addResult({ 
        step: 'Session Check', 
        status: 'success', 
        message: `Active session found for: ${session.user.email}`,
        details: { 
          userId: session.user.id, 
          email: session.user.email,
          expiresAt: new Date(session.expires_at! * 1000).toLocaleString()
        }
      });

    } catch (error) {
      addResult({ 
        step: 'Session Check', 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Authentication Testing Tool
            </CardTitle>
            <CardDescription>
              Test signup, login, and session management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Test User"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="test1234"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={testSignup} 
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Test Signup
              </Button>
              <Button 
                onClick={testLogin} 
                disabled={isLoading}
                variant="secondary"
                className="gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Test Login
              </Button>
              <Button 
                onClick={testCurrentSession} 
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                Check Session
              </Button>
              <Button 
                onClick={clearResults} 
                disabled={isLoading}
                variant="ghost"
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.status === 'success' 
                        ? 'bg-green-50 border-green-200' 
                        : result.status === 'error'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {result.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {result.status === 'error' && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        {result.status === 'pending' && (
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{result.step}</div>
                        <div className="text-sm mt-1">{result.message}</div>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  );
}
