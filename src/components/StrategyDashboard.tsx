import { useState } from 'react';
import { TrendingUp, Play, CheckCircle, Lock, Download, Clock, Award, Target, BarChart } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { NavigationHeader } from './NavigationHeader';

interface StrategyDashboardProps {
  userProgress: {
    completed: number;
    total: number;
  };
  completedLessons: string[];
  onLessonSelect: (lesson: any) => void;
  onBack?: () => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export function StrategyDashboard({ userProgress, completedLessons, onLessonSelect, onBack, userName, userRole, onLogout }: StrategyDashboardProps) {
  const modules = [
    {
      id: 'module1',
      title: 'Advanced Trading Strategies',
      description: 'Professional strategies for consistent profits',
      lessons: [
        { id: 's1', title: 'Price Action Mastery', duration: '45 min', type: 'video' },
        { id: 's2', title: 'Supply & Demand Zones', duration: '50 min', type: 'video' },
        { id: 's3', title: 'Multi-Timeframe Analysis', duration: '40 min', type: 'video' },
        { id: 's4', title: 'Breakout Strategies', duration: '38 min', type: 'video' },
        { id: 's5', title: 'Reversal Trading Techniques', duration: '42 min', type: 'video' },
      ]
    },
    {
      id: 'module2',
      title: 'Risk & Money Management',
      description: 'Protect and grow your trading capital',
      lessons: [
        { id: 's6', title: 'Advanced Position Sizing', duration: '35 min', type: 'video' },
        { id: 's7', title: 'Portfolio Management', duration: '40 min', type: 'video' },
        { id: 's8', title: 'Drawdown Recovery', duration: '30 min', type: 'video' },
        { id: 's9', title: 'Risk of Ruin Analysis', duration: '32 min', type: 'video' },
      ]
    },
    {
      id: 'module3',
      title: 'Market Psychology',
      description: 'Master the mental game of trading',
      lessons: [
        { id: 's10', title: 'Trading Psychology Fundamentals', duration: '38 min', type: 'video' },
        { id: 's11', title: 'Emotional Control', duration: '35 min', type: 'video' },
        { id: 's12', title: 'Developing Discipline', duration: '30 min', type: 'video' },
        { id: 's13', title: 'Dealing with Losses', duration: '28 min', type: 'video' },
      ]
    },
    {
      id: 'module4',
      title: 'FTMO Challenge Preparation',
      description: 'Get funded with prop firms',
      lessons: [
        { id: 's14', title: 'FTMO Rules & Requirements', duration: '25 min', type: 'video' },
        { id: 's15', title: 'Challenge Strategies', duration: '40 min', type: 'video' },
        { id: 's16', title: 'Verification Phase Tips', duration: '30 min', type: 'video' },
        { id: 's17', title: 'Funded Account Management', duration: '35 min', type: 'video' },
      ]
    }
  ];

  const resources = [
    { name: 'Advanced Strategy Guide.pdf', size: '4.2 MB', type: 'PDF' },
    { name: 'FTMO Challenge Checklist.pdf', size: '1.2 MB', type: 'PDF' },
    { name: 'Trade Management Calculator.xlsx', size: '850 KB', type: 'Excel' },
    { name: 'Psychology Journal Template.pdf', size: '720 KB', type: 'PDF' },
    { name: 'Signal Room Access Guide.pdf', size: '980 KB', type: 'PDF' },
  ];

  const progressPercentage = (userProgress.completed / userProgress.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navigation Header */}
      {onBack && (
        <NavigationHeader
          title="Strategy & Mentorship"
          subtitle="Advanced strategies and personalized guidance"
          userName={userName}
          userRole={userRole}
          onBack={onBack}
          onHome={onBack}
          onLogout={onLogout}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2">
              Strategy & Mentorship Program
            </h1>
            <p className="text-sm md:text-base text-purple-100 mb-4 md:mb-6">
              Advanced strategies and personalized guidance
            </p>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-purple-100">Lessons</div>
                      <div className="text-xl md:text-2xl">
                        {userProgress.completed}/{userProgress.total}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <BarChart className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-purple-100">Progress</div>
                      <div className="text-xl md:text-2xl">
                        {Math.round(progressPercentage)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-purple-100">Signal Room</div>
                      <div className="text-base md:text-lg">
                        {progressPercentage === 100 ? 'Unlocked' : 'Locked'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-purple-100">Certificate</div>
                      <div className="text-base md:text-lg">
                        {progressPercentage === 100 ? 'Earned' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Modules & Lessons */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {modules.map((module, moduleIdx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: moduleIdx * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all">
                  <CardHeader className="pb-3 md:pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg md:text-xl mb-1">
                          Module {moduleIdx + 1}: {module.title}
                        </CardTitle>
                        <p className="text-xs md:text-sm text-gray-600">
                          {module.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {module.lessons.filter(l => completedLessons.includes(l.id)).length}/{module.lessons.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {module.lessons.map((lesson, lessonIdx) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isLocked = lessonIdx > 0 && !completedLessons.includes(module.lessons[lessonIdx - 1].id);

                      return (
                        <Button
                          key={lesson.id}
                          onClick={() => !isLocked && onLessonSelect({ ...lesson, moduleId: module.id })}
                          disabled={isLocked}
                          variant="ghost"
                          className={`w-full justify-start h-auto p-3 md:p-4 ${
                            isCompleted ? 'bg-purple-50 hover:bg-purple-100' : 
                            isLocked ? 'bg-gray-50 opacity-60' : 'hover:bg-pink-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? 'bg-purple-500' :
                              isLocked ? 'bg-gray-300' : 'bg-pink-500'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              ) : isLocked ? (
                                <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                              ) : (
                                <Play className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-sm md:text-base truncate">
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                            {isCompleted && (
                              <Badge className="bg-purple-500 text-white border-0 text-xs flex-shrink-0">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 md:mb-4">
                    <div className="flex items-center justify-between mb-2 text-xs md:text-sm">
                      <span className="text-gray-600">Course Completion</span>
                      <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 md:h-3" />
                  </div>
                  <Separator className="my-3 md:my-4" />
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">{userProgress.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-semibold">{userProgress.total - userProgress.completed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Signal Room Access */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className={`border-2 ${
                progressPercentage === 100 ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              }`}>
                <CardContent className="p-4 md:p-6 text-center">
                  <Target className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${
                    progressPercentage === 100 ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <h3 className="text-base md:text-lg mb-2">
                    {progressPercentage === 100 ? '🎉 Signal Room Unlocked!' : 'Signal Room'}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                    {progressPercentage === 100 
                      ? 'Access premium trading signals and analysis'
                      : 'Complete the course to unlock'}
                  </p>
                  <Button 
                    disabled={progressPercentage !== 100}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base"
                  >
                    {progressPercentage === 100 ? 'Access Signals' : 'Locked'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {resources.map((resource, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start h-auto p-2 md:p-3"
                    >
                      <div className="flex items-center gap-2 md:gap-3 w-full text-left">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                          <Download className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs md:text-sm truncate">{resource.name}</div>
                          <div className="text-xs text-gray-500">{resource.size}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
