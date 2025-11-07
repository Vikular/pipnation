import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function BackendTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        data: data,
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
        <CardDescription>
          Test the connection to the Supabase backend and verify configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTest} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Run Backend Test'
          )}
        </Button>

        {testResult && (
          <div className="mt-4 p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">
                {testResult.success ? 'Connection Successful' : 'Connection Failed'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <strong>Status Code:</strong> {testResult.status || 'N/A'}
              </div>
              
              {testResult.data && (
                <>
                  <div>
                    <strong>Server Status:</strong> {testResult.data.status}
                  </div>
                  
                  {testResult.data.config && (
                    <div className="mt-3 p-3 bg-background rounded border">
                      <div className="font-medium mb-2">Configuration Check:</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          {testResult.data.config.hasUrl ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <span>SUPABASE_URL: {testResult.data.config.hasUrl ? 'Set' : 'Missing'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResult.data.config.hasAnonKey ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <span>SUPABASE_ANON_KEY: {testResult.data.config.hasAnonKey ? 'Set' : 'Missing'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResult.data.config.hasServiceKey ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <span>SUPABASE_SERVICE_ROLE_KEY: {testResult.data.config.hasServiceKey ? 'Set' : 'Missing'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                          {testResult.data.config.allConfigured ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <span className="font-medium">
                            All Configuration: {testResult.data.config.allConfigured ? 'Ready' : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {testResult.error && (
                <div className="mt-3 p-3 bg-destructive/10 text-destructive rounded border border-destructive">
                  <strong>Error:</strong> {testResult.error}
                </div>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer font-medium">View Raw Response</summary>
                <pre className="mt-2 p-2 bg-background rounded border text-xs overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> If any environment variables are missing, the signup will fail with a 
            "Missing authorization header" error. All three variables (URL, ANON_KEY, SERVICE_ROLE_KEY) 
            must be properly configured in the Supabase environment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
