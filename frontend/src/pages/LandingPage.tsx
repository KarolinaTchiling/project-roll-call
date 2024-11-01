import React from 'react';
import '../LandingPage.css'; 
import rollcall_logo from "../assets/rollcall_logo.png";

const roll= " Roll "

const LandingPage = () => {
  return (
      <>
        <div className="header-text">
        <span>Welcome to </span>
        <span className="header-text-bold">Roll Call</span>
        </div>

        <div className="paragraph">
        Your Personal Daily Brief — Transforming Your Google
        </div>
        
        <div className="paragraph">
        Calendar into Clarity. 
          <span className="paragraph-bold">
          {roll}
          </span> 
        into Your Day with Confidence.
        </div>

        <div className="image-container">
          <img src={rollcall_logo} alt="" />
        </div>

        <div className="blue-rectangle">
        <div className="w-[589px] h-[1117px] bg-[#13617c]" />
        </div>

        
      </>
  );
}

export default LandingPage;
