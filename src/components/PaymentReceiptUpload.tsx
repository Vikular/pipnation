import { useState } from 'react';
import { Upload, FileText, Image, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PaymentReceiptUploadProps {
  courseId: string;
  courseName: string;
  amount: number;
  userId: string;
  accessToken: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentReceiptUpload({
  courseId,
  courseName,
  amount,
  userId,
  accessToken,
  onSuccess,
  onCancel,
}: PaymentReceiptUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;

  const acceptedFormats = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileType = file.type;
    const validTypes = Object.keys(acceptedFormats);
    
    if (!validTypes.includes(fileType)) {
      toast.error('Invalid file type. Please upload PNG, JPEG, or PDF only.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (fileType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(''); // PDF doesn't need preview
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a receipt file to upload');
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        // Submit payment receipt
        const response = await fetch(`${apiUrl}/payment/submit-receipt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId,
            courseId,
            amount,
            receiptData: base64Data,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            notes: notes.trim() || 'Payment via bank transfer/PayPal',
          }),
        });

        if (response.ok) {
          const result = await response.json();
          toast.success('Payment receipt submitted successfully!', {
            description: 'Your payment will be verified within 24 hours.',
            duration: 5000,
          });
          onSuccess();
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to submit receipt');
        }
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error('Failed to upload receipt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Payment Receipt</CardTitle>
        <CardDescription>
          Submit your payment proof for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Payment Details</span>
          </div>
          <div className="space-y-1 text-sm">
            <p><strong>Course:</strong> {courseName}</p>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Payment ID:</strong> #{Date.now().toString().slice(-8)}</p>
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Processing Time: 24 Hours</span>
          </div>
          <p className="text-sm text-yellow-700">
            After submitting your receipt, our team will verify your payment within 24 hours. 
            You'll receive a notification once approved.
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label>Upload Receipt (PNG, JPEG, or PDF)</Label>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPEG or PDF (max 5MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Ready to upload
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Information (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional details about your payment (e.g., transaction ID, payment method, reference number)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Include transaction ID or reference number if available
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">Important:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Ensure the receipt clearly shows the payment amount and date</li>
                <li>Receipt must be readable and not blurry</li>
                <li>Invalid or unclear receipts will be rejected</li>
                <li>You'll be notified via email once verified</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className="flex-1 gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit Receipt
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={uploading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
