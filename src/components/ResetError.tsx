import { useMemo } from 'react';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Mail from 'lucide-react/dist/esm/icons/mail';
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw';
import { Button } from './ui/button';

interface ResetErrorProps {
  onOpenLogin?: () => void;
}

function parseHashParams(hash: string): Record<string, string> {
  const h = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(h);
  const out: Record<string, string> = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export function ResetError({ onOpenLogin }: ResetErrorProps) {
  const { error, error_code, error_description } = useMemo(() => {
    return parseHashParams(typeof window !== 'undefined' ? window.location.hash : '');
  }, []);

  const headline = (() => {
    if (error_code === 'otp_expired') return 'Reset link expired or already used';
    if (error_code === 'otp_disabled') return 'Reset link disabled';
    if (error_code === 'verification_failed') return 'Verification failed';
    return 'We couldn’t complete your request';
  })();

  const desc = error_description
    ? decodeURIComponent(error_description)
    : 'The link may be invalid, expired, or has already been used.';

  const isLocal = typeof window !== 'undefined' && window.location.origin.includes('localhost');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-semibold">{headline}</h1>
        <p className="text-sm text-muted-foreground">{desc}</p>

        <div className="rounded-lg border p-4 text-left space-y-2 bg-card">
          <p className="text-sm">
            This usually happens when:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>You opened an older email after requesting a newer reset link</li>
            <li>The link was used already (reset links are one-time use)</li>
            <li>The link expired (typically valid for a limited time)</li>
            {isLocal && (
              <li>You clicked the link on a different device than the one running localhost:3000</li>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => {
              if (onOpenLogin) onOpenLogin();
              // Keep the user on the app and let them resend from Forgot password
              // Optionally, clear the hash to avoid re-triggering this page
              if (typeof window !== 'undefined') {
                window.location.hash = '';
              }
            }}
          >
            <Mail className="mr-2 h-4 w-4" /> Resend reset link
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Back to home
          </Button>
        </div>

        {isLocal && (
          <div className="text-xs text-muted-foreground">
            Tip: For localhost testing, request a new link and click it on the same computer running the dev server.
          </div>
        )}
      </div>
    </div>
  );
}
