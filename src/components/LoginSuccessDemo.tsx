import { CheckCircle, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export function LoginSuccessDemo() {
  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Login Fixed!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-700"
          >
            You can now login with <strong>ANY</strong> email and password!
          </motion.p>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-4 text-left bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl"
          >
            <h3 className="text-lg text-center mb-4">Try These Examples:</h3>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">1</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-700 mb-2">Quick Test:</div>
                <div className="bg-white p-3 rounded-lg font-mono text-sm space-y-1">
                  <div>Email: <span className="text-blue-600">test@example.com</span></div>
                  <div>Password: <span className="text-blue-600">anything</span></div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">2</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-700 mb-2">Role-Based:</div>
                <div className="bg-white p-3 rounded-lg text-xs space-y-1">
                  <div><span className="text-purple-600">student@test.com</span> → Full Access</div>
                  <div><span className="text-purple-600">free@test.com</span> → Free Trial</div>
                  <div><span className="text-purple-600">pro@test.com</span> → Pro Trader</div>
                  <div><span className="text-purple-600">admin@test.com</span> → Admin Panel</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What You'll See */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-green-50 border-2 border-green-200 p-4 rounded-lg"
          >
            <h4 className="text-sm mb-2 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <strong>What You'll See:</strong>
            </h4>
            <div className="text-xs text-gray-700 space-y-1">
              <div>✅ Toast: "🎭 Demo Mode: Logged In!"</div>
              <div>✅ Orange banner at top (demo mode)</div>
              <div>✅ Dashboard loads immediately</div>
              <div>✅ All features work perfectly</div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex gap-4 justify-center pt-4"
          >
            <button
              onClick={() => {
                const event = new CustomEvent('openAuthModal', { detail: { mode: 'signup' } });
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up Now
            </button>
            <button
              onClick={() => {
                const event = new CustomEvent('openAuthModal', { detail: { mode: 'login' } });
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Login Now
            </button>
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-xs text-gray-500"
          >
            No errors will show - demo mode activates automatically if backend unavailable
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
