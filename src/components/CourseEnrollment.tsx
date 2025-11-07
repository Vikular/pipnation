import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Check, Lock, ArrowRight, Clock, Users, Award, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PaymentModal } from './PaymentModal';
import { PaymentReceiptUpload } from './PaymentReceiptUpload';
import { NavigationHeader } from './NavigationHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';

interface CourseEnrollmentProps {
  enrolledCourses: string[];
  onEnroll: (courseId: string) => void;
  onBack?: () => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  userId?: string;
  accessToken?: string;
}

export function CourseEnrollment({ enrolledCourses, onEnroll, onBack, userName, userRole, onLogout, userId, accessToken }: CourseEnrollmentProps) {
  console.log('🎓 CourseEnrollment component rendering:', {
    enrolledCourses,
    userName,
    userRole,
    userId,
    hasAccessToken: !!accessToken
  });

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<string[]>([]);

  const courses = [
    {
      id: 'beginners',
      name: 'Beginners Academy',
      price: 50,
      duration: '2 months',
      description: 'Start your forex trading journey with comprehensive foundation training (Payment Required)',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      features: [
        'Complete Forex Fundamentals',
        'Risk Management Essentials',
        'Chart Reading Basics',
        'Technical Analysis Introduction',
        'Practice Trading Strategies',
        'Live Trading Sessions',
        'Community Support',
        'Certificate of Completion'
      ],
      modules: [
        { name: 'Forex Basics', lessons: 12 },
        { name: 'Technical Analysis', lessons: 8 },
        { name: 'Risk Management', lessons: 6 },
        { name: 'Trading Psychology', lessons: 4 }
      ],
      stats: {
        students: '2,450+',
        rating: '4.9/5',
        duration: '30 hours'
      }
    },
    {
      id: 'strategy',
      name: 'Strategy & Mentorship',
      price: 70,
      duration: '2 months',
      description: 'Advanced strategies and 1-on-1 mentorship for serious traders (Payment Required)',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      features: [
        'Advanced Trading Strategies',
        'Personal Mentorship Sessions',
        'Signal Room Access',
        'FTMO Challenge Preparation',
        'Live Market Analysis',
        'Weekly Group Webinars',
        'Trade Review & Feedback',
        'Lifetime Community Access'
      ],
      modules: [
        { name: 'Advanced Strategies', lessons: 15 },
        { name: 'Risk & Money Management', lessons: 10 },
        { name: 'Market Psychology', lessons: 8 },
        { name: 'FTMO Preparation', lessons: 7 }
      ],
      stats: {
        students: '1,230+',
        rating: '5.0/5',
        duration: '45 hours'
      }
    }
  ];

  // Fetch pending payments on mount
  useEffect(() => {
    if (userId && accessToken) {
      fetchPendingPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, accessToken]);

  const fetchPendingPayments = async () => {
    if (!userId || !accessToken) return;
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/api-server/user/${userId}/pending-payments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Extract course IDs from pending payments
        const pending = data.pendingPayments?.map((p: any) => p.courseId) || [];
        setPendingPayments(pending);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const handleEnrollClick = (course: any) => {
    const isEnrolled = enrolledCourses.includes(course.id);
    const isPending = pendingPayments.includes(course.id);
    
    console.log(`🎯 Enroll button clicked for: ${course.name} (${course.id})`);
    console.log(`📊 Enrollment status:`, {
      isEnrolled,
      isPending,
      enrolledCourses,
      pendingPayments,
    });
    
    if (isEnrolled) {
      // If already enrolled, call onEnroll to navigate to course dashboard
      console.log(`✅ User is enrolled! Navigating to course dashboard...`);
      onEnroll(course.id);
    } else if (isPending) {
      // If payment is pending, show info message
      console.log(`⏳ Payment is pending for this course`);
      toast.info(`Your payment for ${course.name} is pending admin approval. You'll get access within 24 hours.`, {
        duration: 5000,
      });
    } else {
      // If not enrolled and no pending payment, open payment modal
      console.log(`💳 Opening payment modal...`);
      setSelectedCourse(course);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = (courseId: string, paymentMethod: string) => {
    // Payment submitted successfully - but it's pending admin approval
    // Add to pending payments list
    setPendingPayments([...pendingPayments, courseId]);
    
    // Don't navigate away, just close the modal
    setPaymentModalOpen(false);
    
    toast.success('Payment submitted! You will receive access once admin approves (within 24 hours).', {
      duration: 6000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      {onBack && (
        <NavigationHeader
          title="Course Enrollment"
          subtitle="Choose your learning path"
          userName={userName}
          userRole={userRole}
          onBack={onBack}
          onHome={onBack}
          onLogout={onLogout}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Learning Path
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Enroll in our comprehensive courses and start your journey to becoming a successful forex trader
          </p>
          <div className="mt-4 md:mt-6 max-w-2xl mx-auto space-y-3">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <Lock className="w-5 h-5 md:w-6 md:h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-gray-800">
                  <strong className="text-orange-700">Payment Required:</strong> All courses require payment before enrollment. 
                  Free trial users must upgrade to access course content and premium community groups.
                </div>
              </div>
            </div>

            {pendingPayments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-3 md:p-4"
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs md:text-sm text-gray-800">
                    <strong className="text-blue-700">Payment Pending:</strong> You have {pendingPayments.length} payment
                    {pendingPayments.length > 1 ? 's' : ''} awaiting admin approval. 
                    You'll receive access within 24 hours once approved.
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {courses.map((course, idx) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const isPending = pendingPayments.includes(course.id);
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`overflow-hidden border-2 h-full flex flex-col ${
                  isEnrolled ? 'border-green-500 bg-green-50/50' : 
                  isPending ? 'border-orange-500 bg-orange-50/50' : 
                  'border-gray-200 hover:border-blue-300'
                } transition-all hover:shadow-xl`}>
                  {/* Course Image */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <ImageWithFallback
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                      <h2 className="text-xl md:text-2xl text-white mb-1">
                        {course.name}
                      </h2>
                      <div className="flex items-center gap-2 text-white/90 text-xs md:text-sm">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{course.stats.duration}</span>
                        <span>•</span>
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{course.stats.students}</span>
                      </div>
                    </div>
                    {isEnrolled && (
                      <Badge className="absolute top-3 right-3 md:top-4 md:right-4 bg-green-500 text-white border-0">
                        <Check className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                    {isPending && !isEnrolled && (
                      <Badge className="absolute top-3 right-3 md:top-4 md:right-4 bg-orange-500 text-white border-0 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Payment Pending
                      </Badge>
                    )}
                  </div>

                  <CardContent className="flex-1 flex flex-col p-4 md:p-6">
                    {/* Price & Rating */}
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${course.price}
                        </span>
                        <span className="text-sm text-gray-600">/ {course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs md:text-sm">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">{course.stats.rating}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 mb-4">
                      {course.description}
                    </p>

                    {/* Modules */}
                    <div className="mb-4">
                      <h4 className="text-xs md:text-sm mb-2"><strong>Course Modules:</strong></h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.modules.map((module, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-700 bg-white p-2 rounded border">
                            <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                            <span className="flex-1 truncate">{module.name}</span>
                            <Badge variant="outline" className="text-xs">{module.lessons}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-xs md:text-sm mb-2"><strong>What's Included:</strong></h4>
                      <div className="space-y-1.5">
                        {course.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      {course.features.length > 4 && (
                        <p className="text-xs text-gray-500 mt-2">
                          + {course.features.length - 4} more features
                        </p>
                      )}
                    </div>

                    {/* Enroll Button */}
                    <div className="mt-auto pt-4">
                      <Button
                        onClick={() => handleEnrollClick(course)}
                        disabled={isPending && !isEnrolled}
                        className={`w-full text-sm md:text-base ${
                          isEnrolled
                            ? 'bg-green-500 hover:bg-green-600'
                            : isPending
                            ? 'bg-orange-500 hover:bg-orange-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Access Course
                          </>
                        ) : isPending ? (
                          <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Payment Pending Approval
                          </>
                        ) : (
                          <>
                            Enroll Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Both Courses Bundle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 md:mt-12"
        >
          <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <Badge className="mb-2 bg-purple-600 text-white border-0">
                    BEST VALUE
                  </Badge>
                  <h3 className="text-xl md:text-2xl mb-2">
                    Complete Trader Bundle
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3">
                    Get both courses and save $20! Perfect for traders who want the complete learning experience.
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl md:text-3xl line-through text-gray-400">$120</span>
                    <span className="text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      $100
                    </span>
                    <span className="text-sm text-gray-600">Save $20!</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  disabled={enrolledCourses.length >= 2}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {enrolledCourses.length >= 2 ? (
                    <>
                      <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Already Enrolled
                    </>
                  ) : (
                    <>
                      Get Bundle
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {selectedCourse && !showReceiptUpload && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          course={selectedCourse}
          userId={userId}
          accessToken={accessToken}
          onPaymentSuccess={handlePaymentSuccess}
          onUploadReceipt={() => {
            setPaymentModalOpen(false);
            setShowReceiptUpload(true);
          }}
        />
      )}

      {/* Receipt Upload */}
      {showReceiptUpload && selectedCourse && userId && accessToken && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="my-8">
            <PaymentReceiptUpload
              courseId={selectedCourse.id}
              courseName={selectedCourse.name}
              amount={selectedCourse.price}
              userId={userId}
              accessToken={accessToken}
              onSuccess={async () => {
                // Refresh pending payments after successful upload
                await fetchPendingPayments();
                setShowReceiptUpload(false);
                setSelectedCourse(null);
                // Show pending status message
                toast.info('⏳ Payment Pending Approval', {
                  description: 'Your payment is being reviewed. You will receive access within 24 hours once approved.',
                  duration: 7000,
                });
              }}
              onCancel={() => {
                setShowReceiptUpload(false);
                setSelectedCourse(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
