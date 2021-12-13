import React from "react"
import { Link } from "gatsby"

const HeroSlide = ({ data }) => {
  return (
    <div className="position-relative hero-slides">
      <img
        src={data.background.localFile.url}
        alt="hero slide"
        className="hero-img"
      />
      <div className="hero-slide">
        <div className="row">
          <div className="col-md-7">
            <h1 className="hero-title">{data.title}</h1>
            <p className="hero-content">{data.content}</p>
            <Link
              className="btn-primary d-inline-block"
              to={`/${data.buttonLink}`}
            >
              {data.buttonName}
            </Link>
          </div>
          <div className="col-md-5 d-flex align-items-center justify-content-center">
            {/* <button className="btn-play">{""}</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSlide
