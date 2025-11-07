import { useState, useEffect } from 'react';
import { X, CheckCircle, Zap, Users, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function WelcomeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show guide on first visit
    const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide');
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    
    if (!hasSeenGuide && !isDemoMode) {
      // Wait 1 second after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto"
          >
            <Card className="w-full max-w-2xl shadow-2xl border-2 border-blue-500 my-4 max-h-[95vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 relative pb-4 md:pb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="absolute top-3 right-3 md:top-4 md:right-4 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pr-10">
                  🎉 Welcome to Pip Nation Academy!
                </CardTitle>
                <p className="text-gray-600 mt-2 text-sm md:text-base pr-10">
                  Your platform is ready to use with instant demo mode
                </p>
              </CardHeader>

              <CardContent className="pt-4 md:pt-6 space-y-4 md:space-y-6 px-4 md:px-6">
                {/* Quick Start */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg mb-1">✅ Login Works Instantly!</h3>
                      <p className="text-xs md:text-sm text-gray-700">
                        Click <strong>"Get Started"</strong> and use ANY email/password to login.
                        No backend needed!
                      </p>
                      <div className="mt-2 p-2 bg-white rounded text-xs font-mono overflow-x-auto">
                        Email: student@test.com<br/>
                        Password: anything
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg mb-1">🎭 Demo Mode Active</h3>
                      <p className="text-xs md:text-sm text-gray-700 mb-2">
                        All features work perfectly. Your progress is saved in your browser.
                      </p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2 text-xs">
                        <span className="bg-white px-2 py-1 rounded">✅ Complete lessons</span>
                        <span className="bg-white px-2 py-1 rounded">✅ Track progress</span>
                        <span className="bg-white px-2 py-1 rounded">✅ Take quizzes</span>
                        <span className="bg-white px-2 py-1 rounded hidden sm:inline">✅ Access resources</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg mb-1">📚 Try Different Roles</h3>
                      <p className="text-xs md:text-sm text-gray-700 mb-2">
                        Use these emails to test different access levels:
                      </p>
                      <div className="space-y-1 text-xs overflow-x-auto">
                        <div className="whitespace-nowrap"><strong>student@test.com</strong> → Full course access</div>
                        <div className="whitespace-nowrap"><strong>free@test.com</strong> → Free trial (3 lessons)</div>
                        <div className="whitespace-nowrap"><strong>pro@test.com</strong> → Pro trader + Signal Room</div>
                        <div className="whitespace-nowrap"><strong>admin@test.com</strong> → Admin dashboard</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Production Info */}
                <div className="p-3 md:p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                  <h3 className="text-xs md:text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-600 flex-shrink-0" />
                    <strong>For Production Use:</strong>
                  </h3>
                  <p className="text-xs text-gray-700 mb-2">
                    Deploy the backend to enable real authentication:
                  </p>
                  <code className="text-xs bg-white p-2 rounded block overflow-x-auto whitespace-nowrap">
                    supabase functions deploy api-server
                  </code>
                  <p className="text-xs text-gray-600 mt-2">
                    See <strong>DEMO_MODE_ACTIVE.md</strong> for details
                  </p>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base md:text-lg py-5 md:py-6"
                >
                  Got It! Let's Start Learning 🚀
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
