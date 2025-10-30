import { Link } from "react-router-dom";
export default function RegisterForm() {
    return (
        <form className="space-y-5">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <p className="text-xs text-gray-500">
                Your password must be at least 8 characters long and include a number,
                an uppercase letter, a lowercase letter, and a special character.
            </p>

            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="terms" className="accent-blue-600" />
                <label htmlFor="terms" className="text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </a>.
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg py-2"
            >
                Register
            </button>

            <p className="text-center text-sm text-gray-400 mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">Login.</Link>
            </p>

        </form>
    );
}
