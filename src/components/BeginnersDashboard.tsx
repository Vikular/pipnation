import { useState } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Download, Clock, Award, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { NavigationHeader } from './NavigationHeader';

interface BeginnersDashboardProps {
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

export function BeginnersDashboard({ userProgress, completedLessons, onLessonSelect, onBack, userName, userRole, onLogout }: BeginnersDashboardProps) {
  const [selectedModule, setSelectedModule] = useState(0);

  const modules = [
    {
      id: 'module1',
      title: 'Forex Fundamentals',
      description: 'Master the basics of forex trading',
      lessons: [
        { id: 'b1', title: 'What is Forex Trading?', duration: '15 min', type: 'video' },
        { id: 'b2', title: 'Currency Pairs Explained', duration: '20 min', type: 'video' },
        { id: 'b3', title: 'Understanding Pips & Lots', duration: '18 min', type: 'video' },
        { id: 'b4', title: 'Market Sessions & Timing', duration: '12 min', type: 'video' },
      ]
    },
    {
      id: 'module2',
      title: 'Technical Analysis Basics',
      description: 'Learn to read charts and identify patterns',
      lessons: [
        { id: 'b5', title: 'Introduction to Charts', duration: '25 min', type: 'video' },
        { id: 'b6', title: 'Support & Resistance', duration: '30 min', type: 'video' },
        { id: 'b7', title: 'Trend Lines & Channels', duration: '22 min', type: 'video' },
        { id: 'b8', title: 'Common Chart Patterns', duration: '35 min', type: 'video' },
      ]
    },
    {
      id: 'module3',
      title: 'Risk Management',
      description: 'Protect your capital and manage trades',
      lessons: [
        { id: 'b9', title: 'Position Sizing', duration: '20 min', type: 'video' },
        { id: 'b10', title: 'Stop Loss & Take Profit', duration: '25 min', type: 'video' },
        { id: 'b11', title: 'Risk-Reward Ratios', duration: '18 min', type: 'video' },
        { id: 'b12', title: 'Money Management Rules', duration: '22 min', type: 'video' },
      ]
    }
  ];

  const resources = [
    { name: 'Forex Terminology Guide.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'Chart Patterns Cheat Sheet.pdf', size: '1.8 MB', type: 'PDF' },
    { name: 'Risk Calculator.xlsx', size: '450 KB', type: 'Excel' },
    { name: 'Trading Journal Template.xlsx', size: '680 KB', type: 'Excel' },
  ];

  const progressPercentage = (userProgress.completed / userProgress.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      {onBack && (
        <NavigationHeader
          title="Beginners Academy"
          subtitle="Your complete foundation in forex trading"
          userName={userName}
          userRole={userRole}
          onBack={onBack}
          onHome={onBack}
          onLogout={onLogout}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2">
              Beginners Academy
            </h1>
            <p className="text-sm md:text-base text-blue-100 mb-4 md:mb-6">
              Your complete foundation in forex trading
            </p>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-blue-100">Lessons Completed</div>
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
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-blue-100">Progress</div>
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
                      <Award className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-blue-100">Certificate</div>
                      <div className="text-base md:text-lg">
                        {progressPercentage === 100 ? 'Earned!' : 'In Progress'}
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
                            isCompleted ? 'bg-green-50 hover:bg-green-100' : 
                            isLocked ? 'bg-gray-50 opacity-60' : 'hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? 'bg-green-500' :
                              isLocked ? 'bg-gray-300' : 'bg-blue-500'
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
                              <Badge className="bg-green-500 text-white border-0 text-xs flex-shrink-0">
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
                      <span className="text-gray-600">Lessons Completed:</span>
                      <span className="font-semibold">{userProgress.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Lessons:</span>
                      <span className="font-semibold">{userProgress.total - userProgress.completed}</span>
                    </div>
                  </div>
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
                    Course Resources
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
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <Download className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
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

            {/* Certificate */}
            {progressPercentage === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-blue-50">
                  <CardContent className="p-4 md:p-6 text-center">
                    <Award className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-green-600" />
                    <h3 className="text-base md:text-lg mb-2">🎉 Congratulations!</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                      You've completed the Beginners Academy!
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-sm md:text-base">
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
