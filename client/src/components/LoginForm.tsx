import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function LoginForm({
  role,
  onResetPasswordClick,
}: {
  role: string;
  onResetPasswordClick: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      //   const response = await authService.login({ email, password, role });
      //   const data = response.data;
      //   if (data.role === "admin") {
      //     toast.success("Login successful!");
      //     router.push("/admin");
      //   } else {
      //     toast.success("Login successful!");
      //     router.push("/user/userDash");
      //   }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isDefaultPage = pathname === "/";
  const linkText = isDefaultPage ? "Admin Login" : "User Login";
  const linkHref = isDefaultPage ? "/admin-login" : "/";

  return (
    <form className="w-full pt-3" onSubmit={handleSubmit}>
      <Toaster position="top-center" />

      <div className="mb-4">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50/50"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative w-full">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50/50"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 outline-none flex items-center hover:opacity-70"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Image
              src={showPassword ? "/eye-on.png" : "/eye-off.png"}
              alt={showPassword ? "Hide password" : "Show password"}
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium mb-4">{error}</p>
      )}

      {/* <button
        type="submit"
        className={`w-full py-2.5 px-4 text-white border-none rounded-lg text-base font-medium mt-0 cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#7612fa] to-[#fa12e3] shadow-[0_2px_4px_rgba(46,204,113,0.2)] bg-[length:200%_auto] hover:transform hover:bg-gradient-to-l hover:from-[#fa12e3] hover:to-[#7612fa] hover:background-gradient-to-l active:transform active:translate-y-0 active:shadow-[0_2px_3px_rgba(46,204,113,0.2)] disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center`}
        disabled={isLoading}
      > */}
      <button
        type="submit"
        className={`w-full py-3 rounded-lg text-white font-medium text-base flex items-center justify-center tracking-wider cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed bg-primary-purble-600 hover:bg-primary-purble-700`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          ></div>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="flex flex-row justify-between items-center gap-2 mt-3">
        <Link
          href={linkHref}
          className="text-black no-underline text-xs font-medium transition-all duration-200 hover:underline"
        >
          {linkText}
        </Link>
        {/* {role === "user" ? ( */}
        <span
          onClick={onResetPasswordClick}
          className="text-blue-600 no-underline text-xs font-medium transition-all duration-200 hover:underline cursor-pointer"
        >
          Reset Password
        </span>
        {/* ) : (
          <a
            href="https://reset.industryrockstar.ai/"
            className="text-blue-600 no-underline text-xs font-medium transition-all duration-200 hover:underline cursor-pointer"
          >
            Reset Password
          </a>
        )} */}
      </div>
    </form>
  );
}

export default LoginForm;
