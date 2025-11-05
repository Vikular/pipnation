import { ArrowLeft, Home, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import logoImage from 'figma:asset/e2e2f1ae8441670fc3154c69225d8cc55dbcf229.png';

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  onBack?: () => void;
  onHome?: () => void;
  onLogout?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function NavigationHeader({
  title,
  subtitle,
  userName,
  userRole,
  onBack,
  onHome,
  onLogout,
  showBackButton = true,
  showHomeButton = true,
}: NavigationHeaderProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <img 
                  src={logoImage} 
                  alt="Pip Nation Academy Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-base md:text-lg hidden sm:inline">Pip Nation Academy</span>
            </div>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            
            <div className="flex items-center gap-2">
              {showBackButton && onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              
              {showHomeButton && onHome && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onHome}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              )}
              
              <div className="ml-2">
                <h1 className="text-base md:text-lg lg:text-xl truncate max-w-[150px] sm:max-w-none">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-gray-600 hidden sm:block">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-2 md:gap-3">
            {userName && (
              <div className="text-right hidden md:block">
                <div className="text-sm">{userName}</div>
                {userRole && (
                  <Badge variant="secondary" className="text-xs">
                    {userRole === 'lead' && '✨ Free Trial'}
                    {userRole === 'student' && '📚 Student'}
                    {userRole === 'pro-trader' && '🏆 Pro Trader'}
                    {userRole === 'funded-trader' && '💰 Funded'}
                  </Badge>
                )}
              </div>
            )}
            
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
