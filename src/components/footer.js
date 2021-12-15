import React from "react"

const Footer = ({ data }) => {
  return (
    <footer dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default Footer
