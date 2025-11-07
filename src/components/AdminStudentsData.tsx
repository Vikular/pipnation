import { useState, useEffect } from 'react';
import { Users, Download, Search, Filter, ArrowLeft, Award, DollarSign, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';

interface StudentData {
  userId: string;
  email: string;
  firstName: string;
  country: string;
  role: string;
  badge: string;
  createdAt: string;
  enrolledCourses: string[];
  coursesCompleted: string[];
  paymentHistory: any[];
  signupData: any;
  totalProgress: {
    beginners: { completed: number; total: number };
    strategy: { completed: number; total: number };
  };
}

interface AdminStudentsDataProps {
  accessToken: string;
  onBack: () => void;
}

export function AdminStudentsData({ accessToken, onBack }: AdminStudentsDataProps) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all');

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;

  useEffect(() => {
    loadStudentsData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, roleFilter, badgeFilter, students]);

  const loadStudentsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/students/data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } else {
        toast.error('Failed to load students data');
      }
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((s) => s.role === roleFilter);
    }

    // Badge filter
    if (badgeFilter !== 'all') {
      filtered = filtered.filter((s) => s.badge === badgeFilter);
    }

    setFilteredStudents(filtered);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'free-trial':
        return 'bg-gray-100 text-gray-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'pro-trader':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalRevenue = () => {
    return students.reduce((total, student) => {
      const studentTotal = student.paymentHistory?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      return total + studentTotal;
    }, 0);
  };

  const exportToCSV = () => {
    const headers = [
      'Email',
      'Name',
      'Country',
      'Role',
      'Badge',
      'Enrolled Courses',
      'Completed Courses',
      'Total Paid',
      'Trading Experience',
      'Phone',
      'WhatsApp',
      'Joined Date',
    ];

    const rows = filteredStudents.map((student) => [
      student.email,
      student.firstName,
      student.country,
      student.role,
      student.badge,
      student.enrolledCourses.join(', '),
      student.coursesCompleted.join(', '),
      student.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0,
      student.signupData?.tradingExperience || '',
      student.signupData?.phoneNumber || '',
      student.signupData?.whatsappNumber || '',
      new Date(student.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `students_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl">Student Database</h1>
              <p className="text-gray-600">View and manage all student information</p>
            </div>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl">${getTotalRevenue()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Paid Students</p>
                  <p className="text-2xl">
                    {students.filter((s) => s.role !== 'lead').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pro Traders</p>
                  <p className="text-2xl">
                    {students.filter((s) => s.role === 'pro-trader').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or country..."
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

              <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Badges</SelectItem>
                  <SelectItem value="free-trial">Free Trial</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="pro-trader">Pro Trader</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Students ({filteredStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Total Paid</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.userId}>
                        <TableCell className="font-mono text-sm">
                          {student.email}
                        </TableCell>
                        <TableCell>{student.firstName}</TableCell>
                        <TableCell>{student.country}</TableCell>
                        <TableCell>
                          <Badge className={getBadgeColor(student.badge)}>
                            {student.badge}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {student.enrolledCourses.length > 0
                            ? student.enrolledCourses.join(', ')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          ${student.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
