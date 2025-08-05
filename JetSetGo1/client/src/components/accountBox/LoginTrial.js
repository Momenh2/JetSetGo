import React, { useState } from 'react';
//import './loginForm.css'; // Make sure to import your CSS file here

const LoginForm1 = () => {
  const [showPassword, setShowPassword] = useState(false);
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="card_title">Login to your account</h1>
        <p className="card_title-info">Pen By Anna Batura</p>
        <form className="card_form">
          <div className="input">
            <input type="text" className="input_field" required />
            <label className="input_label">Full name</label>
          </div>
          <div className="input">
            <input type="email" className="input_field" required />
            <label className="input_label">Email</label>
          </div>
          <div className="input">
            <input
              type={showPassword ? "text" : "password"}
              className="input_field"
              required
            />
            <label className="input_label">Password</label>
            <span className="input_eye" onClick={togglePasswordVisibility}>
              <svg viewBox="0 0 146 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M143 37C143 45.4902 136.139 53.9606 123.263 60.487C110.554 66.9283 92.7879 71 73 71C53.2121 71 35.446 66.9283 22.7375 60.487C9.86096 53.9606 3 45.4902 3 37C3 28.5098 9.86096 20.0394 22.7375 13.513C35.446 7.07167 53.2121 3 73 3C92.7879 3 110.554 7.07167 123.263 13.513C136.139 20.0394 143 28.5098 143 37Z" strokeWidth="6" />
                <circle cx="73" cy="37" r="34" strokeWidth="6" />
              </svg>
            </span>
          </div>
          <button className="card_button">Get started</button>
        </form>
        <div className="card_info">
          <p>Not registered? <a href="#">Create an account</a></p>
        </div>
      </div>
      <div className="fish-shadow-con">
        <svg className="fish-shadow" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMin slice" viewBox="0 0 743 645">
          <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
            <path d="M177.367 337.568L182.709 357.739C198.517 417.421 249.748 460.995 311.193 467.019L421.508 477.834C478.237 483.396 532.831 454.649 560.346 404.729C607.09 319.923 557.549 214.182 462.47 195.822L375.079 178.946C368.369 177.651 361.766 175.854 355.324 173.572C251.651 136.837 149.205 231.245 177.367 337.568Z" className="line" id="Line" />
            <animateMotion dur="6s" begin="0s" repeatCount="indefinite" rotate="auto" fill="freeze">
              <mpath xlinkHref="#Line" />
            </animateMotion>
          </g>
        </svg>
      </div>
      <svg className="fish" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMin slice" viewBox="0 0 743 645">
        <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
          <path d="M177.367 337.568L182.709 357.739C198.517 417.421 249.748 460.995 311.193 467.019L421.508 477.834C478.237 483.396 532.831 454.649 560.346 404.729C607.09 319.923 557.549 214.182 462.47 195.822L375.079 178.946C368.369 177.651 361.766 175.854 355.324 173.572C251.651 136.837 149.205 231.245 177.367 337.568Z" className="line" id="Line" />
          <animateMotion dur="6s" begin="0s" repeatCount="indefinite" rotate="auto" fill="freeze">
            <mpath xlinkHref="#Line" />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
};

export default LoginForm1;
