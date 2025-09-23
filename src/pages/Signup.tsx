import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Lock, User, Building2, Users, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

interface FormData {
  name: string;
  email: string;
  college: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    college: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors: FormErrors = {};

    if (!formData.name.trim()) {
      formErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      formErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }

    if (!formData.college.trim()) {
      formErrors.college = "College name is required";
    }

    if (!formData.role) {
      formErrors.role = "Please select your role";
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      formErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Register user using API
      const response = await apiClient.register({
        name: formData.name,
        email: formData.email,
        college: formData.college,
        password: formData.password
      });

      console.log("✅ User created successfully:", {
        id: response.userId,
        name: formData.name,
        email: formData.email,
        role: formData.role
      });

      // Show success message and redirect to login
      alert(`🎉 Account created successfully!\n\nWelcome to Campbuzz, ${formData.name}!\n\nYou can now log in with your credentials.`);
      window.location.href = '/login';
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again.";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--campus-green))] rounded-lg blur-sm opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 text-[hsl(var(--campus-navy))] p-3 rounded-lg shadow-lg">
                  <GraduationCap className="h-8 w-8" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Join Campus Club Suite
            </h1>

            <p className="text-lg text-gray-300 mb-2">Create your account to get started</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 pl-10 transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                  {formData.name && !errors.name && formData.name.length >= 2 && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@college.edu"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 pl-10 transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                  {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="college" className="text-sm font-medium text-gray-200">
                  College Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="college"
                    type="text"
                    placeholder="Your College Name"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 pl-10 transition-colors ${
                      errors.college ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={formData.college}
                    onChange={(e) => updateField('college', e.target.value)}
                    required
                  />
                  {formData.college && !errors.college && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.college && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.college}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-200">
                  Your Role
                </Label>
                <Select onValueChange={(value) => updateField('role', value)}>
                  <SelectTrigger className={`bg-white/10 border-white/20 text-white focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 ${
                    errors.role ? 'border-red-500 focus:border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--campus-navy))] border-white/20">
                    <SelectItem value="student">🎓 Student</SelectItem>
                    <SelectItem value="club_admin">👑 Club Admin</SelectItem>
                    <SelectItem value="college_admin">🏫 College Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 pl-10 pr-10 transition-colors ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {formData.password && !errors.password && formData.password.length >= 8 && (
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--campus-green))] focus:ring-[hsl(var(--campus-green))]/20 pl-10 pr-10 transition-colors ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-[hsl(var(--campus-navy))] font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[hsl(var(--campus-navy))] border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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
                  <span className="px-4 bg-transparent text-gray-400">Already have an account?</span>
                </div>
              </div>

              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Sign In Instead
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-400 hover:text-gray-300 hover:underline transition-colors inline-flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Go to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
