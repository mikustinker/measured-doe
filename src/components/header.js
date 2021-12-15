import React from "react"

const Header = ({data}) => {
  return (
    <header dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default Header
