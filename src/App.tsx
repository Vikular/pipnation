import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { LessonViewer } from './components/LessonViewer';
import { FTMOSubmissionModal } from './components/FTMOSubmissionModal';
import { AdminDashboard } from './components/AdminDashboard';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { CourseEnrollment } from './components/CourseEnrollment';
import { BeginnersDashboard } from './components/BeginnersDashboard';
import { StrategyDashboard } from './components/StrategyDashboard';
import { CommunityPage } from './components/CommunityPage';
import { DebugPanel } from './components/DebugPanel';
import { ServerDiagnostics } from './components/ServerDiagnostics';
import { AuthTester } from './components/AuthTester';
import { ResetError } from './components/ResetError';
import { ResetPassword } from './components/ResetPassword';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { supabase } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Button } from './components/ui/button';

type View = 'landing' | 'dashboard' | 'admin' | 'courses' | 'beginners' | 'strategy' | 'community';

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  country: string;
  role: string;
  badge: string;
  progress: {
    foundation: { completed: number; total: number };
    advanced: { completed: number; total: number };
    beginners: { completed: number; total: number };
    strategy: { completed: number; total: number };
  };
  completedLessons: string[];
  quizScores: Record<string, any>;
  advancedUnlocked?: boolean;
  enrolledCourses: string[];
  coursesCompleted: string[];
  paymentHistory: any[];
}

