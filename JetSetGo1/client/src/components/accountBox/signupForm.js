import React, { useState, useContext ,useEffect} from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import { io } from "socket.io-client";  // Import socket.io-clients
import Cookies from "js-cookie"; // Import js-cookie
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  SubmitButton,
  
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const { switchToSignin } = useContext(AccountContext);
  const options = [
    { value: 'Tourist', label: 'Tourist' },
    { value: 'Advertiser', label: 'Advertiser' },
    { value: 'Seller', label: 'Seller' },
    { value: 'TourGuide', label: 'Tour Guide' },
  ];

  // New job options for the dropdown
  const jobOptions = [
    { value: 'student', label: 'Student' },
    { value: 'employee', label: 'Employee' },
    { value: 'unemployed', label: 'Unemployed' }
  ];

  
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      // Only initialize socket if it's not already initialized
      const newSocket = io("http://localhost:8000");
      setSocket(newSocket);
      console.log("Socket connected from register:", newSocket);

      // Cleanup socket connection only when the component unmounts
      return () => {
        if (newSocket) {
          newSocket.disconnect();  // Disconnect when the component unmounts
          console.log('Socket disconnected from register');
        }
      };
    }
  }, []);
  // Static list of countries (you can replace it with a dynamic API or a more complete list)
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'IN', label: 'India' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'BR', label: 'Brazil' },
    { value: 'JP', label: 'Japan' },
    { value: 'MX', label: 'Mexico' },
    { value: 'CN', label: 'China' },
    { value: 'RU', label: 'Russia' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'KR', label: 'South Korea' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'EG', label: 'Egypt' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'KE', label: 'Kenya' },
    { value: 'PH', label: 'Philippines' },
    { value: 'TH', label: 'Thailand' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'AR', label: 'Argentina' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colombia' },
    { value: 'PE', label: 'Peru' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'TR', label: 'Turkey' },
    { value: 'SE', label: 'Sweden' },
    { value: 'NO', label: 'Norway' },
    { value: 'FI', label: 'Finland' },
    { value: 'DK', label: 'Denmark' },
    { value: 'PL', label: 'Poland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'AT', label: 'Austria' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'BE', label: 'Belgium' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'GR', label: 'Greece' },
    { value: 'CZ', label: 'Czech Republic' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'HU', label: 'Hungary' },
    { value: 'RO', label: 'Romania' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'HR', label: 'Croatia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'BA', label: 'Bosnia and Herzegovina' },
    { value: 'RS', label: 'Serbia' },
    { value: 'MK', label: 'North Macedonia' },
    { value: 'AL', label: 'Albania' },
    { value: 'ME', label: 'Montenegro' },
    { value: 'AM', label: 'Armenia' },
    { value: 'AZ', label: 'Azerbaijan' },
    { value: 'BY', label: 'Belarus' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'MD', label: 'Moldova' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LV', label: 'Latvia' },
    { value: 'EE', label: 'Estonia' },
    { value: 'IS', label: 'Iceland' },
    { value: 'MT', label: 'Malta' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'FO', label: 'Faroe Islands' },
    { value: 'IM', label: 'Isle of Man' },
    { value: 'JE', label: 'Jersey' },
    { value: 'GG', label: 'Guernsey' },
  ];
  
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [showFields, setShowFields] = useState({
    username: true,
    email: true,
    password: true,
    mobile: true,
    nationality: true,
    dob: true,
    job: true,
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    nationality: '',
    dob: '',
    job: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    nationality: '',
    dob: '',
    job: ''
  });
  const validateForm = () => {
  const newErrorMessages = { ...errorMessages };

  // Check for empty fields and add error message
  if (!formData.username) newErrorMessages.username = 'Please fill out this field!';
  if (!formData.email) newErrorMessages.email = 'Please fill out this field!';
  if (!formData.password) newErrorMessages.password = 'Please fill out this field!';
  if (showFields.mobile && !formData.mobile) newErrorMessages.mobile = 'Please fill out this field!';
  if (showFields.nationality && !formData.nationality) newErrorMessages.nationality = 'Please select a nationality!';
  if (showFields.dob && !formData.dob) newErrorMessages.dob = 'Please fill out this field!';
  if (showFields.job && !formData.job) newErrorMessages.job = 'Please fill out this field!';

  // Update the error state
  setErrorMessages(newErrorMessages);

  // Return if the form is valid (no error messages)
  return Object.values(newErrorMessages).every((message) => !message);
};

  
  const [files, setFiles] = useState({ doc1: null, doc2: null });
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (!formData.hasOwnProperty(name)) {
      console.warn(`Invalid input name: ${name}`);
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, docKey) => {
    const selectedFile = e.target.files[0];
    setFiles(prevFiles => ({ ...prevFiles, [docKey]: selectedFile }));
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFiles({ doc1: null, doc2: null });

    switch (selectedOption.value) {
      case 'Tourist':
        setShowFields({
          username: true,
          email: true,
          password: true,
          mobile: true,
          nationality: true,
          dob: true,
          job: true
        });
        break;
      default:
        setShowFields({
          username: true,
          email: true,
          password: true,
          mobile: false,
          nationality: false,
          dob: false,
          job: false,
        });
        break;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const allowedFields = Object.entries(showFields)
      .filter(([key]) => showFields[key])
      .map(([key]) => key);

    const data = {};
    for (const field of allowedFields) {
      data[field] = formData[field] || '';
    }

    try {
      let response;

      if (selectedOption.value === 'Tourist') {
        response = await axios.post(
          `http://localhost:8000/api/register/registerTourist`,
          data,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        const formDataObj = new FormData();
        Object.keys(data).forEach((key) => {
          formDataObj.append(key, data[key]);
        });

        if (files.doc1) formDataObj.append('documents', files.doc1);
        if (files.doc2) formDataObj.append('documents', files.doc2);

        response = await axios.post(
          `http://localhost:8000/api/register/register${selectedOption.value}`,
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      }

      if (response.status === 201 && response.data.token) {
        const { token } = response.data;

        // Save the token in cookies
        Cookies.set('auth_token', token, { expires: 7 });

        // Decode token to get user details
        const decodedToken = jwtDecode(token);
        const { id, userType } = decodedToken;

        const socket = io("http://localhost:8000"); // Make sure socket is initialized here or in App.js
        socket.emit("register", { userId: id });

        console.log("da el model name",userType )
        // Redirect based on user type
        let modelName;
        if (userType === 'Advertisers') {
          modelName = 'advertiser';
        } else if (userType === 'Seller') {
          modelName = 'sellers';
        } else if (userType === 'Tourist') {
          modelName = 'tourist';
        } else if (userType === 'TourGuide') {
          modelName = 'tourguide';
          console.log("ana fe3lan areet el tourguide")
        } else {
          throw new Error('Invalid user role');
        }

        navigate(`/${modelName}/${id}/terms`);
      } else {
        alert('Registration failed: No token received.');
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  const renderFileInput = (docKey, label) => (
    <div>
      <label htmlFor={`doc${docKey}`} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={`doc${docKey}`}
        type="file"
        accept=".pdf,.jpeg,.jpg"
        onChange={(e) => handleFileChange(e, docKey)}
        className="mt-1 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
    </div>
  );

  return (
    <BoxContainer>
      <FormContainer>
        <div>
        <label>Role:</label>
        <Select
          options={options}
          value={selectedOption}
          placeholder="Role"
          onChange={handleChange}
          required // Ensures the user selects a role
        />
        </div>
        {showFields.username && (
          <Input
            type="text"
            name="username"
            placeholder="User name"
            onChange={handleInputChange}
            value={formData.username}
            required // Adds validation for this field
          />
        )}
        
        {showFields.email && (
          <Input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            value={formData.email}
            required
          />
        )}
        
        {showFields.password && (
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            value={formData.password}
            required
          />
        )}
        
        {showFields.mobile && (
          <Input
            type="tel"
            name="mobile"
            placeholder="Mobile number"
            onChange={handleInputChange}
            value={formData.mobile}
            required
          />
        )}
        
        {/* Nationality dropdown */}
        {showFields.nationality && (
          <>
            {/* <label>Nationality</label> */}
            <Select
              options={countryOptions}
              value={countryOptions.find(option => option.value === formData.nationality)}
              placeholder="Nationality"
              onChange={(selected) => setFormData({ ...formData, nationality: selected.value })}
              required // Adds validation for nationality selection
            />
          </>
        )}
        <div>
        {showFields.dob && <label htmlFor="dob">Date of Birth:</label>}
        {showFields.dob && (
          <Input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            onChange={handleInputChange}
            value={formData.dob}
            required
          />
        )}
        </div>
        {showFields.job && (
          <>
            {/* <label>Job Status:</label> */}
            <Select
              options={jobOptions}
              onChange={(selected) => setFormData({ ...formData, job: selected.value })}
              placeholder = "Job Status"
              value={jobOptions.find(option => option.value === formData.job)}
              required // Ensures job selection is mandatory
            />
          </>
        )}
        
        {/* Conditional fields for certain roles */}
        {['Advertiser', 'Seller', 'TourGuide'].includes(selectedOption.value) && (
          <>
            {renderFileInput('doc1', 'Upload ID')}
            {renderFileInput(
              'doc2',
              selectedOption.value === 'TourGuide' ? 'Upload Certificates' : 'Upload Taxation Registry Card'
            )}
          </>
        )}
      </FormContainer>
      
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <Marginer direction="vertical" margin={10} />
      <SubmitButton onClick={handleSubmit} type="submit">Signup</SubmitButton>
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Already have an account?{" "}
        <BoldLink onClick={switchToSignin} href="#">
          Signin
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
  
}

export { SignupForm };
