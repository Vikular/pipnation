import { useState, useEffect } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Lock from 'lucide-react/dist/esm/icons/lock';
import User from 'lucide-react/dist/esm/icons/user';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Shield from 'lucide-react/dist/esm/icons/shield';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Phone from 'lucide-react/dist/esm/icons/phone';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Target from 'lucide-react/dist/esm/icons/target';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import logoImage from 'figma:asset/e2e2f1ae8441670fc3154c69225d8cc55dbcf229.png';

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  tradingExperience: string;
  tradingGoals: string;
  tradingGoalsOther: string;
  currentKnowledge: string;
  phoneNumber: string;
  whatsappNumber: string;
  tradingPreferences: string[];
  tradingPreferencesOther: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup' | 'lead';
  onAuth: (email: string, password: string, signupData?: SignupData) => void;
}

export function AuthModal({ isOpen, onClose, mode, onAuth }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [tradingExperience, setTradingExperience] = useState('');
  const [tradingGoals, setTradingGoals] = useState('');
  const [tradingGoalsOther, setTradingGoalsOther] = useState('');
  const [currentKnowledge, setCurrentKnowledge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [tradingPreferences, setTradingPreferences] = useState<string[]>([]);
  const [tradingPreferencesOther, setTradingPreferencesOther] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Update mode when prop changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setFullName('');
      setCountry('');
      setTradingExperience('');
      setTradingGoals('');
      setTradingGoalsOther('');
      setCurrentKnowledge('');
      setPhoneNumber('');
      setWhatsappNumber('');
      setTradingPreferences([]);
      setTradingPreferencesOther('');
      setShowForgotPassword(false);
      setResetEmail('');
      setResetSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (currentMode === 'lead' || currentMode === 'signup') {
      // Validate required fields
      if (!fullName || !email || !password || !country || !tradingExperience || !tradingGoals || !currentKnowledge || !phoneNumber || !whatsappNumber || tradingPreferences.length === 0) {
        setIsLoading(false);
        // The form's built-in validation should catch this, but just in case
        return;
      }
      
      const signupData: SignupData = {
        fullName,
        email,
        password,
        country,
        tradingExperience,
        tradingGoals,
        tradingGoalsOther,
        currentKnowledge,
        phoneNumber,
        whatsappNumber,
        tradingPreferences,
        tradingPreferencesOther,
      };
      
      console.log('Submitting signup with data:', { ...signupData, password: '***' });
      await onAuth(email, password, signupData);
    } else {
      await onAuth(email, password);
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { supabase } = await import('../utils/supabase/client');
      // Redirect to root with hash parameters that App.tsx will detect
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        console.error('Password reset error:', error);
        alert('Failed to send reset email. Please try again.');
      } else {
        setResetSent(true);
      }
    } catch (error) {
      console.error('Password reset exception:', error);
      alert('Failed to send reset email. Please try again.');
    }

    setIsLoading(false);
  };

  const isLeadCapture = currentMode === 'lead';
  const isSignup = currentMode === 'signup';
  
  const toggleTradingPreference = (pref: string) => {
    if (tradingPreferences.includes(pref)) {
      setTradingPreferences(tradingPreferences.filter(p => p !== pref));
    } else {
      setTradingPreferences([...tradingPreferences, pref]);
    }
  };

  const benefits = [
    { icon: CheckCircle, text: 'Instant access to free content' },
    { icon: CheckCircle, text: 'No credit card required' },
    { icon: CheckCircle, text: 'Cancel anytime' }
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
          className="max-h-[90vh] overflow-y-auto w-full max-w-3xl"
        >
          <Card className="w-full relative overflow-hidden shadow-2xl">
            {/* Animated background gradient */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
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
            
            <CardHeader className="text-center pb-6 relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img 
                    src={logoImage} 
                    alt="Pip Nation Academy Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="text-2xl">Pip Nation Academy</span>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-2xl">
                  {isLeadCapture && 'Start Your Free Trial'}
                  {isSignup && 'Create Your Account'}
                  {currentMode === 'login' && 'Welcome Back'}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {isLeadCapture && 'Get instant access to our free introductory course'}
                  {isSignup && 'Join hundreds of successful traders worldwide'}
                  {currentMode === 'login' && 'Sign in to continue your trading journey'}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="relative">
              {/* Forgot Password View */}
              {showForgotPassword ? (
                <div className="space-y-5">
                  {resetSent ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center space-y-4 py-8"
                    >
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                        <p className="text-sm text-gray-600">
                          We've sent a password reset link to <strong>{resetEmail}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Click the link in the email to reset your password.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetSent(false);
                          setResetEmail('');
                        }}
                        className="w-full mt-4"
                      >
                        Back to Login
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                      <div className="text-center space-y-2 mb-6">
                        <h3 className="text-lg font-semibold">Reset Your Password</h3>
                        <p className="text-sm text-gray-600">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="resetEmail">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder="you@example.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                            required
                          />
                        </div>
                      </motion.div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Send Reset Link'
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ← Back to Login
                      </button>
                    </form>
                  )}
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Login Form - Simple */}
                {currentMode === 'login' && (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-all"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </>
                )}

                {/* Signup Form - Comprehensive */}
                {(isLeadCapture || isSignup) && (
                  <>
                    {/* Full Name */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Password - for both signup and lead */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password *</Label>
                        {isLeadCapture && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            ✓ Required
                          </span>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {isLeadCapture 
                          ? "You'll use this password to log in later" 
                          : "Minimum 6 characters"}
                      </p>
                    </motion.div>

                    {/* Country */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.52 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="country">Country *</Label>
                      <div className="relative group">
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10 group-focus-within:text-blue-600 transition-colors" />
                        <Select value={country} onValueChange={setCountry} required>
                          <SelectTrigger className="pl-10 h-11 border-2 focus:border-blue-600">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">🇺🇸 United States</SelectItem>
                            <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                            <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                            <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                            <SelectItem value="NG">🇳🇬 Nigeria</SelectItem>
                            <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                            <SelectItem value="KE">🇰🇪 Kenya</SelectItem>
                            <SelectItem value="GH">🇬🇭 Ghana</SelectItem>
                            <SelectItem value="SG">🇸🇬 Singapore</SelectItem>
                            <SelectItem value="IN">🇮🇳 India</SelectItem>
                            <SelectItem value="MY">🇲🇾 Malaysia</SelectItem>
                            <SelectItem value="PH">🇵🇭 Philippines</SelectItem>
                            <SelectItem value="AE">🇦🇪 United Arab Emirates</SelectItem>
                            <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                            <SelectItem value="EG">🇪🇬 Egypt</SelectItem>
                            <SelectItem value="BR">🇧🇷 Brazil</SelectItem>
                            <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                            <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                            <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                            <SelectItem value="FR">🇫🇷 France</SelectItem>
                            <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                            <SelectItem value="IT">🇮🇹 Italy</SelectItem>
                            <SelectItem value="NL">🇳🇱 Netherlands</SelectItem>
                            <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                            <SelectItem value="KR">🇰🇷 South Korea</SelectItem>
                            <SelectItem value="CN">🇨🇳 China</SelectItem>
                            <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
                            <SelectItem value="ID">🇮🇩 Indonesia</SelectItem>
                            <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                            <SelectItem value="OTHER">🌍 Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>

                    {/* Trading Experience */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.55 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="tradingExperience">Trading Experience *</Label>
                      <div className="relative group">
                        <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10 group-focus-within:text-blue-600 transition-colors" />
                        <Select value={tradingExperience} onValueChange={setTradingExperience} required>
                          <SelectTrigger className="pl-10 h-11 border-2 focus:border-blue-600">
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>

                    {/* Trading Goals */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="tradingGoals">Trading Goals *</Label>
                      <div className="relative group">
                        <Target className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10 group-focus-within:text-blue-600 transition-colors" />
                        <Select value={tradingGoals} onValueChange={setTradingGoals} required>
                          <SelectTrigger className="pl-10 h-11 border-2 focus:border-blue-600">
                            <SelectValue placeholder="Select your trading goals" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supplemental">Supplemental Income</SelectItem>
                            <SelectItem value="fulltime">Full-time Trader</SelectItem>
                            <SelectItem value="dontknow">Don't Know</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {tradingGoals === 'other' && (
                        <Input
                          type="text"
                          placeholder="Please specify your goals"
                          value={tradingGoalsOther}
                          onChange={(e) => setTradingGoalsOther(e.target.value)}
                          className="h-11 border-2 focus:border-blue-600 transition-all mt-2"
                        />
                      )}
                    </motion.div>

                    {/* Current Trading Knowledge */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.65 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="currentKnowledge">Current Trading Knowledge *</Label>
                      <div className="relative group">
                        <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10 group-focus-within:text-blue-600 transition-colors" />
                        <Select value={currentKnowledge} onValueChange={setCurrentKnowledge} required>
                          <SelectTrigger className="pl-10 h-11 border-2 focus:border-blue-600">
                            <SelectValue placeholder="Select your knowledge level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>

                    {/* Contact Information - Two columns on larger screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                          <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* WhatsApp Number */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.75 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                          <Input
                            id="whatsappNumber"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            className="pl-10 h-11 border-2 focus:border-blue-600 transition-all"
                            required
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Trading Preferences */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3"
                    >
                      <Label>Trading Preferences * (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Forex', 'Stocks', 'Commodities', 'Cryptocurrency'].map((pref) => (
                          <div key={pref} className="flex items-center space-x-2">
                            <Checkbox
                              id={pref}
                              checked={tradingPreferences.includes(pref)}
                              onCheckedChange={() => toggleTradingPreference(pref)}
                            />
                            <label
                              htmlFor={pref}
                              className="text-sm cursor-pointer"
                            >
                              {pref}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="other-pref"
                          checked={tradingPreferences.includes('Other')}
                          onCheckedChange={() => toggleTradingPreference('Other')}
                        />
                        <div className="flex-1">
                          <label htmlFor="other-pref" className="text-sm cursor-pointer">
                            Other
                          </label>
                          {tradingPreferences.includes('Other') && (
                            <Input
                              type="text"
                              placeholder="Please specify"
                              value={tradingPreferencesOther}
                              onChange={(e) => setTradingPreferencesOther(e.target.value)}
                              className="h-11 border-2 focus:border-blue-600 transition-all mt-2"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        {isLeadCapture && '✨ Start Free Trial'}
                        {isSignup && '🚀 Create Account'}
                        {currentMode === 'login' && '🔐 Sign In'}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
              )}

              {!showForgotPassword && (
                <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-center"
                >
                  {currentMode === 'login' ? (
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setCurrentMode('signup')}
                        className="text-blue-600 hover:text-blue-700 hover:underline transition-all"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        onClick={() => setCurrentMode('login')}
                        className="text-blue-600 hover:text-blue-700 hover:underline transition-all"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </motion.div>

                {isLeadCapture && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100"
                >
                  <div className="space-y-2">
                    {benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 + idx * 0.1 }}
                        className="flex items-center gap-2 text-sm text-blue-900"
                      >
                        <benefit.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
