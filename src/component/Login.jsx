import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Data from "./Data";
import { message } from "antd";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showMessage = () => {
    message.success("Login Success!");
  };

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    showMessage();
    setIsLoggedIn(true);
  };

  const handleLoginError = () => {
    console.error("Login Failed");
    message.error("Login Failed!");
    setIsLoggedIn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-500 to-violet-500">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        {!isLoggedIn ? (
          <div className="p-8 bg-white shadow-lg rounded-2xl w-96">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
                alt="Google Logo"
                className="w-12 h-12 mb-3"
              />
              <h1 className="text-3xl font-bold text-gray-800">
                Sign in with Google
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Use your Google account to access the dashboard.
              </p>
            </div>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              className="mt-6"
            />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <a
                  href="https://example.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://example.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>

          </div>
        ) : (
          <Data />
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
