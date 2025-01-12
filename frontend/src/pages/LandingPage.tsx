import { useState, useEffect } from "react";
import "../LandingPage.css";
import RollCallIcon from "../assets/RollCallIcon.png";
import GoogleLogo from "../assets/googleLogo.svg";
import Loader from "../components/Loader.tsx";

const roll = " Roll ";

const LandingPage = () => {
  const [serverMessage, setServerMessage] = useState("Connecting to the server... This may take a moment.");
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);


  const login = async () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/login`;
  };

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/test`);
        if (response.ok) {
          setServerMessage("Server connected! Ready to get started with RollCall.");
          setButtonDisabled(false);
        } else {
          setServerMessage("Unable to connect to the server. Please try again later.");
        }
      } catch (error) {
        setServerMessage("Connection error. Please check your internet connection or try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  return (
    <div className="flex w-full">
      {/* Left Container */}
      <div className="container-left">
        <div className="header-text">
          <span>Welcome to </span>
          <span className="header-text-bold">Roll Call</span>
        </div>
        <div className="paragraph">
          Your Personal Daily Brief — Transforming Your Google
        </div>
        <div className="paragraph">
          Calendar into Clarity.
          <span className="paragraph-bold">{roll}</span>
          into Your Day with Confidence.
        </div>
        <div className="rollcall-logo-image-container">
          <img src={RollCallIcon} alt="RollCall Logo" />
        </div>
      </div>

      {/* Right Container */}
      <div className="container-right">
        {/* Introduction */}
        <div className="paragraph3 mx-5">
          RollCall is a web app I developed that generates a personalized roll-call report based on your Google Calendar.
            <ul className="text-left list-disc px-8 pt-2 text-sm">
                      <li><strong>Smart Scheduling:</strong> Prioritize your schedule by highlighting important events and tasks.</li>
                      <li><strong>Custom Reports:</strong> Receive tailored to-do lists based on your calendar data.</li>
                      <li><strong>Tech Stack:</strong> Built with React, Flask, MongoDB, and Google Calendar API integration. Deployed with Render + Vercel.</li>
            </ul>
        </div>
        <div className="text-center mt-4">
        <a
          href="https://github.com/KarolinaTchiling/project-roll-call"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline"
        >
          View the RollCall source code on GitHub
        </a>
      </div>


        {/* Testing Stage and Demo Credentials */}
        <div className="paragraph2 mx-5 mt-4">
          Since this web app is currently in the testing stage for Google's OAuth, Google Accounts are restricted.
          To see a demo, please log in with the test user credentials:
          <br />
          <br />
          <strong>Email:</strong> rachels.rollcall@gmail.com
          <br />
          <strong>Password:</strong> eecs3311
        </div>

        {/* Call-to-Action */}
        <div className="login-text mt-7 pb-3">Ready for your roll call?</div>

        {/* Login Button */}
        <button
          onClick={login}
          className={`log-in ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={buttonDisabled}
        >
          <img src={GoogleLogo} alt="Google Login" />
        </button>

        {/* Loader */}
        {loading && (
          <div className="flex items-center justify-center mt-4">
            <Loader />
          </div>
        )}

        {/* Server Connection Status */}
          <div className="paragraph2 mx-5 mt-4">
          <span className={serverMessage.includes("connected") ? "text-green-500" : "text-red-500"}>
            {serverMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
