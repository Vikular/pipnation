import { useState } from 'react';
import { X, Upload, CheckCircle, Award, Target, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface FTMOSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proofUrl: string, notes: string) => void;
}

export function FTMOSubmissionModal({ isOpen, onClose, onSubmit }: FTMOSubmissionModalProps) {
  const [proofUrl, setProofUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(proofUrl, notes);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setProofUrl('');
      setNotes('');
    }, 3500);
  };

  const benefits = [
    { icon: Target, text: 'Unlock Signal Room Access', color: 'text-green-600' },
    { icon: TrendingUp, text: 'Join Pro Traders Community', color: 'text-blue-600' },
    { icon: Award, text: 'Get Priority Support', color: 'text-purple-600' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl"
        >
          <Card className="relative overflow-hidden shadow-2xl">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1759701546980-1211be084c70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBhY2hpZXZlbWVudCUyMHdpbm5lcnxlbnwxfHx8fDE3NjA0MzM5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Animated gradient overlay */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6, #10b981)',
                backgroundSize: '200% 200%'
              }}
            />

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {!submitted ? (
              <>
                <CardHeader className="relative bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-b-2">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="relative"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-900" />
                      </motion.div>
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
                            <Target className="w-3 h-3 mr-1" />
                            Verification Required
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl">Submit FTMO Challenge Proof</CardTitle>
                        <CardDescription className="text-base mt-2">
                          Upload proof of passing your FTMO Free Challenge to unlock exclusive Signal Room access
                        </CardDescription>
                      </motion.div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative pt-8">
                  {/* Benefits Section */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-green-200"
                  >
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      What You'll Unlock
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {benefits.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          className="flex flex-col items-center text-center p-4 bg-white rounded-xl border-2 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${benefit.color.split('-')[1]}-100 to-${benefit.color.split('-')[1]}-200 flex items-center justify-center mb-3`}>
                            <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                          </div>
                          <p className="text-sm">{benefit.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200"
                    >
                      <h4 className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Requirements:
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'Screenshot or link to your FTMO dashboard showing passed challenge',
                          'Clear display of your account number and pass status',
                          'Image must be recent (within last 30 days)',
                          'Ensure all information is clearly visible'
                        ].map((req, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7 + idx * 0.05 }}
                            className="flex items-start gap-2 text-sm text-blue-900"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="proofUrl" className="text-base">
                        Proof URL or Screenshot Link <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative group">
                        <Upload className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="proofUrl"
                          type="url"
                          placeholder="https://imgur.com/your-screenshot or https://ftmo.com/dashboard"
                          value={proofUrl}
                          onChange={(e) => setProofUrl(e.target.value)}
                          className="pl-11 h-12 border-2 focus:border-blue-600 transition-all"
                          required
                        />
                      </div>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600">💡</span>
                        Upload your screenshot to Imgur, Google Drive, or Dropbox and paste the link here
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="notes" className="text-base">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information about your challenge (account size, duration, profit %, etc.)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="border-2 focus:border-blue-600 transition-all resize-none"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">⏳</span>
                        </div>
                        <div>
                          <p className="text-sm text-yellow-900 mb-1">
                            <strong>Review Process:</strong>
                          </p>
                          <p className="text-sm text-yellow-800">
                            Your submission will be reviewed by our team within 24-48 hours. 
                            You'll receive an email notification once verified and your account will be automatically upgraded to Pro Trader status.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Submit for Verification
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-16 text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <div className="relative inline-block mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: "linear" }}
                      className="w-32 h-32 border-8 border-green-200 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                        <CheckCircle className="w-14 h-14 text-white" />
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-900" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    🎉 Submission Received!
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
                    Your FTMO proof has been submitted successfully. Our verification team will review it shortly.
                  </p>
                  
                  <div className="max-w-lg mx-auto space-y-3 mb-8">
                    {[
                      { icon: '✅', text: 'Submission recorded', color: 'from-green-50 to-green-100' },
                      { icon: '👀', text: 'Under review (24-48 hours)', color: 'from-blue-50 to-blue-100' },
                      { icon: '📧', text: 'Email notification on approval', color: 'from-purple-50 to-purple-100' }
                    ].map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className={`flex items-center gap-3 p-4 bg-gradient-to-r ${step.color} rounded-xl border-2 border-green-200`}
                      >
                        <span className="text-2xl">{step.icon}</span>
                        <span className="text-sm">{step.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="inline-block p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-green-200"
                  >
                    <Award className="w-16 h-16 mx-auto mb-3 text-green-600" />
                    <p className="text-sm text-gray-600">
                      Get ready for your Pro Trader journey! 🚀
                    </p>
                  </motion.div>
                </motion.div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
