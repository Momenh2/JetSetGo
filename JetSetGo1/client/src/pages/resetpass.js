import React, { useState } from "react";
import styled from "styled-components";
import {jwt_decode} from "jwt-decode"; // Correct import for jwt-decode
import { jwtDecode } from "jwt-decode"; // Corrected import

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

// Styled components for the form
const ChangePasswordContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0px 0px 5px rgba(76, 175, 80, 0.5);
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background-color: #45a049;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 10px;
  font-size: 14px;
`;

const ResetPassword = () => { // Component name now starts with uppercase
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token); // Decode the token
      const userId = decodedToken.id; // Extract the user ID from the token payload

      const response = await fetch("http://localhost:8000/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId, // Include the ID from the decoded token
          newPassword, // Use the state variable
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password. Please try again.");
      }

      setSuccess("Password changed successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <ChangePasswordContainer>
      <Title>Change Password</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <FormContainer onSubmit={handleSubmit}>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          type="password1"
          id="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          type="password1"
          id="confirmPassword"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <SubmitButton type="submit">Change Password</SubmitButton>
      </FormContainer>
    </ChangePasswordContainer>
  );
};

export default ResetPassword; // Ensure default export matches the uppercase name