export default function App() {
  console.log('App is rendering...');
  console.log('⚠️ DEMO MODE: Backend API calls will fail (Edge Function not deployed)');
  
  const [currentView, setCurrentView] = useState<View>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'lead'>('lead');
  const [accessToken, setAccessToken] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonViewerOpen, setLessonViewerOpen] = useState(false);
  const [ftmoModalOpen, setFtmoModalOpen] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;

  // Check for existing session on mount
  useEffect(() => {
    let mounted = true;

    // Check for existing Supabase session first
    const restoreSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userId');
          return;
        }
        
        if (session?.access_token && session?.user?.id) {
          console.log('✅ Restored Supabase session for user:', session.user.id);
          setAccessToken(session.access_token);
          localStorage.setItem('accessToken', session.access_token);
          localStorage.setItem('userId', session.user.id);
          await fetchUserProfile(session.user.id, session.access_token, 0, true); // silent = true
        } else {
          console.log('ℹ️ No active session found');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userId');
        }
      } catch (error) {
        console.error('❌ Session restoration error:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
      }
    };

    restoreSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('🔔 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.access_token) {
        setAccessToken(session.access_token);
        localStorage.setItem('accessToken', session.access_token);
        localStorage.setItem('userId', session.user.id);
        await fetchUserProfile(session.user.id, session.access_token, 0, true); // silent during auto-restore
      } else if (event === 'SIGNED_OUT') {
        setAccessToken('');
        setUserProfile(null);
        setCurrentView('landing');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
      } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
        console.log('🔄 Token refreshed');
        setAccessToken(session.access_token);
        localStorage.setItem('accessToken', session.access_token);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async (userId: string, token: string, retryCount = 0, silent = false) => {
    try {
      console.log(`🔄 Fetching user profile for userId: ${userId} (attempt ${retryCount + 1})`);
      const response = await fetch(`${apiUrl}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profile = await response.json();
        console.log(`✅ Profile fetched successfully:`, {
          userId: profile.userId,
          email: profile.email,
          role: profile.role,
          enrolledCourses: profile.enrolledCourses,
        });
        
        console.log('📝 Setting user profile state...');
        setUserProfile(profile);
        console.log('✅ User profile state set');
        
        // Route to appropriate view based on role
        console.log(`🔀 Routing to view based on role: ${profile.role}`);
        if (profile.role === 'admin') {
          console.log('→ Setting view to: admin');
          setCurrentView('admin');
        } else {
          console.log('→ Setting view to: dashboard');
          setCurrentView('dashboard');
        }
        console.log(`✅ View set to: ${profile.role === 'admin' ? 'admin' : 'dashboard'}`);
      } else {
        console.error(`❌ Failed to fetch profile. Status: ${response.status}`);
        const errorText = await response.text();
        console.error(`❌ Error response:`, errorText);
        
        // Handle 404 - profile might not exist yet or need creation
        if (response.status === 404) {
          if (retryCount < 3) {
            console.log(`⏳ Profile not found, retrying in 2 seconds... (attempt ${retryCount + 1}/4)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchUserProfile(userId, token, retryCount + 1, silent);
          } else {
            console.error('❌ Profile not found after multiple retries');
            if (!silent) {
              toast.error('Profile not found. Please contact support or try signing up again.');
            }
            // Clear session if profile doesn't exist
            await supabase.auth.signOut();
            setCurrentView('landing');
          }
        }
        // Handle 401/403 - invalid/expired token
        else if (response.status === 401 || response.status === 403) {
          console.log('🔒 Authentication error - invalid or expired token');
          // Sign out from Supabase which will trigger SIGNED_OUT event
          await supabase.auth.signOut();
          if (!silent) {
            toast.error('Session expired. Please log in again.');
          }
        }
        // Other errors
        else {
          console.error('❌ Unexpected error fetching profile');
          if (!silent) {
            toast.error('Failed to load profile. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      if (!silent) {
        toast.error('Failed to load user profile');
      }
    }
  };

  const handleAuth = async (email: string, password: string, signupData?: any) => {
    try {
      // Determine if this is signup or login
      const isSignup = authModalMode === 'signup' || authModalMode === 'lead';
      
      if (isSignup) {
        console.log('🔐 Starting signup via backend...');
        
        // Use backend signup endpoint which handles user creation with auto-confirmed email
        const signupResponse = await fetch(`${apiUrl}/user/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`, // Required by Supabase Edge Functions
          },
          body: JSON.stringify({
            email,
            password,
            firstName: signupData?.fullName || email.split('@')[0],
            country: signupData?.country || 'US',
            signupData: signupData || {},
          }),
        });

        if (!signupResponse.ok) {
          const errorData = await signupResponse.json();
          console.error('❌ Signup failed:', errorData);
          
          // Check if user already exists
          if (errorData.error?.includes('already registered') || errorData.error?.includes('already exists')) {
            toast.error('This email is already registered. Please log in instead.', {
              duration: 5000,
              action: {
                label: 'Login',
                onClick: () => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }
              }
            });
          } else {
            toast.error(errorData.error || 'Signup failed');
          }
          return;
        }

        const signupResult = await signupResponse.json();
        console.log('✅ Signup successful:', signupResult);

        toast.success('Account created successfully!');
        
        // Wait for Supabase to fully process the user creation and profile storage
        console.log('⏳ Waiting for backend to complete profile creation...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Now sign in to get the session
        console.log('🔐 Signing in to get session with email:', email);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(), // Ensure email is normalized
          password,
        });

        if (signInError) {
          console.error('❌ Auto sign-in failed:', signInError);
          console.error('❌ Full error details:', JSON.stringify(signInError, null, 2));
          toast.error(`Account created! Please try logging in manually. Error: ${signInError.message}`);
          setAuthModalMode('login');
          return;
        }

        if (!signInData.session?.access_token) {
          toast.error('Account created! Please log in manually.');
          setAuthModalMode('login');
          return;
        }

        console.log('✅ Auto sign-in successful');

        setAccessToken(signInData.session.access_token);
        localStorage.setItem('accessToken', signInData.session.access_token);
        localStorage.setItem('userId', signInData.user.id);
        await fetchUserProfile(signInData.user.id, signInData.session.access_token);
        setAuthModalOpen(false);
        toast.success('Welcome to Pip Nation Academy!');
      } else {
        // Sign in using Supabase client
        console.log('🔐 Starting sign in with Supabase Auth...');
        console.log('🔐 Login attempt with email:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(), // Normalize email
          password,
        });

        if (error) {
          console.error('❌ Sign in error:', error);
          console.error('❌ Error details:', JSON.stringify(error, null, 2));
          toast.error(error.message || 'Invalid email or password');
          return;
        }

        if (!data.session?.access_token || !data.user?.id) {
          toast.error('Sign in failed - no session created');
          return;
        }

        console.log('✅ Sign in successful:', data.user.id);

        setAccessToken(data.session.access_token);
        localStorage.setItem('accessToken', data.session.access_token);
        localStorage.setItem('userId', data.user.id);
        
        console.log('📞 About to fetch user profile...');
        await fetchUserProfile(data.user.id, data.session.access_token);
        console.log('✅ Profile fetch completed (check logs above for details)');
        
        setAuthModalOpen(false);
        toast.success('Welcome back!');
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase (clears session)
      await supabase.auth.signOut();
      console.log('✅ Signed out from Supabase');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
    
    // Clear local state
    setAccessToken('');
    setUserProfile(null);
    setCurrentView('landing');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
  };

  const handleGetStarted = () => {
    setAuthModalMode('lead');
    setAuthModalOpen(true);
  };

  const handleLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setLessonViewerOpen(true);
  };

  const handleLessonComplete = async (quizScore?: number) => {
    if (!userProfile) return;

    try {
      const lessonData = {
        userId: userProfile.userId,
        courseLevel: selectedLesson.level,
        lessonId: selectedLesson.id,
      };

      const response = await fetch(`${apiUrl}/progress/lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(lessonData),
      });

      if (response.ok) {
        toast.success('Lesson completed!');
        
        // If it's a quiz, submit the score
        if (selectedLesson.isQuiz && quizScore !== undefined) {
          const quizResponse = await fetch(`${apiUrl}/quiz/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userId: userProfile.userId,
              quizId: selectedLesson.id,
              score: quizScore,
              courseLevel: selectedLesson.level,
            }),
          });

          const quizData = await quizResponse.json();
          
          if (quizResponse.ok) {
            if (quizData.advancedUnlocked) {
              toast.success('🎉 Advanced Course Unlocked!');
            }
          }
        }
        
        // Refresh user profile
        await fetchUserProfile(userProfile.userId, accessToken);
        setLessonViewerOpen(false);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleSubmitFTMO = () => {
    setFtmoModalOpen(true);
  };

  const handleFTMOSubmission = async (proofUrl: string, notes: string) => {
    if (!userProfile) return;

    try {
      const response = await fetch(`${apiUrl}/ftmo/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: userProfile.userId,
          proofUrl,
          notes,
        }),
      });

      if (response.ok) {
        toast.success('FTMO proof submitted for verification!');
      } else {
        toast.error('Failed to submit FTMO proof');
      }
    } catch (error) {
      console.error('Error submitting FTMO proof:', error);
      toast.error('Submission failed');
    }
  };

  const handleCourseEnroll = async (courseId: string) => {
    if (!userProfile) {
      console.error('❌ No user profile - cannot enroll');
      toast.error('Please log in to access courses');
      return;
    }

    console.log(`🔄 handleCourseEnroll called for course: ${courseId}`);
    console.log(`📊 Current state BEFORE refresh:`, {
      enrolledCourses: userProfile.enrolledCourses,
      role: userProfile.role,
      userId: userProfile.userId,
    });

    // Refresh user profile to get updated enrollment status
    console.log('🔄 Refreshing user profile...');
    await fetchUserProfile(userProfile.userId, accessToken);
    
    console.log(`✅ Profile refreshed, navigating to: ${courseId}`);
    // Navigate to course dashboard
    setCurrentView(courseId as View);
  };

  const handleViewChange = (view: View) => {
    console.log(`🔀 handleViewChange called with view: ${view}`);
    setCurrentView(view);
    console.log(`✅ Current view set to: ${view}`);
  };

  // Show diagnostics if there's a '?diagnostics' query parameter
  const showDiagnostics = typeof window !== 'undefined' && window.location.search.includes('diagnostics');
  const showAuthTester = typeof window !== 'undefined' && window.location.search.includes('test-auth');
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const hasResetError = hash.includes('error=');
  
  // Check for password reset token in URL hash
  const isPasswordReset = typeof window !== 'undefined' && 
    window.location.hash.includes('type=recovery') && 
    window.location.hash.includes('access_token');

  if (showDiagnostics) {
    return (
      <div className="min-h-screen bg-background p-8">
        <ServerDiagnostics />
        <div className="text-center mt-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-sm text-primary hover:underline"
          >
            ← Back to app
          </button>
        </div>
      </div>
    );
  }

  if (showAuthTester) {
    return <AuthTester />;
  }

  if (hasResetError) {
    return <ResetError onOpenLogin={() => setAuthModalOpen(true)} />;
  }

  if (isPasswordReset) {
    return <ResetPassword />;
  }

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      )}

      {currentView === 'dashboard' && userProfile && (
        <>
          {console.log('🎨 Rendering StudentDashboard with:', {
            hasUserProfile: !!userProfile,
            userId: userProfile?.userId,
            role: userProfile?.role,
            hasProgress: !!userProfile?.progress
          })}
          <StudentDashboard
            user={userProfile}
            onLogout={handleLogout}
            onLessonClick={handleLessonClick}
            onSubmitFTMO={handleSubmitFTMO}
            accessToken={accessToken}
            onViewChange={handleViewChange}
          />
        </>
      )}

      {/* Loading state for dashboard without profile */}
      {currentView === 'dashboard' && !userProfile && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl mb-2">Loading your dashboard...</h2>
            <p className="text-gray-600">Please wait while we fetch your profile</p>
          </div>
        </div>
      )}

      {currentView === 'courses' && userProfile && (() => {
        console.log('🎨 Rendering courses view:', {
          currentView,
          hasUserProfile: !!userProfile,
          enrolledCourses: userProfile.enrolledCourses,
          userId: userProfile.userId
        });
        return (
          <CourseEnrollment
            enrolledCourses={userProfile.enrolledCourses || []}
            onEnroll={handleCourseEnroll}
            onBack={() => handleViewChange('dashboard')}
            userName={userProfile.firstName}
            userRole={userProfile.role}
            onLogout={handleLogout}
            userId={userProfile.userId}
            accessToken={accessToken}
          />
        );
      })()}

      {currentView === 'beginners' && userProfile && (() => {
        const isEnrolled = userProfile.enrolledCourses?.includes('beginners') || false;
        const hasAccess = isEnrolled && userProfile.role !== 'lead';
        
        console.log('🔍 Beginners view render:', {
          currentView,
          isEnrolled,
          role: userProfile.role,
          hasAccess,
          enrolledCourses: userProfile.enrolledCourses,
          progress: userProfile.progress?.beginners,
        });
        
        if (hasAccess) {
          return (
            <BeginnersDashboard
              userProgress={userProfile.progress.beginners}
              completedLessons={userProfile.completedLessons}
              onLessonSelect={handleLessonClick}
              onBack={() => handleViewChange('dashboard')}
              userName={userProfile.firstName}
              userRole={userProfile.role}
              onLogout={handleLogout}
            />
          );
        } else {
          return (
            <CourseEnrollment
              enrolledCourses={userProfile.enrolledCourses}
              onEnroll={handleCourseEnroll}
              onBack={() => handleViewChange('dashboard')}
              userName={userProfile.firstName}
              userRole={userProfile.role}
              onLogout={handleLogout}
              userId={userProfile.userId}
              accessToken={accessToken}
            />
          );
        }
      })()}

      {currentView === 'strategy' && userProfile && (() => {
        const isEnrolled = userProfile.enrolledCourses?.includes('strategy') || false;
        const hasAccess = isEnrolled && userProfile.role !== 'lead';
        
        console.log('🔍 Strategy view render:', {
          currentView,
          isEnrolled,
          role: userProfile.role,
          hasAccess,
          enrolledCourses: userProfile.enrolledCourses,
          progress: userProfile.progress?.strategy,
        });
        
        if (hasAccess) {
          return (
            <StrategyDashboard
              userProgress={userProfile.progress.strategy}
              completedLessons={userProfile.completedLessons}
              onLessonSelect={handleLessonClick}
              onBack={() => handleViewChange('dashboard')}
              userName={userProfile.firstName}
              userRole={userProfile.role}
              onLogout={handleLogout}
            />
          );
        } else {
          return (
            <CourseEnrollment
              enrolledCourses={userProfile.enrolledCourses}
              onEnroll={handleCourseEnroll}
              onBack={() => handleViewChange('dashboard')}
              userName={userProfile.firstName}
              userRole={userProfile.role}
              onLogout={handleLogout}
              userId={userProfile.userId}
              accessToken={accessToken}
            />
          );
        }
      })()}

      {currentView === 'community' && userProfile && (
        <CommunityPage
          userRole={userProfile.role}
          enrolledCourses={userProfile.enrolledCourses}
          coursesCompleted={userProfile.coursesCompleted}
          onBack={() => handleViewChange('dashboard')}
          userName={userProfile.firstName}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'admin' && (
        <EnhancedAdminDashboard
          accessToken={accessToken}
          onLogout={handleLogout}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authModalMode}
        onAuth={handleAuth}
      />

      <LessonViewer
        lesson={selectedLesson}
        isOpen={lessonViewerOpen}
        onClose={() => setLessonViewerOpen(false)}
        onComplete={handleLessonComplete}
      />

      <FTMOSubmissionModal
        isOpen={ftmoModalOpen}
        onClose={() => setFtmoModalOpen(false)}
        onSubmit={handleFTMOSubmission}
      />

      {/* Fallback for invalid states */}
      {currentView !== 'landing' && 
       currentView !== 'dashboard' && 
       currentView !== 'courses' && 
       currentView !== 'beginners' && 
       currentView !== 'strategy' && 
       currentView !== 'community' && 
       currentView !== 'admin' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Invalid view: {currentView}</p>
            <Button onClick={() => setCurrentView('dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
      <DebugPanel />
    </>
  );
}
