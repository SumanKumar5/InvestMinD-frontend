import { useEffect } from "react";
import toast from "react-hot-toast";
import { loginWithGoogle } from "../services/api";

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "filled_black",
        size: "large",
        width: "100%",
        shape: "pill",
        logo_alignment: "center",
      }
    );
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;

    try {
      const { token, user } = await loginWithGoogle(idToken);
      localStorage.setItem("investmind_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/portfolio";
    } catch {
      localStorage.removeItem("investmind_token");
      localStorage.removeItem("user");
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } toast-error max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
          >
            <div className="flex-shrink-0 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100">
                Google Sign-In failed. Please try again.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ),
        { duration: 1000 }
      );
    }
  };

  return (
    <div id="googleSignInDiv" className="w-full flex justify-center mt-4"></div>
  );
};

export default GoogleLoginButton;
