"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { registerApi } from "@/services/authApi";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim()))
          return "First name can only contain letters and spaces";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim()))
          return "Last name can only contain letters and spaces";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim()))
          return "Please enter a valid email address";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/(?=.*\d)/.test(value))
          return "Password must contain at least one number";
        if (!/(?=.*[@$!%*?&])/.test(value))
          return "Password must contain at least one special character";
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Re-validate confirm password when password changes
    if (name === "password" && touched.confirmPassword) {
      const confirmPasswordError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate all fields
      const newErrors: Record<string, string> = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(
          key,
          formData[key as keyof typeof formData]
        );
        if (error) newErrors[key] = error;
      });

      setErrors(newErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true,
      });

      if (Object.keys(newErrors).length === 0) {
        // Handle registration logic here

        const { confirmPassword, ...payload } = formData;

        const res = await registerApi(payload);

        console.log("Registration submitted:", formData, res);
        // router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass =
      "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-300 focus:ring-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-blue-500`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              id="firstName"
              name="firstName"
              type="text"
              onKeyDown={handleKeyDown}
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getInputClassName("firstName")}
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && touched.firstName && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{errors.firstName}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              id="lastName"
              onKeyDown={handleKeyDown}
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getInputClassName("lastName")}
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && touched.lastName && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{errors.lastName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            id="email"
            onKeyDown={handleKeyDown}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={getInputClassName("email")}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && touched.email && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            id="password"
            name="password"
            onKeyDown={handleKeyDown}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={getInputClassName("password")}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && touched.password && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{errors.password}</span>
          </div>
        )}
        {/* Password requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li
              className={formData.password.length >= 8 ? "text-green-600" : ""}
            >
              At least 8 characters
            </li>
            <li
              className={
                /(?=.*[a-z])/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One lowercase letter
            </li>
            <li
              className={
                /(?=.*[A-Z])/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One uppercase letter
            </li>
            <li
              className={
                /(?=.*\d)/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One number
            </li>
            <li
              className={
                /(?=.*[@$!%*?&])/.test(formData.password)
                  ? "text-green-600"
                  : ""
              }
            >
              One special character (@$!%*?&)
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            id="confirmPassword"
            onKeyDown={handleKeyDown}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={getInputClassName("confirmPassword")}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && touched.confirmPassword && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{errors.confirmPassword}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2 transition-colors"
      >
        {loading ? (
          <Loader className="animate-spin size-7" />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight size={20} />
          </>
        )}
      </button>
    </div>
  );
};

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Purple gradient pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.1),transparent_50%)]"></div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
        {/* Left Side - Registration Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join AI District Copywriting and start your journey
              </p>
            </div>

            {/* Registration Form */}
            <RegisterForm />

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => window.history.back()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>

            {/* Support Information */}
            {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Need help getting started?</p>
                  <div className="space-y-1 text-blue-700">
                    <p>• Your account will be activated immediately</p>
                    <p>• Check your email for a welcome message</p>
                    <p>• Contact support at{" "}
                      <a
                        href="mailto:support@industryrockstar.ai"
                        className="font-medium hover:underline"
                      >
                        support@industryrockstar.ai
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Features/Benefits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12 hidden lg:block">
          <div className="h-full flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Join Thousands of Professionals
                </h2>
                <p className="text-gray-600 text-lg">
                  Get access to AI-powered copywriting tools and unlock your
                  creative potential.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      AI-Powered Writing
                    </h3>
                    <p className="text-gray-600">
                      Generate high-quality copy with advanced AI tools tailored
                      for your industry.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Custom Templates
                    </h3>
                    <p className="text-gray-600">
                      Access hundreds of templates or create your own for
                      consistent brand messaging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Team Collaboration
                    </h3>
                    <p className="text-gray-600">
                      Work seamlessly with your team and manage projects from
                      one central dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Performance Analytics
                    </h3>
                    <p className="text-gray-600">
                      Track your content performance and optimize for better
                      results with detailed insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Free 14-day trial</span>
                  <span>•</span>
                  <span>No credit card required</span>
                  <span>•</span>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
