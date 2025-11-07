import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { projectId } from '../utils/supabase/info';

export function ServerDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      setDiagnostics({ success: true, data, status: response.status });
    } catch (error) {
      setDiagnostics({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="mb-4">Server Diagnostics</h2>
      
      <Button onClick={runDiagnostics} disabled={loading} className="mb-4">
        {loading ? 'Running Diagnostics...' : 'Run Server Health Check'}
      </Button>

      {diagnostics && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          {diagnostics.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-2xl">✅</span>
                <span>Server is reachable (Status: {diagnostics.status})</span>
              </div>

              {diagnostics.data?.config && (
                <div className="space-y-2">
                  <h3>Environment Variables:</h3>
                  <div className="ml-4 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{diagnostics.data.config.hasUrl ? '✅' : '❌'}</span>
                      <span>SUPABASE_URL: {diagnostics.data.config.hasUrl ? 'Present' : 'Missing'}</span>
                    </div>
                    {diagnostics.data.config.urlValue && (
                      <div className="ml-6 text-xs text-muted-foreground">
                        {diagnostics.data.config.urlValue}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span>{diagnostics.data.config.hasAnonKey ? '✅' : '❌'}</span>
                      <span>SUPABASE_ANON_KEY: {diagnostics.data.config.hasAnonKey ? 'Present' : 'Missing'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>{diagnostics.data.config.hasServiceKey ? '✅' : '❌'}</span>
                      <span>SUPABASE_SERVICE_ROLE_KEY: {diagnostics.data.config.hasServiceKey ? 'Present' : 'Missing'}</span>
                    </div>
                    {diagnostics.data.config.serviceKeyLength !== undefined && (
                      <div className="ml-6 text-xs text-muted-foreground">
                        Length: {diagnostics.data.config.serviceKeyLength} characters
                        <br />
                        Prefix: {diagnostics.data.config.serviceKeyPrefix}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {diagnostics.data?.client && (
                <div className="space-y-2">
                  <h3>Supabase Client Test:</h3>
                  <div className="ml-4 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{diagnostics.data.client.canCreateClient ? '✅' : '❌'}</span>
                      <span>Can create Supabase client: {diagnostics.data.client.canCreateClient ? 'Yes' : 'No'}</span>
                    </div>
                    
                    {diagnostics.data.client.clientError && (
                      <div className="ml-6 text-xs text-red-600">
                        Error: {diagnostics.data.client.clientError}
                      </div>
                    )}

                    {diagnostics.data.client.authTest && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span>{diagnostics.data.client.authTest.success ? '✅' : '❌'}</span>
                          <span>Auth Admin API Test: {diagnostics.data.client.authTest.success ? 'Passed' : 'Failed'}</span>
                        </div>
                        {diagnostics.data.client.authTest.error && (
                          <div className="ml-6 mt-1 text-xs text-red-600 bg-red-50 p-2 rounded">
                            {diagnostics.data.client.authTest.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!diagnostics.data?.config?.allConfigured && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                  <strong>⚠️ Configuration Issue Detected</strong>
                  <p className="text-sm mt-1">
                    One or more required environment variables are missing. Signup will not work until this is resolved.
                  </p>
                </div>
              )}

              {diagnostics.data?.client?.authTest?.success === false && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                  <strong>⚠️ Service Role Key Issue</strong>
                  <p className="text-sm mt-1">
                    The SUPABASE_SERVICE_ROLE_KEY appears to be invalid or doesn't have the correct permissions.
                    This is why signup is failing with "Missing authorization header" error.
                  </p>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm">View Raw Data</summary>
                <pre className="mt-2 p-3 bg-background rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(diagnostics.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="text-red-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">❌</span>
                <span>Server connection failed</span>
              </div>
              <div className="mt-2 text-sm bg-red-50 p-2 rounded">
                {diagnostics.error}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
