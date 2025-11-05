import { useState, useEffect } from 'react';
import { Upload, Video, FileText, Trash2, ArrowLeft, Plus, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CourseMaterial {
  materialId: string;
  courseId: string;
  lessonId: string;
  materialType: 'video' | 'pdf';
  title: string;
  description: string;
  url: string;
  order: number;
  uploadedAt: string;
}

interface AdminCourseUploadProps {
  accessToken: string;
  onBack: () => void;
}

export function AdminCourseUpload({ accessToken, onBack }: AdminCourseUploadProps) {
  const [courseId, setCourseId] = useState('beginners');
  const [lessonId, setLessonId] = useState('');
  const [materialType, setMaterialType] = useState<'video' | 'pdf'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState('0');
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;

  useEffect(() => {
    if (courseId) {
      loadCourseMaterials();
    }
  }, [courseId]);

  const loadCourseMaterials = async () => {
    try {
      const response = await fetch(`${apiUrl}/course/${courseId}/materials`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const handleUpload = async () => {
    if (!lessonId || !title || !url) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/admin/course/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          materialType,
          title,
          description,
          url,
          order: parseInt(order) || 0,
        }),
      });

      if (response.ok) {
        toast.success('Course material uploaded successfully!');
        // Reset form
        setLessonId('');
        setTitle('');
        setDescription('');
        setUrl('');
        setOrder('0');
        // Reload materials
        await loadCourseMaterials();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload material');
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/course/material/${materialId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        toast.success('Material deleted successfully');
        await loadCourseMaterials();
      } else {
        toast.error('Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl">Course Material Management</h1>
              <p className="text-gray-600">Upload and manage videos and PDFs for your courses</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Material
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginners">Beginners Academy</SelectItem>
                    <SelectItem value="strategy">Strategy & Mentorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lesson ID */}
              <div className="space-y-2">
                <Label htmlFor="lessonId">Lesson ID *</Label>
                <Input
                  id="lessonId"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  placeholder="e.g., lesson-1, module-1-intro"
                />
              </div>

              {/* Material Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Material Type *</Label>
                <Select value={materialType} onValueChange={(v) => setMaterialType(v as 'video' | 'pdf')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        PDF Document
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Forex Trading"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the material..."
                  rows={3}
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">
                  {materialType === 'video' ? 'Video URL' : 'PDF URL'} *
                </Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    materialType === 'video'
                      ? 'https://youtube.com/watch?v=...'
                      : 'https://your-domain.com/file.pdf'
                  }
                />
                <p className="text-xs text-gray-500">
                  {materialType === 'video'
                    ? 'Supports YouTube, Vimeo, or direct video URLs'
                    : 'Direct link to PDF file'}
                </p>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Lower numbers appear first</p>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Upload Material
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Materials List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {courseId === 'beginners' ? 'Beginners Academy' : 'Strategy & Mentorship'} Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {materials.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No materials uploaded yet</p>
                  </div>
                ) : (
                  materials.map((material) => (
                    <motion.div
                      key={material.materialId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {material.materialType === 'video' ? (
                              <Video className="w-4 h-4 text-blue-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-xs text-gray-500">
                              {material.lessonId}
                            </span>
                          </div>
                          <h4 className="mb-1">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {material.description}
                            </p>
                          )}
                          <a
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {material.url}
                          </a>
                          <p className="text-xs text-gray-400 mt-2">
                            Order: {material.order} • Uploaded:{' '}
                            {new Date(material.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(material.materialId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
