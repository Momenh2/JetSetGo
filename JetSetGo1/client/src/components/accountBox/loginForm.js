import React, { useContext, useState,useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie
import { jwtDecode } from "jwt-decode"; // Fix import name
import io from "socket.io-client"; // Import socket.io-client 
import NotificationComponent from '../../components/Notifications'; // Import the modified notification component

import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';
import { useNavigate } from 'react-router-dom'; // Add this import


export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  // State for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // ✅ New state for error messages


  // State for Forgot Password
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle view

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      // Only initialize socket if it's not already initialized
      const newSocket = io("http://localhost:8000");
      setSocket(newSocket);
      console.log("Socket connected:", newSocket);

      // Cleanup socket connection only when the component unmounts
      return () => {
        if (newSocket) {
          newSocket.disconnect();  // Disconnect when the component unmounts
          console.log('Socket disconnected');
        }
      };
    }
  }, []);
  // Login handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous errors
  
    if (!email || !password) {
      setLoginError("⚠️ Please enter both username and password.");
      return;
    }
  
    fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("❌ Invalid username or password.");
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          Cookies.set("auth_token", data.token, { expires: 7 });
          const decodedToken = jwtDecode(data.token);
          const { id, userType } = decodedToken;
  
          socket.emit("register", { userId: id });
  
          let modelName;    
          if (userType === 'Advertisers') {
            modelName = 'advertisers';
            navigate(`/Advertisers/${id}/ActivitiesMainPage/${id}`);
          } else if (userType === 'Seller') {
            modelName = 'sellers';
            navigate(`/Seller/products`);
          } else if (userType === 'Tourist') {
            modelName = 'tourist';
            navigate(`/${modelName}/home`);
          } else if (userType === 'TourGuide') {
            modelName = 'tourguide';
            navigate(`/${modelName}/${id}`);
          } else if (userType === 'Admin') {
            modelName = 'admin';
            navigate(`/${modelName}/products`);
          } else if (userType === 'TourismGoverner') {
            modelName = 'tourism_governer';
            navigate(`/${modelName}`);
          } else {
            throw new Error('Invalid user role');
          }
        } else {
          setLoginError("⚠️ Login failed. No token received.");
        }
      })
      .catch(error => {
        setLoginError(error.message);
      });
  };
  

  // Forgot Password handler
  const handleForgotPassword = async () => {
    setForgotPasswordMessage("");
    try {
      const emailResponse = await fetch('http://localhost:8000/user/getmail', {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: forgotUsername }), 
      });
      if (!emailResponse.ok) {
        throw new Error("Failed to fetch email for username");
      }

      const emailData = await emailResponse.json();
      const userEmail = emailData.email;
      setForgotPasswordMessage(`Password reset email sent to ${userEmail}.`);
    } catch (error) {
      setForgotPasswordMessage(error.message || "Error during password reset process.");
    }
  };

  return (
    <BoxContainer>
      {!isForgotPassword ? (
        <>
          <FormContainer>
            <Input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormContainer>
          {loginError && <p className="errore-message">{loginError}</p>} {/* ✅ Show error here */}
          <Marginer direction="vertical" margin={10} />
          <MutedLink href="#" onClick={() => setIsForgotPassword(true)}>
            Forget your password?
          </MutedLink>
          <Marginer direction="vertical" margin="1.6em" />
          <SubmitButton type="submit" onClick={handleSubmit}>
            Signin
          </SubmitButton>
          {/* Only show the NotificationComponent if logged in */}
          
          <Marginer direction="vertical" margin="5px" />
          <LineText>
            Don't have an account?{" "}
            <BoldLink onClick={switchToSignup} href="#">
              Signup
            </BoldLink>
          </LineText>
        </>
      ) : (
        <>
          <FormContainer>
            <Input
              type="text"
              placeholder="Enter your username"
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
            />
          </FormContainer>
          <Marginer direction="vertical" margin="10px" />
          <SubmitButton onClick={handleForgotPassword}>
            Send Reset Email
          </SubmitButton>
          {forgotPasswordMessage && (
            <div style={{ marginTop: "10px", color: forgotPasswordMessage.includes("sent") ? "green" : "red" }}>
              {forgotPasswordMessage}
            </div>
          )}
          <Marginer direction="vertical" margin="10px" />
          <MutedLink href="#" onClick={() => setIsForgotPassword(false)}>
            Back to Login
          </MutedLink>
        </>
      )}
    </BoxContainer>
  );
}
