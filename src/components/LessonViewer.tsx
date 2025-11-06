import { useState } from 'react';
import { X, CheckCircle, PlayCircle, FileText, Award, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface LessonViewerProps {
  lesson: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (quizScore?: number) => void;
}

export function LessonViewer({ lesson, isOpen, onClose, onComplete }: LessonViewerProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);

  if (!isOpen || !lesson) return null;

  const isQuiz = lesson.isQuiz;

  const quizQuestions = [
    {
      id: 'q1',
      question: 'What is the main purpose of risk management in forex trading?',
      options: [
        'To maximize profits at any cost',
        'To protect capital and minimize losses',
        'To increase trading frequency',
        'To predict exact market movements'
      ],
      correct: 1
    },
    {
      id: 'q2',
      question: 'What percentage of your account should you typically risk per trade?',
      options: [
        '10-15%',
        '5-10%',
        '1-2%',
        '20-25%'
      ],
      correct: 2
    },
    {
      id: 'q3',
      question: 'What is a support level in technical analysis?',
      options: [
        'A price level where selling pressure is strong',
        'A price level where buying pressure is strong',
        'The highest price ever reached',
        'The current market price'
      ],
      correct: 1
    },
    {
      id: 'q4',
      question: 'Which of the following is a major currency pair?',
      options: [
        'AUD/NZD',
        'EUR/GBP',
        'EUR/USD',
        'USD/ZAR'
      ],
      correct: 2
    },
    {
      id: 'q5',
      question: 'What does a bullish candlestick pattern indicate?',
      options: [
        'Strong selling pressure',
        'Sideways market movement',
        'Buying pressure and potential upward move',
        'Market closure'
      ],
      correct: 2
    }
  ];

  const handleQuizSubmit = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (parseInt(quizAnswers[q.id]) === q.correct) {
        correct++;
      }
    });
    const score = (correct / quizQuestions.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleComplete = () => {
    if (isQuiz) {
      onComplete(quizScore);
    } else {
      onComplete();
    }
    onClose();
    
    // Reset state
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setVideoWatched(false);
  };

  const progress = isQuiz 
    ? (Object.keys(quizAnswers).length / quizQuestions.length) * 100
    : videoWatched ? 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-y-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 bg-white/95 backdrop-blur-lg border-b z-10 shadow-sm"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={isQuiz ? "default" : "outline"} className="flex-shrink-0">
                    {isQuiz ? '📝 Quiz' : '🎓 Lesson'}
                  </Badge>
                  <h2 className="text-lg md:text-xl truncate">{lesson.title}</h2>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>⏱️ {lesson.duration}</span>
                  {!isQuiz && (
                    <span className="hidden sm:inline">
                      Progress: {Math.round(progress)}%
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
            {!isQuiz && (
              <div className="mt-3">
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {isQuiz ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Quiz: {lesson.title}</CardTitle>
                      {!quizSubmitted && (
                        <p className="text-gray-600 mt-1">
                          Answer all questions correctly to unlock the next level. Pass mark: 80%
                        </p>
                      )}
                    </div>
                  </div>
                  {!quizSubmitted && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Quiz Progress</span>
                        <span className="text-sm">{Object.keys(quizAnswers).length}/{quizQuestions.length}</span>
                      </div>
                      <Progress value={(Object.keys(quizAnswers).length / quizQuestions.length) * 100} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-8">
                  {!quizSubmitted ? (
                    <div className="space-y-8">
                      {quizQuestions.map((q, idx) => (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-6 border-2 rounded-xl bg-gradient-to-br from-white to-blue-50 hover:border-blue-400 transition-colors"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                              {idx + 1}
                            </div>
                            <div className="flex-1 text-lg">{q.question}</div>
                          </div>
                          <RadioGroup
                            value={quizAnswers[q.id]}
                            onValueChange={(value: any) =>
                              setQuizAnswers({ ...quizAnswers, [q.id]: value })
                            }
                            className="space-y-3 ml-14"
                          >
                            {q.options.map((option, optIdx) => (
                              <motion.div
                                key={optIdx}
                                whileHover={{ x: 4 }}
                                className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                              >
                                <RadioGroupItem value={String(optIdx)} id={`${q.id}-${optIdx}`} />
                                <Label htmlFor={`${q.id}-${optIdx}`} className="flex-1 cursor-pointer">
                                  {option}
                                </Label>
                              </motion.div>
                            ))}
                          </RadioGroup>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                          className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Submit Quiz
                        </Button>
                        {Object.keys(quizAnswers).length !== quizQuestions.length && (
                          <p className="text-center text-sm text-gray-600 mt-3">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            Please answer all questions to submit
                          </p>
                        )}
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center space-y-6 py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                          quizScore >= 80 
                            ? 'bg-gradient-to-br from-green-400 to-green-600' 
                            : 'bg-gradient-to-br from-red-400 to-red-600'
                        } shadow-2xl`}
                      >
                        <div className="text-5xl text-white">
                          {quizScore >= 80 ? '✓' : '✗'}
                        </div>
                      </motion.div>
                      
                      <div>
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl mb-3"
                        >
                          {quizScore >= 80 ? '🎉 Congratulations!' : '📚 Keep Learning'}
                        </motion.h3>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="text-5xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {quizScore.toFixed(0)}%
                          </div>
                          <p className="text-gray-600">Your Score</p>
                        </motion.div>
                      </div>
                      
                      {quizScore >= 80 ? (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200"
                        >
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                          <p className="text-green-900 text-lg">
                            Excellent work! You've passed this quiz.
                          </p>
                          {lesson.id === 'f12' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.7, type: "spring" }}
                              className="mt-4 p-4 bg-white rounded-lg"
                            >
                              <p className="text-xl">
                                🎊 You've unlocked the <strong>Advanced Course</strong>!
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
                        >
                          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                          <p className="text-yellow-900 text-lg">
                            You need 80% to pass. Review the material and try again!
                          </p>
                        </motion.div>
                      )}
                      
                      <Button onClick={handleComplete} className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                        <ChevronRight className="w-5 h-5 mr-2" />
                        {quizScore >= 80 ? 'Continue to Next Lesson' : 'Review Material'}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"
                      />
                      <div className="text-center text-white relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer"
                          onClick={() => setVideoWatched(true)}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
                          >
                            <PlayCircle className="w-12 h-12 text-white" />
                          </motion.div>
                        </motion.div>
                        <p className="text-xl mb-2">Video Lesson</p>
                        <p className="text-sm opacity-75">{lesson.title}</p>
                        {!videoWatched && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs mt-4 opacity-60"
                          >
                            Click to start watching
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Lesson Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="text-2xl">Lesson Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h3 className="text-xl mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        What You'll Learn
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          'Core concepts and fundamental principles',
                          'Practical application and real-world examples',
                          'Step-by-step implementation strategies',
                          'Common mistakes and how to avoid them'
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            whileHover={{ x: 4 }}
                            className="flex items-start gap-3 p-3 rounded-lg border-2 hover:border-blue-400 hover:bg-blue-50 transition-all"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                      <h3 className="text-lg mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Key Takeaways
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        This lesson provides comprehensive coverage of {lesson.title.toLowerCase()}, 
                        giving you the essential knowledge needed to progress in your trading journey. 
                        Make sure to take notes and practice the concepts covered for maximum retention.
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="pt-4"
                    >
                      <Button 
                        onClick={handleComplete} 
                        size="lg" 
                        className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg"
                        disabled={!videoWatched}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Mark as Complete
                      </Button>
                      {!videoWatched && (
                        <p className="text-center text-sm text-gray-600 mt-3">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          Watch the video to complete this lesson
                        </p>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-2 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Additional Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: FileText, text: 'Download Lesson Notes (PDF)', color: 'text-blue-600' },
                      { icon: FileText, text: 'Practice Exercises', color: 'text-purple-600' },
                      { icon: FileText, text: 'Supplementary Reading', color: 'text-green-600' }
                    ].map((resource, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <Button variant="outline" className="w-full justify-start h-auto py-4 hover:border-blue-400">
                          <resource.icon className={`w-5 h-5 mr-3 ${resource.color}`} />
                          <span>{resource.text}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
