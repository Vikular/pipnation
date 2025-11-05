import { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Users, Award, BookOpen, Target, CheckCircle, Star, Zap, Shield, BarChart3, Clock, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SocialLinks } from './SocialLinks';
import logoImage from 'figma:asset/e2e2f1ae8441670fc3154c69225d8cc55dbcf229.png';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Michael Chen",
      country: "Singapore 🇸🇬",
      quote: "From complete beginner to passing my FTMO challenge in 6 months. The structured approach and mentorship were absolute game-changers for my trading career.",
      result: "Funded Trader - $100K Account",
      image: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBzdWNjZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc2MDM1NDc0OHww&ixlib=rb-4.1.0&q=80&w=400",
      rating: 5
    },
    {
      name: "Sarah Williams",
      country: "United Kingdom 🇬🇧",
      quote: "The progression system kept me motivated throughout. Each level built perfectly on the last. Now I'm in the Signal Room learning from the absolute best traders.",
      result: "Pro Trader - Signal Room Member",
      image: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBzdWNjZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc2MDM1NDc0OHww&ixlib=rb-4.1.0&q=80&w=400",
      rating: 5
    },
    {
      name: "Ibrahim Adewale",
      country: "Nigeria 🇳🇬",
      quote: "Flexible payment options made it accessible. The community support is incredible. Finally found a trading education that delivers real, measurable results.",
      result: "Advanced Level Student",
      image: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBzdWNjZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc2MDM1NDc0OHww&ixlib=rb-4.1.0&q=80&w=400",
      rating: 5
    }
  ];

  const pathwaySteps = [
    { title: "Foundation", description: "Master the fundamentals", icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { title: "Advanced", description: "Develop your edge", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { title: "FTMO Challenge", description: "Prove your skills", icon: Target, color: "from-orange-500 to-orange-600" },
    { title: "Signal Room", description: "Trade with pros", icon: Users, color: "from-green-500 to-green-600" },
    { title: "Funded Trader", description: "Get capital", icon: Award, color: "from-yellow-500 to-yellow-600" }
  ];

  const features = [
    { icon: BookOpen, title: "Structured Learning", description: "Step-by-step curriculum designed for success" },
    { icon: Users, title: "Community Support", description: "Connect with traders worldwide" },
    { icon: Target, title: "Goal-Oriented", description: "Clear path to becoming funded" },
    { icon: Shield, title: "Risk Management", description: "Protect your capital effectively" },
    { icon: BarChart3, title: "Live Analysis", description: "Real-time market breakdowns" },
    { icon: Zap, title: "Fast Track", description: "Accelerated learning program" }
  ];

  const stats = [
    { number: "500+", label: "Active Students", icon: Users },
    { number: "50+", label: "Funded Traders", icon: Award },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <img 
                  src={logoImage} 
                  alt="Pip Nation Academy Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-xl">Pip Nation Academy</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#curriculum" className="text-gray-700 hover:text-blue-600 transition-colors">Curriculum</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Success Stories</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onLogin}>Login</Button>
              <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Professional Trading Education
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                From Beginner to Funded Trader
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                A proven pathway to forex trading success. Master the fundamentals, develop your edge, and get funded with our proprietary firm.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
                >
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('pathway')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8"
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  View Pathway
                </Button>
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1640552435845-d65c23b75934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JleCUyMHRyYWRpbmclMjBzY3JlZW58ZW58MXx8fHwxNzYwNDMzMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Trading Dashboard"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">This Month</div>
                    <div className="text-xl">12 New Funded Traders</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl"
              >
                <div className="text-3xl mb-1">95%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed to take you from beginner to funded trader
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-2 hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section - Mission & Vision */}
      <section id="about" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">About Us</Badge>
            <h2 className="text-4xl mb-4">Our Purpose & Direction</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on a foundation of education, mentorship, and proven results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-center text-blue-600">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-700 leading-relaxed text-center">
                    Empower beginner students to become profitable traders in the forex market through comprehensive education, mentorship, and guidance, equipping them with the skills and confidence to succeed.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision Statement */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-center text-purple-600">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-700 leading-relaxed text-center">
                    To create a community of successful traders by providing a supportive and structured learning environment, where beginners can grow and thrive under the guidance of experienced mentors, and become independent traders who can achieve their financial goals.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl mb-4">Real Results from Real Traders</h2>
            <p className="text-xl text-gray-600">Join hundreds of successful traders worldwide</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-blue-200 shadow-xl bg-white/80 backdrop-blur">
                <CardContent className="pt-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <motion.img 
                      whileHover={{ scale: 1.1 }}
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
                    />
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-3">
                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg mb-4 italic text-gray-700">"{testimonials[activeTestimonial].quote}"</p>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="text-lg">{testimonials[activeTestimonial].name}</div>
                          <div className="text-sm text-gray-600">{testimonials[activeTestimonial].country}</div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                          {testimonials[activeTestimonial].result}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === activeTestimonial 
                      ? 'w-8 h-3 bg-gradient-to-r from-blue-600 to-purple-600' 
                      : 'w-3 h-3 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pathway Infographic */}
      <section id="pathway" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Your Journey</Badge>
            <h2 className="text-4xl mb-4">Clear Path to Funding</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A structured journey from beginner to funded trader with clear milestones
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {pathwaySteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  className="relative"
                >
                  <Card className="text-center border-2 hover:border-blue-600 transition-all duration-300 hover:shadow-2xl bg-white">
                    <CardHeader>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="text-2xl mb-2">{idx + 1}</div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  {idx < pathwaySteps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + 0.3, duration: 0.5 }}
                      className="hidden md:block absolute top-1/4 -right-3 w-6 h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-10"
                    >
                      <ArrowRight className="w-4 h-4 text-blue-600 absolute -right-2 -top-1.5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Pricing Plans</Badge>
            <h2 className="text-4xl mb-4">Invest in Your Trading Future</h2>
            <p className="text-xl text-gray-600">Affordable, flexible pricing for every stage of your journey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Trial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-2 hover:border-blue-600 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-400 to-gray-600" />
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-600" />
                  </div>
                  <CardTitle className="text-2xl">Free Trial</CardTitle>
                  <CardDescription>Start your journey</CardDescription>
                  <div className="text-5xl mt-6 mb-2">$0</div>
                  <div className="text-gray-600">Forever Free</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Introduction to Forex Trading</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Basic Market Structure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Understanding Currency Pairs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Community Access</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" onClick={onGetStarted}>
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Beginners Academy - $50 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -12, scale: 1.02 }}
            >
              <Card className="h-full border-4 border-blue-500 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl">Beginners Academy</CardTitle>
                  <CardDescription className="text-lg">Complete foundation training</CardDescription>
                  <div className="mt-6">
                    <div className="text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$50</div>
                    <div className="text-gray-600 mt-2">One-time payment</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Full Foundation Course</strong> (12 lessons)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Risk Management Fundamentals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Trading Psychology Basics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Entry & Exit Strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Community Forum Access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Trading Journal Templates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Email Support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Lifetime Course Access</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6" 
                    onClick={onGetStarted}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Learning Now
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Average completion: 6-8 weeks
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strategy & Mentorship - $70 for 2 months */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-2 border-purple-500 hover:border-purple-600 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-600" />
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm px-4 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    Pro Level
                  </Badge>
                </div>
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl">Strategy & Mentorship</CardTitle>
                  <CardDescription className="text-lg">Advanced training with guidance</CardDescription>
                  <div className="mt-6">
                    <div className="text-6xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$70</div>
                    <div className="text-gray-600 mt-2">2 Months Access</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>All Beginners Content</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Advanced Course</strong> (15 lessons)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Smart Money Concepts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Live Trading Sessions (2x/week)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>1-on-1 Mentorship</strong> (2 sessions)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Trade Review & Feedback</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>FTMO Challenge Preparation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Private Community Access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Priority Support (24-48h response)</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6" 
                    onClick={onGetStarted}
                  >
                    <Award className="w-5 h-5 mr-2" />
                    Get Mentorship
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Best value for serious traders
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              <Shield className="w-5 h-5 inline mr-2" />
              30-day money-back guarantee on all paid plans
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1))',
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl text-white mb-6">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join hundreds of successful traders who started exactly where you are now
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Start Free Trial Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img 
                    src={logoImage} 
                    alt="Pip Nation Academy Logo" 
                    className="w-10 h-10 object-contain brightness-0 invert"
                  />
                </div>
                <span className="text-xl">Pip Nation Academy</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Professional forex trading education with a clear path to funding and success.
              </p>
            </div>
            <div>
              <h3 className="mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-lg">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trading Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Free Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-lg">Follow Us</h3>
              <p className="text-gray-400 text-sm mb-4">
                Connect with us on social media for updates, tips, and community news
              </p>
              <SocialLinks variant="footer" className="mt-4" />
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 Pip Nation Academy. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
