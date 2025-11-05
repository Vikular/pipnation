import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Shield, TrendingUp, LogOut, Award, BarChart3, Clock, Target, Sparkles, Eye, Upload, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AdminCourseUpload } from './AdminCourseUpload';
import { AdminStudentsData } from './AdminStudentsData';
import { projectId } from '../utils/supabase/info';

type AdminView = 'dashboard' | 'courses' | 'students';

interface AdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function AdminDashboard({ accessToken, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchUsers();
      fetchPendingSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSubmissions = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/admin/ftmo/pending`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPendingSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleVerifySubmission = async (submissionId: string, approved: boolean) => {
    try {
      const response = await fetch(
        `${apiUrl}/admin/ftmo/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ submissionId, approved }),
        }
      );
      
      if (response.ok) {
        alert(approved ? '✅ User promoted to Pro Trader!' : '❌ Submission rejected');
        fetchPendingSubmissions();
        fetchUsers();
      }
    } catch (error) {
      console.error('Error verifying submission:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/user/${userId}/role`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ newRole }),
        }
      );
      
      if (response.ok) {
        alert('✅ User role updated successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'lead': return 'bg-gray-500';
      case 'student': return 'bg-blue-500';
      case 'pro-trader': return 'bg-green-500';
      case 'funded-trader': return 'bg-yellow-500';
      case 'admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'lead': return '🆓';
      case 'student': return '📚';
      case 'pro-trader': return '🏆';
      case 'funded-trader': return '💰';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  const stats = {
    totalUsers: users.length,
    leads: users.filter(u => u.role === 'lead').length,
    students: users.filter(u => u.role === 'student').length,
    proTraders: users.filter(u => u.role === 'pro-trader').length,
    pendingVerifications: pendingSubmissions.length,
  };

  // Handle different view states AFTER all hooks
  if (currentView === 'courses') {
    return <AdminCourseUpload accessToken={accessToken} onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'students') {
    return <AdminStudentsData accessToken={accessToken} onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-lg border-b sticky top-0 z-40 shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</span>
                <div className="text-xs text-gray-600">Platform Management</div>
              </div>
            </motion.div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('courses')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl">Upload Course Materials</h3>
                  <p className="text-sm text-gray-600">Manage videos and PDFs for all courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('students')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl">Student Database</h3>
                  <p className="text-sm text-gray-600">View all student data and export reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
            { label: 'Leads', value: stats.leads, icon: Target, color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100' },
            { label: 'Students', value: stats.students, icon: Award, color: 'from-blue-500 to-purple-600', bgColor: 'from-blue-50 to-purple-100' },
            { label: 'Pro Traders', value: stats.proTraders, icon: TrendingUp, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
            { label: 'Pending', value: stats.pendingVerifications, icon: Clock, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className={`border-2 hover:border-${stat.color.split('-')[1]}-400 transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${stat.bgColor}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-gray-600">{stat.label}</CardTitle>
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Alert for Pending Submissions */}
        {stats.pendingVerifications > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8"
          >
            <Card className="border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-lg">
                      <strong>{stats.pendingVerifications}</strong> FTMO submission{stats.pendingVerifications > 1 ? 's' : ''} awaiting verification
                    </p>
                    <p className="text-sm text-gray-600">Review pending submissions to approve or reject trader applications</p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700"
                    onClick={() => document.querySelector('[value="verifications"]')?.scrollIntoView()}
                  >
                    Review Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="verifications" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              FTMO Verifications ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Pending FTMO Verifications</CardTitle>
                      <CardDescription className="text-base">
                        Review and verify FTMO challenge submissions from students
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {pendingSubmissions.length === 0 ? (
                    <div className="text-center py-16">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-600 opacity-50" />
                      </motion.div>
                      <p className="text-xl text-gray-500">No pending verifications</p>
                      <p className="text-sm text-gray-400 mt-2">All submissions have been reviewed</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingSubmissions.map((submission, idx) => {
                        const user = users.find(u => u.userId === submission.userId);
                        return (
                          <motion.div
                            key={submission.submissionId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 4 }}
                          >
                            <Card className="border-2 hover:border-green-400 transition-all bg-gradient-to-r from-white to-green-50">
                              <CardContent className="pt-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-start gap-4">
                                      <Avatar className="w-14 h-14 border-2 border-green-500">
                                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-lg">
                                          {user?.firstName?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className="text-lg">{user?.firstName || 'Unknown'}</div>
                                          <Badge variant="outline">{user?.country}</Badge>
                                        </div>
                                        <div className="text-sm text-gray-600">{user?.email}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Clock className="w-4 h-4 text-gray-400" />
                                          <span className="text-xs text-gray-600">
                                            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                      <div className="text-sm text-gray-600 mb-1">Proof URL:</div>
                                      <a 
                                        href={submission.proofUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all flex items-center gap-2"
                                      >
                                        <Eye className="w-4 h-4 flex-shrink-0" />
                                        {submission.proofUrl}
                                      </a>
                                    </div>

                                    {submission.notes && (
                                      <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                        <div className="text-sm text-gray-600 mb-1">Notes:</div>
                                        <div className="text-sm">{submission.notes}</div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-3 lg:w-48">
                                    <Button
                                      onClick={() => handleVerifySubmission(submission.submissionId, true)}
                                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12"
                                    >
                                      <CheckCircle className="w-5 h-5 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleVerifySubmission(submission.submissionId, false)}
                                      variant="destructive"
                                      className="h-12"
                                    >
                                      <XCircle className="w-5 h-5 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">All Users</CardTitle>
                      <CardDescription className="text-base">
                        Manage user accounts, roles, and progress
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="text-center py-16">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-600">Loading users...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.map((user, idx) => (
                        <motion.div
                          key={user.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center justify-between p-5 border-2 rounded-xl hover:border-blue-400 transition-all bg-gradient-to-r from-white to-blue-50 gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <Avatar className="w-12 h-12 border-2">
                                <AvatarFallback className={`${getRoleBadgeColor(user.role)} text-white`}>
                                  <span className="text-xl">{getRoleIcon(user.role)}</span>
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                  <span className="font-medium">{user.firstName}</span>
                                  <Badge className={`${getRoleBadgeColor(user.role)} text-white border-0`}>
                                    {user.role}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600 truncate">{user.email}</div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                  <span>📅 {new Date(user.createdAt).toLocaleDateString()}</span>
                                  <span className="hidden sm:inline">📚 Foundation: {user.progress?.foundation?.completed}/{user.progress?.foundation?.total}</span>
                                  {user.advancedUnlocked && (
                                    <span className="hidden md:inline">⚡ Advanced: {user.progress?.advanced?.completed}/{user.progress?.advanced?.total}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                              <Select
                                value={user.role}
                                onValueChange={(newRole) => handleRoleChange(user.userId, newRole)}
                              >
                                <SelectTrigger className="w-[140px] sm:w-[160px] border-2 hover:border-blue-400">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lead">🆓 Lead</SelectItem>
                                  <SelectItem value="student">📚 Student</SelectItem>
                                  <SelectItem value="pro-trader">🏆 Pro Trader</SelectItem>
                                  <SelectItem value="funded-trader">💰 Funded</SelectItem>
                                  <SelectItem value="admin">👑 Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
