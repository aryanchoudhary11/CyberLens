import LoginForm from "../Components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600/10 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.5l7.5 4.5v6l-7.5 4.5L4.5 15v-6L12 4.5z"
              />
            </svg>
          </div>
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          CyberLens
        </h2>
        <p className="text-center text-gray-400 mb-6">Log in to your account</p>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
