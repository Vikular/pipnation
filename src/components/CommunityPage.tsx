import { useState } from 'react';
import { MessageCircle, Send, Lock, Check, Users, TrendingUp, Award, BookOpen, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { NavigationHeader } from './NavigationHeader';
import { SocialLinks } from './SocialLinks';
import { toast } from 'sonner@2.0.3';

interface CommunityPageProps {
  userRole: string;
  enrolledCourses: string[];
  coursesCompleted: string[];
  onBack?: () => void;
  userName?: string;
  onLogout?: () => void;
}

export function CommunityPage({ userRole, enrolledCourses, coursesCompleted, onBack, userName, onLogout }: CommunityPageProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleJoinGroup = (groupName: string, link: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(link);
    setCopiedLink(groupName);
    setTimeout(() => setCopiedLink(null), 2000);
    
    toast.success(`Copied ${groupName} link!`, {
      description: 'Opening in new tab...'
    });
    
    // Open link
    window.open(link, '_blank');
  };

  const groups = [
    {
      id: 'general-channel',
      name: 'General Community Channel',
      platform: 'Telegram',
      description: 'Stay updated with announcements, market news, and community updates',
      icon: Send,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      members: '5,240+',
      link: 'https://t.me/eliteforexacademy_general',
      requirements: 'Free for everyone',
      access: 'public'
    },
    {
      id: 'learning',
      name: 'Learning & Discussion Group',
      platform: 'Telegram',
      description: 'Discuss lessons, share insights, and learn together with fellow students (PAID ENROLLMENT REQUIRED)',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      members: '2,430+',
      link: 'https://t.me/eliteforexacademy_learning',
      requirements: 'Payment required - Must enroll in any course',
      access: 'paid',
      requiredCourses: ['beginners', 'strategy']
    },
    {
      id: 'signals',
      name: 'Signal Room',
      platform: 'Telegram',
      description: 'Real-time trading signals, market analysis, and trade setups from our experts - Currently on hold till further notice',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100',
      members: '980+',
      link: 'https://t.me/eliteforexacademy_signals',
      requirements: 'Till further notice',
      access: 'locked',
      requiredCompletion: ['strategy']
    },
    {
      id: 'mentorship',
      name: 'Mentorship Group',
      platform: 'WhatsApp',
      description: 'Weekly sessions, Q&A, portfolio reviews, and direct mentor support (PAID + COMPLETION)',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      members: '450+',
      link: 'https://chat.whatsapp.com/mentorship456',
      requirements: 'Payment + Complete Strategy course (100%)',
      access: 'completed',
      requiredCompletion: ['strategy']
    },
    {
      id: 'ftmo',
      name: 'FTMO Challenge Group',
      platform: 'Telegram',
      description: 'Support group for traders taking FTMO challenges, share progress and strategies (PAID + COMPLETION)',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      members: '320+',
      link: 'https://t.me/eliteforexacademy_ftmo',
      requirements: 'Payment + Complete BOTH courses (100%)',
      access: 'completed',
      requiredCompletion: ['beginners', 'strategy']
    }
  ];

  const canAccessGroup = (group: any) => {
    if (group.access === 'public') return true;
    if (group.access === 'free') return true;
    if (group.access === 'locked') return false; // Locked till further notice
    
    // Free trial users (leads) can only access public groups
    if (userRole === 'lead') {
      return group.access === 'public' || group.access === 'free';
    }
    
    if (group.access === 'paid') {
      return group.requiredCourses?.some((course: string) => enrolledCourses.includes(course));
    }
    if (group.access === 'completed') {
      return group.requiredCompletion?.every((course: string) => coursesCompleted.includes(course));
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      {onBack && (
        <NavigationHeader
          title="Community Groups"
          subtitle="Connect with traders worldwide"
          userName={userName}
          userRole={userRole}
          onBack={onBack}
          onHome={onBack}
          onLogout={onLogout}
        />
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Trading Community
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Connect with thousands of traders, get signals, share insights, and grow together
          </p>
        </motion.div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="mb-6 md:mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <Users className="w-4 h-4" />
            <AlertDescription className="text-sm md:text-base">
              <strong>Community Guidelines:</strong> Be respectful, share knowledge, and help each other grow. 
              Premium groups require course enrollment or completion.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {groups.map((group, idx) => {
            const hasAccess = canAccessGroup(group);
            const Icon = group.icon;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`border-2 h-full flex flex-col ${
                  hasAccess ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg' : 'border-gray-200 bg-gray-50/50'
                } transition-all relative overflow-hidden`}>
                  {/* Gradient Header */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${group.color}`} />
                  
                  {!hasAccess && (
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700 border-0">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    </div>
                  )}

                  <CardContent className="flex-1 flex flex-col p-4 md:p-6 pt-5 md:pt-7">
                    {/* Icon */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${group.color} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    {/* Group Info */}
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl mb-1 md:mb-2">
                        {group.name}
                      </h3>
                      <Badge variant="outline" className="mb-2 md:mb-3 text-xs">
                        {group.platform}
                      </Badge>
                      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                        {group.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{group.members}</span>
                        </div>
                      </div>

                      <Separator className="mb-3 md:mb-4" />

                      {/* Requirements */}
                      <div className={`text-xs md:text-sm p-2 md:p-3 rounded-lg ${
                        hasAccess ? `bg-gradient-to-br ${group.bgColor}` : 'bg-gray-100'
                      }`}>
                        {hasAccess ? (
                          <div className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-green-700">Access Granted</strong>
                              <p className="text-gray-600 mt-0.5">{group.requirements}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-gray-700">Locked</strong>
                              <p className="text-gray-600 mt-0.5">{group.requirements}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Join Button */}
                    <Button
                      onClick={() => handleJoinGroup(group.name, group.link)}
                      disabled={!hasAccess}
                      className={`w-full mt-4 text-sm md:text-base ${
                        hasAccess
                          ? `bg-gradient-to-r ${group.color} hover:opacity-90`
                          : 'bg-gray-300'
                      }`}
                    >
                      {copiedLink === group.name ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied Link!
                        </>
                      ) : hasAccess ? (
                        <>
                          Join {group.platform}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Requirements
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 md:mt-12"
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl mb-3 md:mb-4">
                🤔 How to Join Groups
              </h3>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <p>Click the "Join" button on any group you have access to</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <p>The invite link will be copied and opened in a new tab</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <p>Complete courses to unlock premium groups like Signal Room and Mentorship</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">4</span>
                  <p>Join the General Channel for free to stay updated with community news</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <SocialLinks userRole={userRole} variant="full" />
        </motion.div>
      </div>
    </div>
  );
}
