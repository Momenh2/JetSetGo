import { React, useState } from 'react';
import styled from 'styled-components';
import { LoginForm } from './loginForm.js';
import { motion } from 'framer-motion';
import { AccountContext } from './accountContext.js';

const { SignupForm } = require('../accountBox/signupForm');

const BoxContainer = styled.div`
  width: 400px; /* Increased width */
  min-height: 700px; /* Increased height */
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 380px; /* Increased height */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 2.5em; /* Adjusted padding */
  padding-bottom: 5em;
`;
const BackDrop = styled(motion.div)`
  position: absolute;
  width: 170%;
  height: 700px; /* Adjusted height for larger box */
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  top: -320px;
  left: -80px;
  transform: rotate(60deg);
  background: linear-gradient(135deg, #0073b1, #005582); /* Updated gradient background */
`;
const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.div`
  font-size: 36px; /* Increased font size */
  font-weight: 700;
  line-height: 1.4;
  color: #fff;
  z-index: 10;
`;

const SmallText = styled.div`
  font-size: 14px; /* Increased font size */
  font-weight: 500;
  color: #fff;
  margin-top: 7px;
  z-index: 10;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 30px; /* Adjusted padding for larger box */
`;

const backdropVariants = {
  expanded: {
    width: "250%",
    height: "1100px",
    borderRadius: "20%",
    transform: "rotate(60deg)"
  },
  collapsed: {
    width: "170%",
    height: "700px",
    borderRadius: "50%",
    transform: "rotate(60deg)"
  }
};

const expandingTransition = {
  type: "spring",
  duration: 2.3,
  stiffness: 30,
};

export default function AccountBox(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState('signin');

  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  };

  const switchToSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 400);
  };

  const switchToSignin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 400);
  };

  const contextValue = { switchToSignup, switchToSignin };
  
  return (
    <AccountContext.Provider value={contextValue}>
      <BoxContainer>
        <TopContainer>
          <BackDrop 
            initial={false}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={backdropVariants}
            transition={expandingTransition}
          />
          {active === "signin" && <HeaderContainer>
            <HeaderText>Welcome</HeaderText>
            <HeaderText>Back</HeaderText>
            <SmallText>Please sign-in to continue!</SmallText>
          </HeaderContainer>}
          {active === "signup" && <HeaderContainer>
            <HeaderText>Create</HeaderText>
            <HeaderText>Account</HeaderText>
            <SmallText>Please sign-up to continue!</SmallText>
          </HeaderContainer>}
        </TopContainer>
        <InnerContainer>
          {active === "signin" && <LoginForm />}
          {active === "signup" && <SignupForm />}
        </InnerContainer>
      </BoxContainer>
    </AccountContext.Provider>  
  );
}
