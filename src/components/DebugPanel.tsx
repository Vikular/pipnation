import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;

  const testHealth = async () => {
    setTesting(true);
    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      setHealthData({ success: true, status: response.status, data });
    } catch (error) {
      setHealthData({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setTesting(false);
    }
  };

  // Keyboard shortcut to open debug panel (Ctrl+Shift+D)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center justify-center text-xs"
        title="Debug Panel (Ctrl+Shift+D)"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="p-4 shadow-2xl border-2 border-yellow-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Debug Panel</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-xs space-y-1">
            <div><strong>Project ID:</strong> {projectId}</div>
            <div><strong>Has Anon Key:</strong> {publicAnonKey ? '✅ Yes' : '❌ No'}</div>
          </div>

          <Button 
            onClick={testHealth} 
            disabled={testing}
            size="sm"
            className="w-full"
          >
            {testing ? 'Testing...' : 'Test Backend Health'}
          </Button>

          {healthData && (
            <div className="text-xs p-3 bg-muted rounded border max-h-96 overflow-y-auto">
              {healthData.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✅</span>
                    <span>Connection successful (Status: {healthData.status})</span>
                  </div>
                  {healthData.data?.config && (
                    <div className="mt-2 space-y-1">
                      <div className="font-medium">Environment Variables:</div>
                      <div className="ml-2 space-y-0.5">
                        <div>{healthData.data.config.hasUrl ? '✅' : '❌'} SUPABASE_URL</div>
                        <div>{healthData.data.config.hasAnonKey ? '✅' : '❌'} ANON_KEY</div>
                        <div>{healthData.data.config.hasServiceKey ? '✅' : '❌'} SERVICE_KEY</div>
                      </div>
                      {healthData.data.config.urlValue && (
                        <div className="mt-2 text-[10px] bg-gray-100 p-1 rounded">
                          <div><strong>URL:</strong> {healthData.data.config.urlValue}</div>
                          <div><strong>Key Length:</strong> {healthData.data.config.serviceKeyLength}</div>
                          <div><strong>Key Prefix:</strong> {healthData.data.config.serviceKeyPrefix}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {healthData.data?.client && (
                    <div className="mt-2 space-y-1">
                      <div className="font-medium">Supabase Client:</div>
                      <div className="ml-2 space-y-0.5">
                        <div>{healthData.data.client.canCreateClient ? '✅' : '❌'} Can Create Client</div>
                        {healthData.data.client.clientError && (
                          <div className="text-red-600">Error: {healthData.data.client.clientError}</div>
                        )}
                        {healthData.data.client.authTest && (
                          <div>
                            {healthData.data.client.authTest.success ? (
                              <div className="text-green-600">✅ Auth Admin Test: Passed</div>
                            ) : (
                              <div className="text-red-600">
                                ❌ Auth Admin Test: Failed
                                <div className="text-[10px] mt-1 bg-red-50 p-1 rounded">
                                  {healthData.data.client.authTest.error}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {!healthData.data?.config?.allConfigured && (
                    <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                      ⚠️ Missing credentials! Signup will fail.
                    </div>
                  )}
                  {healthData.data?.client?.authTest?.success === false && (
                    <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                      ⚠️ Service role key appears invalid. Signup will fail with "Missing authorization header" error.
                    </div>
                  )}
                  <details className="mt-2">
                    <summary className="cursor-pointer">Raw Data</summary>
                    <pre className="mt-1 p-2 bg-background rounded text-[10px] overflow-auto max-h-40">
                      {JSON.stringify(healthData, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    <span>Connection failed</span>
                  </div>
                  <div className="mt-1 text-red-800">{healthData.error}</div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t">
            Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[10px]">Ctrl+Shift+D</kbd> to toggle
          </div>
        </div>
      </Card>
    </div>
  );
}
