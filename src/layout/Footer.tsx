import LogoContrast from "../../assets/logos/logo-contrast.svg";
import SocialLinks from "../../assets/images/social-links.svg";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="mainLinkContainer">
        <img src={LogoContrast} alt="Logo" style={{ maxWidth: "133px" }} />
        <ul className="navLinkList">
          <li>
            <a>Services</a>
          </li>
          <li>
            <a>Pricing</a>
          </li>
          <li>
            <a>Contact Us</a>
          </li>
          <li>
            <a>FAQ</a>
          </li>
          <li>
            <a>Terms</a>
          </li>
        </ul>
        <img
          src={SocialLinks}
          alt="Social Links"
          style={{ maxWidth: "168px" }}
        />
      </div>
      <div className="bottomContainer">
        <div className="divider"></div>
        <ul>
          <li>
            <a>© 2024. All rights reserved.</a>
          </li>
          <li>
            <a>Privacy Policy</a>
          </li>
          <li>
            <a>Terms of Service</a>
          </li>
          <li>
            <a>Cookie Settings</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
