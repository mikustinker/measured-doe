import React from "react"
import { Link } from "gatsby"
import { Scanner } from "../utils/imgImport"

const temas = [
  {
    img: Scanner,
    type: "Classic",
  },
  {
    img: Scanner,
    type: "Pro",
  },
]

const NavDropdownMenu = ({ onProductMenu, hover }) => {
  console.log(hover)
  return (
    <div
      className={`dropdown-content ${!hover && "d-none"}`}
      onMouseLeave={() => onProductMenu()}
      onKeyDown={() => onProductMenu()}
      role="presentation"
    >
      <div className="container">
        <div className="dropmenu row">
          <ul className="dropmenu-nav col-3">
            <li className="dropmenu-link active">
              <Link to="/">TEMA</Link>
            </li>
            <li className="dropmenu-link">
              <Link to="/">TRACKEYE</Link>
            </li>
            <li className="dropmenu-link">
              <Link to="/">DIC</Link>
            </li>
            <li className="dropmenu-link">
              <Link to="/">SCANNER</Link>
            </li>
          </ul>
          <div className="dropmenu-content col-9">
            <p>
              TEMA Classic is the market-leading software suite for advanced
              Motion Analysis tests. Thanks to its high accuracy, modular
              structure, calculation speed and intuitive user interface – TEMA
              Classic is used by professionals across the globe in a wide range
              of Motion Analysis applications.
            </p>
            <ul className="submenu">
              {temas.map((item, idx) => (
                <li key={idx}>
                  <Link to="/">
                    <img className="submenu-img" src={item.img} alt="product" />
                    <p className="submenu-name">{item.type}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavDropdownMenu
