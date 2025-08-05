import React, { useState } from "react";
import "./TermsAndConditionsForm.css";
import { FaClipboard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const TermsConditions = () => {
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  const modelName = decodedToken.userType;

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleAccept = () => {
    setAcceptedTerms(true);
    setFormSubmitted(true);
    alert("Form submitted. Terms accepted!");
  };

  const handleDecline = () => {
    setAcceptedTerms(false);
    alert("You must accept the terms to continue.");
  };

  const getLinkPath = () => {
    return modelName === "Seller" || modelName === "Tourist"
      ? `/${modelName}/products`
      : `/${modelName}/${id}`;
  };

  return (
    <div className="flex_center">
      <div className="tc_main">
        <div className="tc_content">
          <div className="tc_top">
            <div className="icon">
              <FaClipboard />
            </div>
            <div className="title">
              <p>Terms of Service</p>
            </div>
            <div className="info">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi sint
              veritatis recusandae alias. Numquam voluptates inventore eligendi
              totam tempore quia et enim accusantium labore at autem unde
              quibusdam molestiae doloremque corrupti architecto blanditiis
              corporis ex quisquam quo, deleniti pariatur? Illo, cum.
              Dignissimos provident quod ducimus aperiam sunt expedita odit
              laboriosam!
            </div>
          </div>
          <div className="tc_bottom">
            <div className="title">
              <p>Please go through the terms before accepting them.</p>
            </div>
            <div className="info">
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            </div>
          </div>
        </div>
        <div className="tc_btns">
          <Link to={getLinkPath()} state={{ id }}>
            <button
              className={`accept ${acceptedTerms ? "active" : ""}`}
              onClick={handleAccept}
            >
              Accept
            </button>
          </Link>
          <button className="decline" onClick={handleDecline}>Decline</button>
        </div>
        {formSubmitted && <p className="confirmation-message">Thank you! Your acceptance has been recorded.</p>}
      </div>
    </div>
  );
};

export default TermsConditions;
