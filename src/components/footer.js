import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"

const menus = [
  {
    submenu: "Products",
    menu: ["TEMA", "TrackEye", "DIC", "Scanner"],
  },
  {
    submenu: "Applications",
    menu: [],
  },
  {
    submenu: "Videos",
    menu: ["Tutorials"],
  },
  {
    submenu: "Downloads & Support",
    menu: ["Downloads"],
  },
  {
    submenu: "Documents",
    menu: ["Brochures", "Release Notes", "How To", "FAQ"],
  },
  {
    submenu: "Login/Register",
    menu: ["Log In", "Customer Register", "Partner register"],
  },
  {
    submenu: "Company",
    menu: [
      "About",
      "Customer Survey",
      "Contact Us",
      "Career",
      "ImageSystems Group",
      "News",
    ],
  },
  {
    submenu: "Investors",
    menu: [],
  },
]
const socials = [
  {
    name: "Twitter",
    icon: faTwitter,
    href: "https://twitter.com/",
  },
  {
    name: "Facebook",
    icon: faFacebook,
    href: "https://facebook.com/",
  },
  {
    name: "Instagram",
    icon: faInstagram,
    href: "https://instagram.com/",
  },
  { name: "Youtube", icon: faYoutube, href: "https://youtube.com/" },
]
const contacts = [
  {
    name: "info@email.com",
    href: "mailto:info@email.com",
  },
  {
    name: "sales@email.com",
    href: "mailto:sales@email.com",
  },
  {
    name: "support@email.com",
    href: "mailto:support@email.com",
  },
]

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <nav className="footer-nav">
          <div className="row d-flex justify-content-between flex-wrap">
            {menus.map((item, idx) => (
              <div className="menu-list" key={idx}>
                <p className="menu-type">{item.submenu}</p>
                <ul>
                  {item.menu.length !== 0 &&
                    item.menu.map((menu, index) => (
                      <li key={index}>
                        <Link to="#menu">{menu}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
        <div className="bottom-bar">
          <div className="d-flex align-items-center flex-wrap mb-5">
            <p className="contact-label">Follow us</p>
            <ul className="follow-us">
              {socials.map((item, idx) => (
                <li className="d-flex justify-content-center" key={idx}>
                  <a href={item.href} className="text-center">
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="2x"
                      color="#5A5A5A"
                    />
                    <p className="social-name">{item.name}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="d-flex align-items-center  flex-wrap">
            <p className="contact-label">Contact us</p>
            <ul className="contact-mail">
              {contacts.map((item, idx) => (
                <li className="me-3" key={idx}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="contact-phone my-4">
            <div className="d-flex align-items-center flex-wrap me-4">
              <p className="contact-label">General Contact:</p>
              <a href="tel:1-888-225-7579">1-888-225-7579</a>
            </div>
            <div className="d-flex align-items-center flex-wrap">
              <p className="contact-label">Customer Support:</p>
              <a href="tel: 1-888-225-7579">1-888-225-7579 ext 5</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
