import React from "react"
import { Closequote } from "../utils/imgImport"
import StarRatings from "react-star-ratings"

const TestimonialItem = ({ data }) => {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="testimonial-item">
        <img
          className="testimonial-item__avatar"
          src={data.avatar.localFile.url}
          alt="avatar"
        />
        <img src={Closequote} alt="closequote" />
        <p className="testimonial-item__name">{data.testimonialTitle}</p>
        <p className="testimonial-item__role">{data.testimonialSubtitle}</p>
        <div
          className="testimonial-item__text"
          dangerouslySetInnerHTML={{ __html: data.testimonialText }}
        />
        <StarRatings
          rating={data.stars}
          starDimension="30px"
          starSpacing="2.5px"
          starRatedColor=" #FFC107"
        />
      </div>
    </div>
  )
}

export default TestimonialItem
