import React, { useState, useReducer } from "react"
import { Link } from "gatsby"
import { Logo } from "../utils/imgImport"
import NavDropdownMenu from "./NavDropdownMenu"

// const menus = [
//   {
//     name: "PRODUCTS",
//   },
//   {
//     name: "Aplications",
//   },
//   {
//     name: "videos",
//   },
//   {
//     name: "downloads",
//   },
//   {
//     name: "Company",
//   },
// ]

const Header = () => {
  const [hambugerActive, setHambugerActiveState] = useState(false)
  const [state, setState] = useReducer(
    (old, action) => ({ ...old, ...action }),
    {
      productMenu: false,
    }
  )
  const { productMenu } = state

  const hamburgerHandler = () => {
    setHambugerActiveState(!hambugerActive)
  }

  let humbugerClsName = "hamburger my-auto "
  let navMenuClsName = "navbar-nav "

  if (hambugerActive) {
    humbugerClsName += "active"
    navMenuClsName += "active"
  }
  const ProductMenuHover = () => {
    setState({ productMenu: false })
  }
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={Logo} alt="logo" />
          </Link>
          <ul className={navMenuClsName}>
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setState({ productMenu: true })}
              onKeyDown={() => setState({ productMenu: true })}
              role="presentation"
            >
              <a href="#menu" className="nav-link">
                Products
              </a>
              <NavDropdownMenu
                hover={productMenu}
                onProductMenu={ProductMenuHover}
              />
            </li>
            <li className="nav-item">
              <a href="#menu" className="nav-link">
                Applications
              </a>
            </li>
            <li className="nav-item">
              <a href="#menu" className="nav-link">
                Videos
              </a>
            </li>
            <li className="nav-item">
              <a href="#menu" className="nav-link">
                Downloads
              </a>
            </li>
            <li className="nav-item">
              <a href="#menu" className="nav-link">
                Company
              </a>
            </li>
          </ul>
          <button className="btn-primary btn-login">Login</button>
          <div
            className={humbugerClsName}
            onClick={hamburgerHandler}
            onKeyDown={hamburgerHandler}
            role="button"
            tabIndex="0"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
