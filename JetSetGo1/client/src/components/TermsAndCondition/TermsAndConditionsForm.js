import React from "react";
import "./TermsAndConditionsForm.css";
import { FaClipboard } from "react-icons/fa"; // Import the icon from react-icons

const TermsConditions = ({ onAccept, onDecline }) => {
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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi sint
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
          <button className="accept" onClick={onAccept}>Accept</button>
          <button className="decline" onClick={onDecline}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
