import { useState, useEffect } from 'react';
import { Clock, Check, X, Eye, Download, FileText, Image as ImageIcon, RefreshCw, CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PendingPayment {
  paymentId: string;
  userId: string;
  courseId: string;
  amount: number;
  status: string;
  receiptPath: string;
  fileName: string;
  fileType: string;
  notes: string;
  submittedAt: string;
  expiresAt: string;
  userEmail?: string;
  userName?: string;
  userCountry?: string;
}

interface PendingPaymentsTabProps {
  accessToken: string;
}

export function PendingPaymentsTab({ accessToken }: PendingPaymentsTabProps) {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0991178c`;

  const loadPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/pending-payments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingPayments(data.pendingPayments || []);
      } else {
        toast.error('Failed to load pending payments');
      }
    } catch (error) {
      console.error('Error loading pending payments:', error);
      toast.error('Error loading pending payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPayments();
  }, [accessToken]);

  const viewReceipt = async (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setProcessing(true);

    try {
      const response = await fetch(`${apiUrl}/admin/receipt/${payment.paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReceiptUrl(data.receiptUrl);
        setShowReceiptModal(true);
      } else {
        toast.error('Failed to load receipt');
      }
    } catch (error) {
      console.error('Error loading receipt:', error);
      toast.error('Error loading receipt');
    } finally {
      setProcessing(false);
    }
  };

  const approvePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to approve this payment? The user will get immediate course access.')) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`${apiUrl}/admin/payment/approve-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ paymentId }),
      });

      if (response.ok) {
        toast.success('Payment approved! User has been granted course access.');
        setShowReceiptModal(false);
        loadPendingPayments();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Error approving payment');
    } finally {
      setProcessing(false);
    }
  };

  const rejectPayment = async () => {
    if (!selectedPayment) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`${apiUrl}/admin/payment/reject-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          paymentId: selectedPayment.paymentId,
          reason: rejectionReason,
        }),
      });

      if (response.ok) {
        toast.success('Payment rejected. User will be notified.');
        setShowRejectModal(false);
        setShowReceiptModal(false);
        setRejectionReason('');
        loadPendingPayments();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Error rejecting payment');
    } finally {
      setProcessing(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const getCourseDisplay = (courseId: string) => {
    const courses: Record<string, { name: string; price: number }> = {
      beginners: { name: 'Beginners Academy', price: 50 },
      strategy: { name: 'Strategy & Mentorship', price: 70 },
    };
    return courses[courseId] || { name: courseId, price: 0 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Pending Payment Receipts</h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve payment receipts within 24 hours
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {pendingPayments.length} Pending
          </Badge>
          <Button onClick={loadPendingPayments} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pending Payments List */}
      {pendingPayments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending payment receipts to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingPayments.map((payment) => {
            const course = getCourseDisplay(payment.courseId);
            const timeRemaining = getTimeRemaining(payment.expiresAt);
            const isExpiringSoon = new Date(payment.expiresAt).getTime() - new Date().getTime() < 6 * 60 * 60 * 1000; // < 6 hours

            return (
              <Card key={payment.paymentId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                        {payment.fileType.startsWith('image/') ? (
                          <ImageIcon className="w-8 h-8 text-blue-600" />
                        ) : (
                          <FileText className="w-8 h-8 text-red-600" />
                        )}
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg">{payment.userName || 'Unknown User'}</h3>
                          <p className="text-sm text-gray-600">{payment.userEmail}</p>
                        </div>
                        <Badge variant={isExpiringSoon ? 'destructive' : 'secondary'}>
                          <Clock className="w-3 h-3 mr-1" />
                          {timeRemaining}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Course</p>
                          <p className="text-sm">{course.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="text-sm">${payment.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="text-sm">{new Date(payment.submittedAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Country</p>
                          <p className="text-sm">{payment.userCountry || 'N/A'}</p>
                        </div>
                      </div>

                      {payment.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <p className="text-xs text-gray-500 mb-1">Notes:</p>
                          <p className="text-gray-700">{payment.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <Button
                        onClick={() => viewReceipt(payment)}
                        size="sm"
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                        View Receipt
                      </Button>
                      <Button
                        onClick={() => approvePayment(payment.paymentId)}
                        size="sm"
                        variant="outline"
                        className="gap-2 text-green-600 hover:bg-green-50"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowRejectModal(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="gap-2 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Receipt Viewer Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Review the receipt and approve or reject the payment
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Payment Info */}
              <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">User</p>
                  <p className="font-semibold">{selectedPayment.userName}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Course & Amount</p>
                  <p className="font-semibold">{getCourseDisplay(selectedPayment.courseId).name}</p>
                  <p className="text-lg text-blue-600">${selectedPayment.amount}</p>
                </div>
              </div>

              {/* Receipt Display */}
              <div className="border rounded-lg p-4 bg-gray-50">
                {processing ? (
                  <div className="flex items-center justify-center p-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : receiptUrl ? (
                  selectedPayment.fileType.startsWith('image/') ? (
                    <img
                      src={receiptUrl}
                      alt="Payment Receipt"
                      className="w-full h-auto max-h-[500px] object-contain rounded"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 mx-auto text-red-600 mb-4" />
                      <p className="text-sm text-gray-600 mb-4">PDF Receipt</p>
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </div>
                  )
                ) : (
                  <p className="text-center text-gray-500 p-8">Receipt not available</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => approvePayment(selectedPayment.paymentId)}
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  disabled={processing}
                >
                  <Check className="w-4 h-4" />
                  Approve Payment
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  variant="outline"
                  className="flex-1 gap-2 text-red-600 hover:bg-red-50"
                  disabled={processing}
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment receipt
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="e.g., Receipt is unclear, amount doesn't match, invalid payment proof..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />

            <div className="flex gap-3">
              <Button
                onClick={rejectPayment}
                variant="destructive"
                className="flex-1"
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Confirm Rejection
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                variant="outline"
                className="flex-1"
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
