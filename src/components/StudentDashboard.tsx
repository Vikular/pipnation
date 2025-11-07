import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award, Users, Clock, CheckCircle, Lock, Upload, LogOut, Target, Sparkles, BarChart3, Calendar, MessageSquare, Download, FileText, Video, Headphones, BookMarked, PieChart, LineChart, DollarSign, Globe, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  country: string;
  role: string;
  progress: {
    foundation: { completed: number; total: number };
    advanced: { completed: number; total: number };
  };
  completedLessons: string[];
  quizScores: Record<string, any>;
  advancedUnlocked?: boolean;
  enrolledCourses?: string[];
}

interface StudentDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onLessonClick: (lesson: any) => void;
  onSubmitFTMO: () => void;
  accessToken: string;
  onViewChange?: (view: any) => void;
}

export function StudentDashboard({ user, onLogout, onLessonClick, onSubmitFTMO, accessToken, onViewChange }: StudentDashboardProps) {
  console.log('🎨 StudentDashboard rendering with user:', {
    userId: user.userId,
    email: user.email,
    role: user.role,
    enrolledCourses: user.enrolledCourses,
    progress: user.progress,
  });

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const foundationLessons = [
    { id: 'f1', title: 'Introduction to Forex Trading', duration: '45 min', level: 'foundation', description: 'Get started with forex basics', icon: '📚' },
    { id: 'f2', title: 'Market Structure Basics', duration: '60 min', level: 'foundation', description: 'Understanding market movement', icon: '📊' },
    { id: 'f3', title: 'Understanding Currency Pairs', duration: '40 min', level: 'foundation', description: 'Major, minor, and exotic pairs', icon: '💱' },
    { id: 'f4', title: 'Support and Resistance', duration: '55 min', level: 'foundation', description: 'Key price levels', icon: '📈' },
    { id: 'f5', title: 'Trend Analysis', duration: '50 min', level: 'foundation', description: 'Identify market trends', icon: '📉' },
    { id: 'f6', title: 'Candlestick Patterns', duration: '65 min', level: 'foundation', description: 'Reading price action', icon: '🕯️' },
    { id: 'f7', title: 'Risk Management Fundamentals', duration: '70 min', level: 'foundation', description: 'Protect your capital', icon: '🛡️' },
    { id: 'f8', title: 'Trading Psychology Basics', duration: '45 min', level: 'foundation', description: 'Master your mindset', icon: '🧠' },
    { id: 'f9', title: 'Entry and Exit Strategies', duration: '60 min', level: 'foundation', description: 'Timing your trades', icon: '🎯' },
    { id: 'f10', title: 'Position Sizing', duration: '50 min', level: 'foundation', description: 'How much to risk', icon: '⚖️' },
    { id: 'f11', title: 'Building Your Trading Plan', duration: '55 min', level: 'foundation', description: 'Create your strategy', icon: '📋' },
    { id: 'f12', title: 'Foundation Review and Quiz', duration: '30 min', level: 'foundation', isQuiz: true, description: 'Test your knowledge', icon: '✅' },
  ];

  const advancedLessons = [
    { id: 'a1', title: 'Advanced Market Structure', duration: '75 min', level: 'advanced', description: 'Deep dive into price action', icon: '🔍' },
    { id: 'a2', title: 'Smart Money Concepts', duration: '80 min', level: 'advanced', description: 'Institutional trading', icon: '💼' },
    { id: 'a3', title: 'Order Blocks and Fair Value Gaps', duration: '70 min', level: 'advanced', description: 'Advanced price patterns', icon: '🎪' },
    { id: 'a4', title: 'Liquidity Trading', duration: '85 min', level: 'advanced', description: 'Where the money flows', icon: '💧' },
    { id: 'a5', title: 'Multi-Timeframe Analysis', duration: '65 min', level: 'advanced', description: 'Top-down trading approach', icon: '⏰' },
    { id: 'a6', title: 'Advanced Risk Management', duration: '75 min', level: 'advanced', description: 'Portfolio management', icon: '🎲' },
    { id: 'a7', title: 'Trading Psychology Mastery', duration: '60 min', level: 'advanced', description: 'Mental game mastery', icon: '🧘' },
    { id: 'a8', title: 'Backtesting Strategies', duration: '90 min', level: 'advanced', description: 'Test your edge', icon: '🔬' },
    { id: 'a9', title: 'Live Trade Analysis', duration: '80 min', level: 'advanced', description: 'Real trade breakdowns', icon: '🎬' },
    { id: 'a10', title: 'Session Trading Strategies', duration: '70 min', level: 'advanced', description: 'London, NY, Asia', icon: '🌍' },
    { id: 'a11', title: 'News Trading Techniques', duration: '65 min', level: 'advanced', description: 'Trading the events', icon: '📰' },
    { id: 'a12', title: 'Building Your Edge', duration: '75 min', level: 'advanced', description: 'Find your advantage', icon: '⚡' },
    { id: 'a13', title: 'Preparing for FTMO', duration: '60 min', level: 'advanced', description: 'Challenge preparation', icon: '🏆' },
    { id: 'a14', title: 'Advanced Strategies Review', duration: '55 min', level: 'advanced', description: 'Putting it all together', icon: '🎓' },
    { id: 'a15', title: 'Advanced Final Exam', duration: '40 min', level: 'advanced', isQuiz: true, description: 'Final assessment', icon: '🎖️' },
  ];

  const resources = {
    ebooks: [
      { title: 'The Complete Forex Trading Guide', size: '12.5 MB', pages: 245, icon: '📖' },
      { title: 'Risk Management Mastery', size: '8.2 MB', pages: 156, icon: '🛡️' },
      { title: 'Technical Analysis Bible', size: '15.7 MB', pages: 312, icon: '📊' },
      { title: 'Trading Psychology Handbook', size: '6.8 MB', pages: 189, icon: '🧠' },
    ],
    tools: [
      { title: 'Position Size Calculator', type: 'Excel Template', icon: '🧮' },
      { title: 'Trading Journal Template', type: 'PDF & Excel', icon: '📔' },
      { title: 'Risk/Reward Calculator', type: 'Web Tool', icon: '⚖️' },
      { title: 'Economic Calendar', type: 'Live Feed', icon: '📅' },
    ],
    videos: [
      { title: 'Live Trading Session - EUR/USD', duration: '2h 15m', views: '12.5K', icon: '🎥' },
      { title: 'Market Analysis Masterclass', duration: '1h 45m', views: '8.3K', icon: '📺' },
      { title: 'Strategy Deep Dive', duration: '3h 20m', views: '15.2K', icon: '🎬' },
    ],
    webinars: [
      { title: 'Monthly Market Outlook', date: 'Every 1st Monday', time: '7:00 PM EST', icon: '📡' },
      { title: 'Live Q&A with Pro Traders', date: 'Every Wednesday', time: '6:00 PM EST', icon: '💬' },
      { title: 'Strategy Workshop', date: 'Every Friday', time: '8:00 PM EST', icon: '🎓' },
    ]
  };

  const isLessonCompleted = (lessonId: string) => {
    return user.completedLessons.includes(lessonId);
  };

  const canAccessAdvanced = user.role === 'student' && user.advancedUnlocked;
  const canAccessSignalRoom = user.role === 'pro-trader' || user.role === 'funded-trader';
  const isLead = user.role === 'lead';

  // Safe progress calculation - handle undefined progress object
  const progress = user.progress || {
    foundation: { completed: 0, total: 0 },
    advanced: { completed: 0, total: 0 },
    beginners: { completed: 0, total: 0 },
    strategy: { completed: 0, total: 0 }
  };
  
  const foundationProgress = progress.foundation?.total > 0 
    ? (progress.foundation.completed / progress.foundation.total) * 100 
    : 0;
  const advancedProgress = progress.advanced?.total > 0 
    ? (progress.advanced.completed / progress.advanced.total) * 100 
    : 0;

  console.log('📊 Progress calculated:', { 
    hasProgress: !!user.progress,
    foundationProgress, 
    advancedProgress 
  });

  try {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl">Pip Nation Academy</div>
                <div className="text-xs text-gray-600">Student Portal</div>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm">{user.firstName}</div>
                <Badge variant="secondary" className="text-xs">
                  {user.role === 'lead' && '✨ Free Trial'}
                  {user.role === 'student' && '📚 Student'}
                  {user.role === 'pro-trader' && '🏆 Pro Trader'}
                  {user.role === 'funded-trader' && '💰 Funded'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-4xl mb-2">
            {greeting}, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user.firstName}!</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Continue your journey to becoming a funded trader</p>
        </motion.div>

        {/* Upgrade Prompt for Free Trial / Non-Enrolled Users */}
  {(user.enrolledCourses?.length ?? 0) === 0 && onViewChange && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg md:text-xl mb-2">
                      🎓 Unlock Full Access to Premium Courses
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                      You're currently on the <Badge variant="outline" className="mx-1">Free Trial</Badge>. 
                      Enroll in our paid courses to access:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start text-xs md:text-sm">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">✅ Full Course Content</Badge>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300">✅ Premium Community</Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-300">✅ Live Mentorship</Badge>
                      <Badge className="bg-pink-100 text-pink-700 border-pink-300">✅ Trading Signals</Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => onViewChange('courses')}
                      size="lg"
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Navigation */}
        {onViewChange && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => onViewChange('courses')}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {(user.enrolledCourses?.length ?? 0) === 0 ? 'Enroll in Courses' : 'View Courses'}
                  </Button>
                  <Button
                    onClick={() => onViewChange('beginners')}
                    size="sm"
                    variant="outline"
                    disabled={!user.enrolledCourses?.includes('beginners')}
                  >
                    📚 Beginners Academy
                    {!user.enrolledCourses?.includes('beginners') && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                  <Button
                    onClick={() => onViewChange('strategy')}
                    size="sm"
                    variant="outline"
                    disabled={!user.enrolledCourses?.includes('strategy')}
                  >
                    🎯 Strategy Course
                    {!user.enrolledCourses?.includes('strategy') && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                  <Button
                    onClick={() => onViewChange('community')}
                    size="sm"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2 md:pb-3 space-y-0">
                <CardTitle className="text-xs md:text-sm flex items-center gap-2">
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  <span className="hidden sm:inline">Foundation</span>
                  <span className="sm:hidden">Found.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-4">
                <div className="text-2xl md:text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {progress.foundation.completed}/{progress.foundation.total}
                </div>
                <Progress value={foundationProgress} className="h-1.5 md:h-2 mb-1" />
                <div className="text-xs text-gray-600">{Math.round(foundationProgress)}%</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-2 md:pb-3 space-y-0">
                <CardTitle className="text-xs md:text-sm flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                  <span className="hidden sm:inline">Advanced</span>
                  <span className="sm:hidden">Adv.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-4">
                <div className="text-2xl md:text-3xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {canAccessAdvanced ? `${progress.advanced.completed}/${progress.advanced.total}` : 'Locked'}
                </div>
                {canAccessAdvanced ? (
                  <>
                    <Progress value={advancedProgress} className="h-1.5 md:h-2 mb-1" />
                    <div className="text-xs text-gray-600">{Math.round(advancedProgress)}%</div>
                  </>
                ) : (
                  <div className="text-xs text-gray-600 flex items-center gap-1 mt-3">
                    <Lock className="w-3 h-3" />
                    Complete Foundation
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-2 md:pb-3 space-y-0">
                <CardTitle className="text-xs md:text-sm flex items-center gap-2">
                  <Target className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  Level
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-4">
                <div className="text-lg md:text-2xl mb-1">
                  {isLead && '🎓 Free'}
                  {user.role === 'student' && !canAccessAdvanced && '📚 Basic'}
                  {user.role === 'student' && canAccessAdvanced && '⚡ Advanced'}
                  {canAccessSignalRoom && '🏆 Pro'}
                </div>
                <div className="text-xs text-gray-600">Keep going!</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border-2 hover:border-orange-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-2 md:pb-3 space-y-0">
                <CardTitle className="text-xs md:text-sm flex items-center gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                  <span className="hidden sm:inline">Milestone</span>
                  <span className="sm:hidden">Next</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-4">
                <div className="text-xs md:text-sm mb-1 line-clamp-2">
                  {isLead && 'Upgrade Plan'}
                  {user.role === 'student' && !canAccessAdvanced && 'Unlock Advanced'}
                  {user.role === 'student' && canAccessAdvanced && 'Pass FTMO'}
                  {canAccessSignalRoom && 'Get Funded'}
                </div>
                <div className="text-xs text-gray-600">Your next goal</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upgrade Banner for Lead */}
        <AnimatePresence>
          {isLead && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-xl overflow-hidden">
                <CardContent className="py-6 md:py-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="flex-1 text-center lg:text-left">
                      <Badge className="mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Exclusive Offer
                      </Badge>
                      <h3 className="text-xl md:text-3xl mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Upgrade to Full Access
                      </h3>
                      <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
                        Unlock all courses, live sessions, mentorship & community
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm md:text-base">
                          <Award className="w-4 h-4 mr-2" />
                          Beginners - $50
                        </Button>
                        <Button variant="outline" className="text-sm md:text-base">
                          <Users className="w-4 h-4 mr-2" />
                          Mentorship - $70
                        </Button>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="hidden lg:block"
                    >
                      <Award className="w-24 h-24 md:w-32 md:h-32 text-blue-600 opacity-20" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FTMO Banner */}
        <AnimatePresence>
          {user.role === 'student' && canAccessAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl">
                <CardContent className="py-6 md:py-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="flex-1 text-center lg:text-left">
                      <Badge className="mb-2 md:mb-3 bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
                        <Target className="w-3 h-3 mr-1" />
                        Next Step
                      </Badge>
                      <h3 className="text-xl md:text-3xl mb-2 md:mb-3">Ready for FTMO?</h3>
                      <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
                        Pass the challenge and unlock the Signal Room
                      </p>
                      <Button onClick={onSubmitFTMO} className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit FTMO Proof
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-white/50 p-1">
            <TabsTrigger value="courses" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3">
              <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Courses</span>
              <span className="sm:hidden">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3">
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">Files</span>
            </TabsTrigger>
            {canAccessSignalRoom && (
              <TabsTrigger value="signals" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3">
                <Users className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Signal Room</span>
                <span className="sm:hidden">Signals</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            {/* Foundation Course */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 space-y-2 md:space-y-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    <div>
                      <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                        Foundation Course
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base mt-1 md:mt-2">
                        Master forex fundamentals
                      </CardDescription>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {progress.foundation.completed}/{progress.foundation.total}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6">
                  <ScrollArea className="h-[400px] md:h-[500px] pr-3 md:pr-4">
                    <div className="space-y-2 md:space-y-3">
                      {foundationLessons.map((lesson, idx) => {
                        const completed = isLessonCompleted(lesson.id);
                        const locked = isLead && idx > 2;
                        
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={!locked ? { x: 4, scale: 1.01 } : {}}
                            className={`flex items-center justify-between p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                              locked 
                                ? 'bg-gray-50 opacity-60 cursor-not-allowed' 
                                : completed
                                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:border-green-400'
                                : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-400 cursor-pointer hover:shadow-md'
                            }`}
                            onClick={() => !locked && onLessonClick(lesson)}
                          >
                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                              <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl ${
                                completed 
                                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                  : locked 
                                  ? 'bg-gray-200' 
                                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
                              }`}>
                                {completed ? (
                                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                ) : locked ? (
                                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                                ) : (
                                  <span>{lesson.icon}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm md:text-base truncate">{lesson.title}</span>
                                  {lesson.isQuiz && <Badge variant="outline" className="text-xs">Quiz</Badge>}
                                </div>
                                <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                    {lesson.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {locked && (
                              <Badge className="flex-shrink-0 text-xs">Upgrade</Badge>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Advanced Course */}
            {canAccessAdvanced && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 space-y-2 md:space-y-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                      <div>
                        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                          Advanced Course
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base mt-1 md:mt-2">
                          Develop your trading edge
                        </CardDescription>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {progress.advanced.completed}/{progress.advanced.total}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">Complete</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 md:pt-6">
                    <ScrollArea className="h-[400px] md:h-[500px] pr-3 md:pr-4">
                      <div className="space-y-2 md:space-y-3">
                        {advancedLessons.map((lesson, idx) => {
                          const completed = isLessonCompleted(lesson.id);
                          
                          return (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              whileHover={{ x: 4, scale: 1.01 }}
                              className={`flex items-center justify-between p-3 md:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                                completed
                                  ? 'bg-gradient-to-r from-green-50 to-purple-50 border-green-200 hover:border-green-400'
                                  : 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-400 hover:shadow-md'
                              }`}
                              onClick={() => onLessonClick(lesson)}
                            >
                              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl ${
                                  completed 
                                    ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                }`}>
                                  {completed ? (
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                  ) : (
                                    <span>{lesson.icon}</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm md:text-base truncate">{lesson.title}</span>
                                    {lesson.isQuiz && <Badge variant="outline" className="text-xs">Quiz</Badge>}
                                  </div>
                                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                      {lesson.duration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* E-Books */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 hover:border-blue-400 transition-all h-full">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <BookMarked className="w-5 h-5 text-blue-600" />
                      E-Books & Guides
                    </CardTitle>
                    <CardDescription>Essential trading literature</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {resources.ebooks.map((book, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-3 rounded-lg border-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl">{book.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{book.title}</div>
                              <div className="text-xs text-gray-600">{book.pages} pages • {book.size}</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2 hover:border-green-400 transition-all h-full">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Zap className="w-5 h-5 text-green-600" />
                      Trading Tools
                    </CardTitle>
                    <CardDescription>Calculators and templates</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {resources.tools.map((tool, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-3 rounded-lg border-2 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl">{tool.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{tool.title}</div>
                              <div className="text-xs text-gray-600">{tool.type}</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-green-600 flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Video Library */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 hover:border-purple-400 transition-all h-full">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Video className="w-5 h-5 text-purple-600" />
                      Video Library
                    </CardTitle>
                    <CardDescription>Recorded sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {resources.videos.map((video, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-3 rounded-lg border-2 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl">{video.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{video.title}</div>
                              <div className="text-xs text-gray-600">{video.duration} • {video.views} views</div>
                            </div>
                          </div>
                          <Video className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Webinars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-2 hover:border-orange-400 transition-all h-full">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Live Webinars
                    </CardTitle>
                    <CardDescription>Scheduled live sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {resources.webinars.map((webinar, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-3 rounded-lg border-2 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl">{webinar.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{webinar.title}</div>
                              <div className="text-xs text-gray-600">{webinar.date} • {webinar.time}</div>
                            </div>
                          </div>
                          <Badge className="bg-orange-500 text-white border-0 text-xs flex-shrink-0">Live</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Signal Room Tab */}
          {canAccessSignalRoom && (
            <TabsContent value="signals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-green-500 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl md:text-2xl">Signal Room</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                          Exclusive verified trader access
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl">
                        <h3 className="text-lg md:text-xl mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-green-600" />
                          Welcome to the Signal Room!
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 mb-4">
                          Access live signals, community, and priority support from pros
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                          <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Join Discord
                          </Button>
                          <Button variant="outline">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Today's Signals
                          </Button>
                        </div>
                      </div>

                      <Card className="border-2">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Recent Signals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { pair: 'EUR/USD', direction: 'Long', profit: '+2.5%', entry: '1.0850', target: '1.0920', sl: '1.0800', icon: '💶' },
                              { pair: 'GBP/JPY', direction: 'Short', profit: '+3.1%', entry: '193.50', target: '191.80', sl: '194.20', icon: '💷' },
                              { pair: 'XAU/USD', direction: 'Long', profit: '+1.8%', entry: '2020', target: '2045', sl: '2010', icon: '🏅' }
                            ].map((signal, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ x: 4 }}
                                className="p-3 md:p-4 border-2 rounded-xl hover:border-green-400 transition-all bg-gradient-to-r from-white to-green-50"
                              >
                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{signal.icon}</span>
                                    <span className="text-base md:text-lg">{signal.pair}</span>
                                    <Badge variant="outline">{signal.direction}</Badge>
                                  </div>
                                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                                    {signal.profit} Profit
                                  </Badge>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600">
                                  Entry: {signal.entry} | Target: {signal.target} | SL: {signal.sl}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
  } catch (error) {
    console.error('❌ StudentDashboard render error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">Something went wrong loading the dashboard.</p>
          <pre className="text-xs text-left bg-gray-100 p-3 rounded overflow-auto mb-4">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
}
