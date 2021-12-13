import React from "react"

const ProductItem = ({ data }) => {
  return (
    <div className="col-lg-4 col-md-6 product-item">
      <div className="product-item__img">
        <img src={data.featuredImage.node.srcSet || ""} alt="banner" />
        <h3>{data.title}</h3>
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  )
}

export default ProductItem
