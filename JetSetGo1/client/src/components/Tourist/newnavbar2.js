import React from 'react';
// import './App2.css';

const Menu = () => (
  <nav id="menu">
    <div className="menu-item">
      <div className="menu-text"><a href="#">Products</a></div>
      <div className="sub-menu">
        {[
          { icon: "fal fa-wind-turbine", title: "Turbo Editor", sub: "Edit your code while slowing down time." },
          { icon: "fal fa-lightbulb-on", title: "Idea Creator", sub: "Think of an idea, and have an AI create it." },
          { icon: "fal fa-bomb", title: "Super Collider", sub: "Remove mass from any object." },
        ].map((item, i) => (
          <div className="icon-box" key={i}>
            <div className="icon"><i className={item.icon}></i></div>
            <div className="text">
              <div className="title">{item.title} <i className="far fa-arrow-right"></i></div>
              <div className="sub-text">{item.sub}</div>
            </div>
          </div>
        ))}
        <div className="sub-menu-holder"></div>
      </div>
    </div>
    <div className="menu-item highlight">
      <div className="menu-text"><a href="#">Services</a></div>
      <div className="sub-menu double">
        {[
          { icon: "far fa-question-circle", title: "Consult", sub: "From Professionals" },
          { icon: "far fa-users-class", title: "Teach", sub: "In Classroom" },
          { icon: "far fa-school", title: "Learn", sub: "By Video" },
          { icon: "far fa-chess-rook", title: "Keep", sub: "The Castle" },
          { icon: "far fa-video-plus", title: "Become", sub: "A Creator" },
          { icon: "far fa-cat", title: "Understand", sub: "Our Journey" },
        ].map((item, i) => (
          <div className={`icon-box gb ${String.fromCharCode(97 + i)}`} key={i}>
            <div className="icon"><i className={item.icon}></i></div>
            <div className="text">
              <div className="title">{item.title} <i className="far fa-arrow-right"></i></div>
              <div className="sub-text">{item.sub}</div>
            </div>
          </div>
        ))}
        <div className="bottom-container">Ready to dive in? <a href="#">Get Started</a></div>
        <div className="sub-menu-holder"></div>
      </div>
    </div>
    {/* <div className="menu-item highlight">
      <div className="menu-text"><a href="#">Support</a></div>
      <div className="sub-menu triple">
        <div className="top-container gb c icon-box">
          <div className="icon big"><i className="far fa-book"></i></div>
          <div className="text">
            <div className="title">Where to start</div>
            <div className="sub-text">Find out where to begin below</div>
          </div>
        </div>
        <div className="box"><h3>Your Journey</h3>{["Get Started", "Learn the Basics", "Get Advanced", "Start Teaching"].map((text, i) => <a href="#" key={i}>{text}</a>)}</div>
        <div className="box"><h3>Your Tools</h3>{["Turbo Editor", "Time Stopper", "Brain Enhancer", "Network Maker"].map((text, i) => <a href="#" key={i}>{text}</a>)}</div>
        {[
          { icon: "fal fa-plug", title: "API Guide" },
          { icon: "fal fa-comments", title: "Support Line" },
          { icon: "fal fa-phone-volume", title: "Live Chat" },
          { icon: "fal fa-book-spells", title: "Documentation" },
        ].map((item, i) => (
          <div className="icon-box flat" key={i}>
            <div className="icon"><i className={item.icon}></i></div>
            <div className="text">
              <div className="title">{item.title} <i className="far fa-arrow-right"></i></div>
            </div>
          </div>
        ))}
      </div>
    </div> */}
    <div className="menu-item">
      <div className="menu-text"><a href="#">Community</a></div>
      <div className="sub-menu">
        {[
          { icon: "far fa-satellite", title: "Forum", sub: "Join our passionate community." },
          { icon: "fab fa-twitter-square", title: "Twitter", sub: "Follow us on twitter." },
          { icon: "fab fa-twitch", title: "Live Stream", sub: "We stream content every day." },
        ].map((item, i) => (
          <div className="icon-box" key={i}>
            <div className="icon"><i className={item.icon}></i></div>
            <div className="text">
              <div className="title">{item.title} <i className="far fa-arrow-right"></i></div>
              <div className="sub-text">{item.sub}</div>
            </div>
          </div>
        ))}
        <div className="sub-menu-holder"></div>
      </div>
    </div>
    <div id="sub-menu-container"><div id="sub-menu-holder"><div id="sub-menu-bottom"></div></div></div>
  </nav>
);

export default Menu;
