import React from "react"

const NewsItem = ({ data }) => {
  return (
    <div className="news-item">
      <img src={data.featuredImage.node.srcSet} alt="news" />
      <div className="news-item__content">
        <h3>{data.title}</h3>
        <div className="divider"></div>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
        <div className="news-item__author">
          <img
            className="author-photo"
            src={data.author.node.avatar.url}
            alt="author"
          />
          <div className="author-detail">
            <h4>{data.author.node.name}</h4>
            {/* <p>{data.author.role}</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsItem
