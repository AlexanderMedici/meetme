const Footer = () => {
  const currrentYear = new Date().getFullYear();
  return (
    <footer className="footer-shell">
      <div className="footer-inner">
        <span className="footer-text">MeetMe © {currrentYear}</span>
      </div>
    </footer>
  );
};

export default Footer;
