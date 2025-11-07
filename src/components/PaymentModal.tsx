import { useState } from 'react';
import { X, CreditCard, Building, Coins, Check, Loader2, Shield, Lock, Upload, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: 'beginners' | 'strategy';
    name: string;
    price: number;
    duration: string;
    features: string[];
  };
  userId?: string;
  accessToken?: string;
  onPaymentSuccess: (courseId: string, paymentMethod: string) => void;
  onUploadReceipt?: () => void;
}

export function PaymentModal({ isOpen, onClose, course, userId, accessToken, onPaymentSuccess, onUploadReceipt }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'crypto'>('transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/api-server`;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('✅ Payment Method Selected!', {
        description: `Please upload your payment receipt to complete enrollment.`,
        duration: 4000,
      });
      
      setIsProcessing(false);
      
      // Transition to receipt upload screen
      if (onUploadReceipt) {
        onUploadReceipt();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-2 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 relative pb-4 md:pb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl md:text-2xl pr-10">
                Enroll in {course.name}
              </CardTitle>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${course.price}
                </span>
                <span className="text-gray-600 text-sm md:text-base">/ {course.duration}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 md:pt-6 space-y-4 md:space-y-6 px-4 md:px-6">
              {/* Payment Process Notice */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm text-gray-800">
                    <strong className="text-blue-700">How Payment Works:</strong>
                    <ol className="list-decimal list-inside space-y-1 mt-2 text-gray-700">
                      <li>Select your payment method and complete the payment</li>
                      <li>Click "Submit Payment" to notify our admin team</li>
                      <li>Your payment will be reviewed and approved within 24 hours</li>
                      <li>Once approved, you'll get instant access to the course</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-3 md:p-4">
                <h3 className="text-sm md:text-base mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <strong>What's Included:</strong>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Method Selection */}
              <div>
                <Label className="text-sm md:text-base mb-3 block">Select Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <div className="space-y-2 md:space-y-3">
                    {/* Bank Transfer (Recommended) */}
                    <div className={`border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all ${
                      paymentMethod === 'transfer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Building className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                          <span className="text-sm md:text-base">Bank Transfer</span>
                        </Label>
                        <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
                      </div>
                    </div>

                    {/* Card Payment */}
                    <div className={`border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                          <span className="text-sm md:text-base">Credit/Debit Card</span>
                        </Label>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 md:w-8 md:h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-white text-[8px] md:text-[10px] flex items-center justify-center">VISA</div>
                          <div className="w-6 h-4 md:w-8 md:h-5 bg-gradient-to-r from-red-600 to-orange-400 rounded text-white text-[8px] md:text-[10px] flex items-center justify-center">MC</div>
                        </div>
                      </div>
                    </div>

                    {/* Crypto Payment */}
                    <div className={`border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all ${
                      paymentMethod === 'crypto' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="crypto" id="crypto" />
                        <Label htmlFor="crypto" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Coins className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                          <span className="text-sm md:text-base">Cryptocurrency</span>
                        </Label>
                        <span className="text-[10px] md:text-xs text-gray-500">BTC/ETH/USDT</span>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Details */}
              <AnimatePresence mode="wait">
                {paymentMethod === 'card' && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 md:space-y-4"
                  >
                    <div>
                      <Label htmlFor="cardNumber" className="text-xs md:text-sm">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        maxLength={19}
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-xs md:text-sm">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-xs md:text-sm">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          maxLength={5}
                          className="text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-xs md:text-sm">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          maxLength={4}
                          className="text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'transfer' && (
                  <motion.div
                    key="transfer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-3 md:p-4"
                  >
                    <h4 className="text-sm md:text-base mb-3"><strong>Bank Transfer Details:</strong></h4>
                    <div className="space-y-2 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-mono">Pip Nation Academy Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-mono">Pip Nation Academy Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-mono">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-mono text-blue-600">PNA-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <Separator />
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
                        <p className="text-xs text-yellow-800">
                          ⏱️ <strong>Approval Time:</strong> Within 24 hours after you submit payment
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        After making payment, click "Submit Payment" to notify admin. Your payment will be verified within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'crypto' && (
                  <motion.div
                    key="crypto"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3 md:p-4"
                  >
                    <h4 className="text-sm md:text-base mb-3"><strong>Cryptocurrency Payment:</strong></h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs md:text-sm">Select Cryptocurrency</Label>
                        <RadioGroup defaultValue="usdt" className="mt-2">
                          <div className="flex items-center gap-2 p-2 border rounded hover:bg-purple-50">
                            <RadioGroupItem value="btc" id="btc" />
                            <Label htmlFor="btc" className="cursor-pointer flex-1 text-xs md:text-sm">Bitcoin (BTC)</Label>
                          </div>
                          <div className="flex items-center gap-2 p-2 border rounded hover:bg-purple-50">
                            <RadioGroupItem value="eth" id="eth" />
                            <Label htmlFor="eth" className="cursor-pointer flex-1 text-xs md:text-sm">Ethereum (ETH)</Label>
                          </div>
                          <div className="flex items-center gap-2 p-2 border rounded hover:bg-purple-50">
                            <RadioGroupItem value="usdt" id="usdt" />
                            <Label htmlFor="usdt" className="cursor-pointer flex-1 text-xs md:text-sm">Tether (USDT)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="bg-white p-3 rounded border-2 border-dashed border-purple-300">
                        <p className="text-xs text-gray-600 mb-2">Wallet Address:</p>
                        <p className="font-mono text-[10px] md:text-xs break-all text-purple-600">
                          0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Send proof of payment to: crypto@eliteforexacademy.com
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security Notice */}
              <div className="flex items-start gap-2 md:gap-3 p-3 bg-gray-50 border rounded-lg">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-gray-700">
                  <strong>Secure Payment:</strong> Your payment information is encrypted and secure. We never store your card details.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 text-sm md:text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm md:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Payment - ${course.price}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
