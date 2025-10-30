import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="space-y-5">

            <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                    >
                        {showPassword ? (
                            <EyeOffIcon size={18} />
                        ) : (
                            <EyeIcon size={18} />
                        )}
                    </button>
                </div>
                <div className="text-right mt-1">
                    <a href="#" className="text-sm text-blue-500 hover:underline">
                        Forgot your password?
                    </a>
                </div>
            </div>


            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg py-2"
            >
                Login
            </button>

            <p className="text-center text-sm text-gray-400 mt-3">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">Register here.</Link>
            </p>

        </form>
    );
}
