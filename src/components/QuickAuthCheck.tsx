import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Check {
  name: string;
  status: 'pass' | 'fail' | 'checking';
  message: string;
}

export function QuickAuthCheck() {
  const [checks, setChecks] = useState<Check[]>([
    { name: 'Supabase Config', status: 'checking', message: 'Checking...' },
    { name: 'Server Connection', status: 'checking', message: 'Checking...' },
  ]);

  useEffect(() => {
    runChecks();
  }, []);

  const runChecks = async () => {
    const newChecks: Check[] = [];

    // Check 1: Supabase config
    if (projectId && publicAnonKey) {
      newChecks.push({
        name: 'Supabase Config',
        status: 'pass',
        message: '✓ Project ID and Anon Key present'
      });
    } else {
      newChecks.push({
        name: 'Supabase Config',
        status: 'fail',
        message: '✗ Missing Supabase credentials'
      });
    }

    // Check 2: Server connection
    try {
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
      });

      if (response.ok) {
        newChecks.push({
          name: 'Server Connection',
          status: 'pass',
          message: '✓ Backend server is responding'
        });
      } else {
        newChecks.push({
          name: 'Server Connection',
          status: 'fail',
          message: `✗ Server returned ${response.status}`
        });
      }
    } catch (error) {
      newChecks.push({
        name: 'Server Connection',
        status: 'fail',
        message: '✗ Cannot connect to backend server'
      });
    }

    setChecks(newChecks);
  };

  const allPassed = checks.every(c => c.status === 'pass');
  const anyFailed = checks.some(c => c.status === 'fail');

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm border-2 border-gray-200 z-50">
      <div className="flex items-center gap-2 mb-3">
        {allPassed && <CheckCircle className="w-5 h-5 text-green-600" />}
        {anyFailed && <XCircle className="w-5 h-5 text-red-600" />}
        {!allPassed && !anyFailed && <AlertCircle className="w-5 h-5 text-yellow-600 animate-pulse" />}
        <h3 className="font-semibold">System Status</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start gap-2">
            {check.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
            {check.status === 'fail' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
            {check.status === 'checking' && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">{check.name}</div>
              <div className="text-gray-600 text-xs">{check.message}</div>
            </div>
          </div>
        ))}
      </div>

      {allPassed && (
        <div className="mt-3 pt-3 border-t text-xs text-green-700 bg-green-50 p-2 rounded">
          ✅ Authentication is ready to use!
        </div>
      )}

      {anyFailed && (
        <div className="mt-3 pt-3 border-t text-xs text-red-700 bg-red-50 p-2 rounded">
          ⚠️ Please check configuration
        </div>
      )}
    </div>
  );
}
