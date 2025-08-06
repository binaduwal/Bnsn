"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/services/authApi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
const LoginForm: React.FC<{
  role: string;
  onResetPasswordClick: () => void;
}> = ({ role, onResetPasswordClick }) => {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      if (!email) {
        setError((prev) => ({ ...prev, email: "Email is required" }));
      }
      if (!password) {
        setError((prev) => ({ ...prev, password: "Password is required" }));
      }
      return;
    }

    setError({});

    try {
      setLoading(true);
      // Handle login logic here "kyraq@mailinator.com" "1234567890@Mm"

      const res = await loginApi({ email, password });
      console.log("Login submitted:", res);
      setAuth(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (error: any) {
      // toast.error(error.message);
      setError(p => ({ ...p, response: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error.response && (
        <div className="my-4 p-4 flex justify-center items-center bg-red-50 rounded-lg border border-red-200">
          <span className="font-semibold text-red-700">{error.response}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              type="email"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError((prev) => ({ ...prev, email: "" })) }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <small className="text-red-500">{error.email}</small>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError((prev) => ({ ...prev, password: "" })) }}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <small className="text-red-500">{error.password}</small>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          {/* <button
            type="button"
            onClick={onResetPasswordClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </button> */}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2 transition-colors"
        >
          {loading ? (
            <Loader className=" size-6 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Purple gradient pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.1),transparent_50%)]"></div>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
        {/* Left Side - Login Form */}
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
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your administrator account
              </p>
            </div>



            {/* Login Form */}
            <LoginForm role="admin" onResetPasswordClick={() => { }} />

            {/* Support Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">
                    Need help accessing your account?
                  </p>
                  <div className="space-y-1 text-blue-700">
                    <p>
                      • Check your email for login details (including spam
                      folder)
                    </p>
                    <p>• Use the "Forgot password?" option above</p>
                    <p>
                      • Contact support at{" "}
                      <a
                        href="mailto:support@aidistrictagents.com"
                        className="font-medium text-yellow-950 hover:underline"
                      >
                        support@aidistrictagents.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Features/Benefits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12 hidden lg:block">
          <div className="h-full flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  AI District Copywriting Admin Portal
                </h2>
                <p className="text-gray-600 text-lg">
                  Manage your AI-powered projects and blueprints with
                  enterprise-grade tools.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Project Management
                    </h3>
                    <p className="text-gray-600">
                      Create, organize, and track your AI projects with powerful
                      management tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Blueprint Templates
                    </h3>
                    <p className="text-gray-600">
                      Access pre-built templates and create custom blueprints
                      for your specific needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Analytics & Insights
                    </h3>
                    <p className="text-gray-600">
                      Monitor performance and gain valuable insights from your
                      AI-powered campaigns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Enterprise Security
                    </h3>
                    <p className="text-gray-600">
                      Your data is protected with enterprise-grade security and
                      compliance measures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Trusted by 10,000+ businesses</span>
                  <span>•</span>
                  <span>99.9% uptime</span>
                  <span>•</span>
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
