import styled from 'styled-components';

export const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  gap:20px;
  flex-direction: column;
`;


export const MutedLink = styled.a`
  font-size: 12px;
  color: rgba(150, 150, 150, 0.8);
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px dashed rgba(150, 150, 150, 0.8);
`;

export const BoldLink = styled.a`
  font-size: 12px;
  color: #0073b1; /* Gradient blue color */
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px dashed #0073b1; /* Blue dashed underline */
`;


export const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  border: 1px solid rgba(150, 150, 150, 0.3); /* Light gray border */
  border-radius: 5px;
  padding: 0px 10px;
  transition: all 200ms ease-in-out;


  &::placeholder {
    color: rgba(150, 150, 150, 1); /* Gray placeholder */
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid #0073b1; /* Blue border on focus */
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 150px;
  padding: 10px;
  color: white; /* White text */
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 240ms ease-in-out;
  background: linear-gradient(135deg, #0073b1, #005582); /* Gradient background */

  &:hover {
    filter: brightness(0.9); /* Slight darkening effect */
  }
`;

export const LineText = styled.p`
  font-size: 12px;
  color: rgba(150, 150, 150, 0.8); /* Light gray text */
  font-weight: 500;
`;
