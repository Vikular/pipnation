import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export function SystemHealthCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState({
    serverReachable: null as boolean | null,
    serverResponse: null as string | null,
    authAvailable: null as boolean | null,
    hasLocalSession: false,
    error: null as string | null
  });
  const [copied, setCopied] = useState(false);

  const projectUrl = 'https://mkblwhxlrdcoflliwnyr.supabase.co';
  const serverUrl = `${projectUrl}/functions/v1/api-server`;

  useEffect(() => {
    checkHealth();
    checkLocalSession();
  }, []);

  const checkLocalSession = () => {
    const hasToken = !!localStorage.getItem('accessToken');
    const hasUserId = !!localStorage.getItem('userId');
    setHealthStatus(prev => ({
      ...prev,
      hasLocalSession: hasToken && hasUserId
    }));
  };

  const checkHealth = async () => {
    setIsChecking(true);
    setHealthStatus({
      serverReachable: null,
      serverResponse: null,
      authAvailable: null,
      hasLocalSession: healthStatus.hasLocalSession,
      error: null
    });

    try {
      // Check server health
      const healthResponse = await fetch(`${serverUrl}/health`);
      const healthData = await healthResponse.json();
      
      setHealthStatus(prev => ({
        ...prev,
        serverReachable: healthResponse.ok,
        serverResponse: JSON.stringify(healthData),
        authAvailable: healthData.status === 'ok'
      }));
    } catch (error: any) {
      setHealthStatus(prev => ({
        ...prev,
        serverReachable: false,
        authAvailable: false,
        error: error.message
      }));
    } finally {
      setIsChecking(false);
    }
  };

  const testSignup = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';

    try {
      const response = await fetch(`${serverUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          firstName: 'Test User',
          country: 'US'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ SUCCESS! Signup works!\n\nUser created: ${data.userId}\nEmail: ${testEmail}\nPassword: ${testPassword}\n\nYou can now login with these credentials.`);
      } else {
        alert(`❌ Signup Failed\n\nError: ${data.error}\n\nCheck console for details.`);
        console.error('Signup error:', data);
      }
    } catch (error: any) {
      alert(`❌ Network Error\n\n${error.message}\n\nServer might not be deployed.`);
      console.error('Signup network error:', error);
    }
  };

  const copyDeployCommand = () => {
    const command = 'supabase functions deploy api-server --project-ref mkblwhxlrdcoflliwnyr';
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    if (status) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="outline">Checking...</Badge>;
    if (status) return <Badge className="bg-green-500 text-white border-0">Working ✓</Badge>;
    return <Badge className="bg-red-500 text-white border-0">Failed ✗</Badge>;
  };

  const allGood = healthStatus.serverReachable && healthStatus.authAvailable;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2">
      <CardHeader className={`${
        allGood 
          ? 'bg-gradient-to-r from-green-50 to-blue-50' 
          : 'bg-gradient-to-r from-red-50 to-orange-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {allGood ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  System Healthy
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  System Check
                </>
              )}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {allGood 
                ? 'All systems operational - you can signup and login!' 
                : 'Checking authentication system status...'}
            </CardDescription>
          </div>
          <Button 
            onClick={checkHealth} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Recheck
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Status Checks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-white">
            <div className="flex items-center gap-3">
              {getStatusIcon(healthStatus.serverReachable)}
              <div>
                <div className="text-sm">Server Reachable</div>
                <div className="text-xs text-gray-600">Edge function deployed</div>
              </div>
            </div>
            {getStatusBadge(healthStatus.serverReachable)}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-white">
            <div className="flex items-center gap-3">
              {getStatusIcon(healthStatus.authAvailable)}
              <div>
                <div className="text-sm">Authentication Ready</div>
                <div className="text-xs text-gray-600">Can signup and login</div>
              </div>
            </div>
            {getStatusBadge(healthStatus.authAvailable)}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-white">
            <div className="flex items-center gap-3">
              {getStatusIcon(healthStatus.hasLocalSession)}
              <div>
                <div className="text-sm">User Session</div>
                <div className="text-xs text-gray-600">Currently logged in</div>
              </div>
            </div>
            {getStatusBadge(healthStatus.hasLocalSession)}
          </div>
        </div>

        {/* Error Message */}
        {healthStatus.error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-red-900 mb-1">Error Details:</div>
                <div className="text-xs text-red-800 font-mono bg-red-100 p-2 rounded">
                  {healthStatus.error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Server Response */}
        {healthStatus.serverResponse && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="text-sm text-blue-900 mb-2">Server Response:</div>
            <div className="text-xs text-blue-800 font-mono bg-blue-100 p-2 rounded overflow-auto">
              {healthStatus.serverResponse}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {allGood ? (
            <>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-green-900 mb-1">✅ Everything is Working!</div>
                    <div className="text-xs text-green-800">
                      Your authentication system is fully operational. You can:
                    </div>
                  </div>
                </div>
                <ul className="text-xs text-green-800 space-y-1 ml-7">
                  <li>• Create new accounts</li>
                  <li>• Login with existing credentials</li>
                  <li>• Access the full platform</li>
                </ul>
              </div>

              <Button 
                onClick={testSignup} 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                🧪 Test Signup (Create Test Account)
              </Button>
            </>
          ) : (
            <>
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-orange-900 mb-1">⚠️ Action Required</div>
                    <div className="text-xs text-orange-800">
                      Server is not reachable. You need to deploy the Edge Function:
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-orange-900">1. Open your terminal</div>
                  <div className="text-xs text-orange-900">2. Run this command:</div>
                  <div className="relative">
                    <div className="text-xs font-mono bg-orange-100 p-3 rounded pr-12 overflow-auto text-orange-900">
                      supabase functions deploy api-server --project-ref mkblwhxlrdcoflliwnyr
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyDeployCommand}
                      className="absolute top-2 right-2 h-7"
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-orange-900 mt-2">3. Set environment variables in Supabase Dashboard</div>
                  <div className="text-xs text-orange-900">4. Click "Recheck" above</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="text-xs text-blue-900">
                  📚 <strong>Need help?</strong> Check <code className="bg-blue-100 px-1 rounded">QUICK_FIX_GUIDE.md</code> for detailed instructions
                </div>
              </div>
            </>
          )}
        </div>

        {/* Server URLs */}
        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
          <div className="text-sm text-gray-900 mb-2">Server URLs:</div>
          <div className="space-y-2">
            <div className="text-xs">
              <span className="text-gray-600">Health Check: </span>
              <a 
                href={`${serverUrl}/health`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {serverUrl}/health
              </a>
            </div>
            <div className="text-xs">
              <span className="text-gray-600">Project: </span>
              <a 
                href={`https://supabase.com/dashboard/project/mkblwhxlrdcoflliwnyr`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Supabase Dashboard →
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
