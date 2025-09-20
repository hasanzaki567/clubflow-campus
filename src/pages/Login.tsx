import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { GraduationCap, Users, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {username?: string; password?: string} = {};

    if (!username.trim()) {
      newErrors.username = "Username or email is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Handle login logic here
      console.log("Login:", { username, password, rememberMe });

      // Simulate success/failure
      if (username === "admin" && password === "password") {
        // Success - redirect would happen here
        console.log("Login successful");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setErrors({ username: "Invalid username or password", password: "Invalid username or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--campus-navy))] via-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 50%, hsl(var(--campus-green))/0.1 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, hsl(var(--campus-green))/0.1 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, hsl(var(--campus-green))/0.05 0%, transparent 50%)
      `,
      backgroundSize: '800px 800px, 600px 600px, 900px 900px',
      backgroundPosition: '0% 0%, 100% 0%, 50% 100%'
    }}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(76, 175, 80, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76, 175, 80, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[hsl(var(--campus-green))]/10 rounded-full blur-xl animate-breathe-dramatic"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-[hsl(var(--campus-green))]/15 rounded-full blur-lg animate-breathe-dramatic" style={{animationDelay: '0s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[hsl(var(--campus-green))]/20 rounded-full blur-md animate-breathe-dramatic" style={{animationDelay: '0s'}}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--campus-green))] rounded-lg blur-sm opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 text-[hsl(var(--campus-navy))] p-3 rounded-lg shadow-lg">
                  <GraduationCap className="h-8 w-8" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight" style={{
              textShadow: '0 0 20px hsl(var(--campus-green)), 0 0 40px hsl(var(--campus-green))',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome Back
            </h1>

            <p className="text-lg text-gray-300 mb-2">Log in to Campus Club Suite</p>
            <div className="inline-flex items-center px-3 py-1 bg-[hsl(var(--campus-green))]/10 backdrop-blur-sm text-[hsl(var(--campus-green))] text-sm font-medium rounded-full border border-[hsl(var(--campus-green))]/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Enterprise Campus Management Suite
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                  Username or Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="john.doe@university.edu"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 transition-colors ${
                      errors.username ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors({...errors, username: undefined});
                    }}
                    required
                  />
                  {username && !errors.username && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[hsl(var(--campus-green))] hover:text-[hsl(var(--campus-green))]/80 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 pr-10 transition-colors ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: undefined});
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {password && !errors.password && password.length >= 6 && (
                    <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !username.trim() || !password}
                className="w-full bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-[hsl(var(--campus-navy))] font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[hsl(var(--campus-navy))] border-t-transparent rounded-full animate-spin mr-3"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Proceed to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">New to Campus Club Suite?</span>
                </div>
              </div>

              <Link to="/signup">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create New Account
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/dashboard"
                className="text-sm text-gray-400 hover:text-gray-300 hover:underline transition-colors inline-flex items-center gap-1"
              >
                Skip for now
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Professional Features Showcase */}
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Why Choose Campus Club Suite?</h3>

              {/* Core Features */}
              <div className="grid grid-cols-1 gap-3 text-sm mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Club Management</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Event Planning</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Inter-College Collaboration</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Analytics & Insights</span>
                </div>
              </div>

              {/* Platform Stats */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--campus-green))]">500+</p>
                    <p className="text-xs text-gray-400">Active Clubs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--campus-green))]">50k+</p>
                    <p className="text-xs text-gray-400">Students</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--campus-green))]">1000+</p>
                    <p className="text-xs text-gray-400">Events Organized</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--campus-green))]">200+</p>
                    <p className="text-xs text-gray-400">Colleges</p>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full"></div>
                  <span>🚀 Now Serving 200+ Colleges</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free Forever - No Credit Card Required</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Setup in Minutes</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Enterprise-Grade Security</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Modern Glass Morphism Design</span>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>Enterprise Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
