import { useState, useEffect } from 'react';
import Users from 'lucide-react/dist/esm/icons/users';
import Activity from 'lucide-react/dist/esm/icons/activity';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Settings from 'lucide-react/dist/esm/icons/settings';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Unlock from 'lucide-react/dist/esm/icons/unlock';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Download from 'lucide-react/dist/esm/icons/download';
import Search from 'lucide-react/dist/esm/icons/search';
import Filter from 'lucide-react/dist/esm/icons/filter';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Database from 'lucide-react/dist/esm/icons/database';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Crown from 'lucide-react/dist/esm/icons/crown';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import Award from 'lucide-react/dist/esm/icons/award';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';
import { AdminCourseUpload } from './AdminCourseUpload';
import { PendingPaymentsTab } from './PendingPaymentsTab';

interface EnhancedAdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function EnhancedAdminDashboard({ accessToken, onLogout }: EnhancedAdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [liveActivity, setLiveActivity] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showGrantCourseDialog, setShowGrantCourseDialog] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [bulkSelectedUsers, setBulkSelectedUsers] = useState<string[]>([]);
  const [upgradeUserId, setUpgradeUserId] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState('student');
  const [selectedBadge, setSelectedBadge] = useState('beginner');
  const [grantCourseUserId, setGrantCourseUserId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState('beginners');

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;

  useEffect(() => {
    if (currentTab === 'overview') {
      loadOverviewData();
    } else if (currentTab === 'users') {
      loadUsers();
    } else if (currentTab === 'activity') {
      loadLiveActivity();
    } else if (currentTab === 'analytics') {
      loadAnalytics();
    }
  }, [currentTab]);

  const loadOverviewData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadUsers(), loadAnalytics(), loadLiveActivity()]);
    } catch (error) {
      console.error('Error loading overview:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/analytics`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadLiveActivity = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/activity/live`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLiveActivity(data);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  };

  const viewUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`${apiUrl}/admin/user/${userId}/full`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        setShowUserDialog(true);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
      toast.error('Failed to load user details');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    
    try {
      const response = await fetch(`${apiUrl}/admin/user/${userId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: newStatus,
          reason: newStatus === 'suspended' ? 'Admin action' : 'Reactivated',
        }),
      });

      if (response.ok) {
        toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
        loadUsers();
      } else {
        toast.error('Failed to change user status');
      }
    } catch (error) {
      console.error('Error changing user status:', error);
      toast.error('Error changing user status');
    }
  };

  const sendBroadcast = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: broadcastMessage,
          targetRole: roleFilter === 'all' ? null : roleFilter,
          targetUsers: bulkSelectedUsers.length > 0 ? bulkSelectedUsers : null,
        }),
      });

      if (response.ok) {
        toast.success('Broadcast sent successfully!');
        setBroadcastMessage('');
        setShowBroadcastDialog(false);
      } else {
        toast.error('Failed to send broadcast');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Error sending broadcast');
    }
  };

  const manualPaymentVerification = async (userId: string, courseId: string, amount: number) => {
    try {
      const response = await fetch(`${apiUrl}/admin/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId,
          courseId,
          amount,
          notes: 'Manual verification by admin',
        }),
      });

      if (response.ok) {
        toast.success('Payment verified and user enrolled!');
        setShowPaymentDialog(false);
        loadUsers();
      } else {
        toast.error('Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment');
    }
  };

  const upgradeUserLevel = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/user/${upgradeUserId}/upgrade-level`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          level: selectedLevel,
          badge: selectedBadge,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`User upgraded to ${selectedLevel} with ${selectedBadge} badge!`);
        setShowUpgradeDialog(false);
        loadUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upgrade user level');
      }
    } catch (error) {
      console.error('Error upgrading user level:', error);
      toast.error('Error upgrading user level');
    }
  };

  const grantCourseAccess = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/user/${grantCourseUserId}/grant-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          reason: 'Payment confirmed by admin',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `Course access granted!`);
        setShowGrantCourseDialog(false);
        loadUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to grant course access');
      }
    } catch (error) {
      console.error('Error granting course access:', error);
      toast.error('Error granting course access');
    }
  };

  const revokeCourseAccess = async (userId: string, courseId: string) => {
    if (!confirm(`Are you sure you want to revoke ${courseId} access for this user?`)) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/user/${userId}/revoke-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          courseId,
          reason: 'Revoked by admin',
        }),
      });

      if (response.ok) {
        toast.success('Course access revoked!');
        loadUsers();
        if (selectedUser?.userId === userId) {
          viewUserDetails(userId); // Refresh the dialog
        }
      } else {
        toast.error('Failed to revoke course access');
      }
    } catch (error) {
      console.error('Error revoking course access:', error);
      toast.error('Error revoking course access');
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    const confirmMessage = `⚠️ WARNING: This will permanently delete the user "${userEmail}" and all associated data including:\n\n• User profile\n• Payment history\n• Sessions\n• Course progress\n• Payment receipts\n\nThis action CANNOT be undone.\n\nType "DELETE" to confirm:`;
    
    const confirmation = prompt(confirmMessage);
    
    if (confirmation !== 'DELETE') {
      if (confirmation !== null) {
        toast.error('Deletion cancelled. You must type "DELETE" to confirm.');
      }
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'User deleted successfully');
        loadUsers();
        if (showUserDialog && selectedUser?.userId === userId) {
          setShowUserDialog(false);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const exportData = () => {
    const headers = ['Email', 'Name', 'Country', 'Role', 'Status', 'Joined', 'Revenue'];
    const rows = filteredUsers.map(u => [
      u.email,
      u.firstName,
      u.country,
      u.role,
      u.accountStatus || 'active',
      new Date(u.createdAt).toLocaleDateString(),
      u.paymentHistory?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Data exported successfully!');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleBulkSelect = (userId: string) => {
    setBulkSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (currentTab === 'courses') {
    return <AdminCourseUpload accessToken={accessToken} onBack={() => setCurrentTab('overview')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-lg border-b sticky top-0 z-40 shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-600" />
              <div>
                <h1 className="text-2xl">Admin Command Center</h1>
                <p className="text-sm text-gray-600">Comprehensive Platform Control</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadOverviewData}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              
              <Button variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <Clock className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" />
              Live Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <Upload className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="communications" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Broadcast
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Users</p>
                      <h3 className="text-3xl mt-2">{users.length}</h3>
                      <p className="text-xs mt-1 opacity-75">
                        +{liveActivity?.totalActive || 0} active now
                      </p>
                    </div>
                    <Users className="w-12 h-12 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Revenue</p>
                      <h3 className="text-3xl mt-2">${analytics?.totalRevenue || 0}</h3>
                      <p className="text-xs mt-1 opacity-75">
                        ${analytics?.averageRevenuePerUser?.toFixed(2) || 0} per user
                      </p>
                    </div>
                    <DollarSign className="w-12 h-12 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Conversion Rate</p>
                      <h3 className="text-3xl mt-2">{analytics?.conversionRate?.toFixed(1) || 0}%</h3>
                      <p className="text-xs mt-1 opacity-75">
                        Lead to Student
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Active Sessions</p>
                      <h3 className="text-3xl mt-2">{liveActivity?.totalActive || 0}</h3>
                      <p className="text-xs mt-1 opacity-75">
                        Live users online
                      </p>
                    </div>
                    <Activity className="w-12 h-12 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 h-auto py-4" variant="outline">
                        <MessageSquare className="w-5 h-5" />
                        <div className="text-left">
                          <div className="text-sm">Send Broadcast</div>
                          <div className="text-xs text-gray-500">Message all users</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Broadcast Message</DialogTitle>
                        <DialogDescription>
                          Send a message to all users or specific groups
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Enter your message..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          rows={5}
                        />
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Target audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="student">Students Only</SelectItem>
                            <SelectItem value="lead">Leads Only</SelectItem>
                            <SelectItem value="pro-trader">Pro Traders Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={sendBroadcast} className="w-full">
                          Send Broadcast
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={exportData}
                    className="gap-2 h-auto py-4"
                    variant="outline"
                  >
                    <Download className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-sm">Export Data</div>
                      <div className="text-xs text-gray-500">Download CSV</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setCurrentTab('courses')}
                    className="gap-2 h-auto py-4"
                    variant="outline"
                  >
                    <Upload className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-sm">Upload Course</div>
                      <div className="text-xs text-gray-500">Add materials</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setCurrentTab('users')}
                    className="gap-2 h-auto py-4"
                    variant="outline"
                  >
                    <Database className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-sm">User Database</div>
                      <div className="text-xs text-gray-500">Manage users</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Latest logins and signups</CardDescription>
              </CardHeader>
              <CardContent>
                {liveActivity?.recentLogins?.slice(0, 5).map((session: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {session.userId?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{session.userId}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.loginTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={session.logoutTime ? 'secondary' : 'default'}>
                      {session.logoutTime ? 'Offline' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage all platform users ({filteredUsers.length} users)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {bulkSelectedUsers.length > 0 && (
                      <Badge variant="secondary">
                        {bulkSelectedUsers.length} selected
                      </Badge>
                    )}
                    <Button onClick={exportData} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="lead">Leads</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="pro-trader">Pro Traders</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkSelectedUsers(filteredUsers.map(u => u.userId));
                              } else {
                                setBulkSelectedUsers([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={bulkSelectedUsers.includes(user.userId)}
                              onChange={() => toggleBulkSelect(user.userId)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{user.firstName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              {user.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.accountStatus === 'suspended' ? 'destructive' : 'default'
                              }
                            >
                              {user.accountStatus || 'active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${user.paymentHistory?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => viewUserDetails(user.userId)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setUpgradeUserId(user.userId);
                                  setSelectedLevel(user.role);
                                  setSelectedBadge(user.badge);
                                  setShowUpgradeDialog(true);
                                }}
                                title="Upgrade Level"
                              >
                                <Award className="w-4 h-4 text-purple-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setGrantCourseUserId(user.userId);
                                  setShowGrantCourseDialog(true);
                                }}
                                title="Grant Course Access"
                              >
                                <BookOpen className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleUserStatus(user.userId, user.accountStatus)}
                                title={user.accountStatus === 'suspended' ? 'Activate' : 'Suspend'}
                              >
                                {user.accountStatus === 'suspended' ? (
                                  <Unlock className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Lock className="w-4 h-4 text-red-600" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteUser(user.userId, user.email)}
                                title="Delete User"
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Payments Tab */}
          <TabsContent value="payments">
            <PendingPaymentsTab accessToken={accessToken} />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live User Activity</CardTitle>
                  <CardDescription>Real-time user sessions and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <div>
                          <p className="text-sm">Active Users</p>
                          <p className="text-2xl">{liveActivity?.totalActive || 0}</p>
                        </div>
                      </div>
                      <Activity className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="space-y-2">
                      {liveActivity?.activeSessions?.map((session: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="text-sm">{session.userId}</p>
                            <p className="text-xs text-gray-500">
                              Logged in {new Date(session.loginTime).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Comprehensive insights and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Users by Role */}
                    <div>
                      <h4 className="text-sm mb-4">Users by Role</h4>
                      <div className="space-y-3">
                        {Object.entries(analytics?.usersByRole || {}).map(([role, count]: any) => (
                          <div key={role} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{role}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600"
                                  style={{ width: `${(count / users.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm w-12 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Users by Country */}
                    <div>
                      <h4 className="text-sm mb-4">Top Countries</h4>
                      <div className="space-y-3">
                        {Object.entries(analytics?.usersByCountry || {})
                          .sort((a: any, b: any) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([country, count]: any) => (
                            <div key={country} className="flex items-center justify-between">
                              <span className="text-sm">{country}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-600"
                                    style={{ width: `${(count / users.length) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm w-12 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-3xl mt-2">${analytics?.totalRevenue || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Avg Revenue/User</p>
                      <p className="text-3xl mt-2">
                        ${analytics?.averageRevenuePerUser?.toFixed(2) || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-3xl mt-2">
                        {analytics?.conversionRate?.toFixed(1) || 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle>Broadcast Communications</CardTitle>
                <CardDescription>Send messages to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your broadcast message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={6}
                  />
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="student">Students Only</SelectItem>
                      <SelectItem value="lead">Leads Only</SelectItem>
                      <SelectItem value="pro-trader">Pro Traders Only</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={sendBroadcast} className="w-full gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Broadcast to {roleFilter === 'all' ? 'All Users' : `${roleFilter}s`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile Details</DialogTitle>
            <DialogDescription>Complete user information and activity</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-sm">{selectedUser.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="text-sm">{selectedUser.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-sm capitalize">{selectedUser.role}</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setGrantCourseUserId(selectedUser.userId);
                      setShowGrantCourseDialog(true);
                    }}
                    className="gap-2"
                  >
                    <BookOpen className="w-3 h-3" />
                    Grant Access
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.enrolledCourses?.length > 0 ? (
                    selectedUser.enrolledCourses.map((course: string) => (
                      <div key={course} className="flex items-center gap-1">
                        <Badge>{course}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => revokeCourseAccess(selectedUser.userId, course)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No courses enrolled</p>
                  )}
                </div>
              </div>

              {/* Payment History */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Payment History</p>
                <div className="space-y-2">
                  {selectedUser.paymentHistory?.map((payment: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{payment.courseId}</span>
                      <span className="text-sm">${payment.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Recent Activity</p>
                <div className="space-y-2">
                  {selectedUser.sessions?.map((session: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                      <span>{new Date(session.loginTime).toLocaleString()}</span>
                      <Badge variant={session.logoutTime ? 'secondary' : 'default'}>
                        {session.logoutTime ? 'Ended' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Danger Zone</p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowUserDialog(false);
                    deleteUser(selectedUser.userId, selectedUser.email);
                  }}
                  className="w-full gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User Permanently
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade Level Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade User Level & Badge</DialogTitle>
            <DialogDescription>
              Change the user's role and badge status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">User Level (Role)</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead (Free Trial)</SelectItem>
                  <SelectItem value="student">Student (Paid)</SelectItem>
                  <SelectItem value="pro-trader">Pro Trader (FTMO Verified)</SelectItem>
                  <SelectItem value="funded-trader">Funded Trader</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm mb-2 block">Badge</label>
              <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free-trial">Free Trial</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="pro-trader">Pro Trader</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Upgrading to 'student' or higher grants them paid user privileges. 
                Pro Trader status should only be given after FTMO verification.
              </p>
            </div>

            <Button onClick={upgradeUserLevel} className="w-full gap-2">
              <Award className="w-4 h-4" />
              Upgrade User Level
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grant Course Access Dialog */}
      <Dialog open={showGrantCourseDialog} onOpenChange={setShowGrantCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Course Access</DialogTitle>
            <DialogDescription>
              Manually enroll user in a paid course after payment confirmation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Select Course / Community Access</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free-trial">Free Trial Community (No Payment)</SelectItem>
                  <SelectItem value="beginners">Beginners Academy ($50)</SelectItem>
                  <SelectItem value="strategy">Strategy & Mentorship ($70)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-green-50 p-3 rounded-lg space-y-2">
              <p className="text-xs text-green-800">
                <strong>What happens when you grant access:</strong>
              </p>
              <ul className="text-xs text-green-700 list-disc list-inside space-y-1">
                <li>User gets immediate access to all course materials</li>
                <li>If user is a 'lead', they'll be upgraded to 'student'</li>
                <li>Action will be logged in their course access history</li>
                <li>User can start learning immediately</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Remember:</strong> Only grant access after confirming payment via bank transfer, 
                PayPal, or other payment method.
              </p>
            </div>

            <Button onClick={grantCourseAccess} className="w-full gap-2">
              <BookOpen className="w-4 h-4" />
              Grant Course Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
