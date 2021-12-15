import * as React from "react"
import Footer from "./footer"
import Header from "./header"
import { Helmet } from "react-helmet"

const Layout = ({ children, data }) => {
  const happyAddonCSS = data?.allWpPage.edges[0].node.happyAddon;
  const footer = data?.allWp.nodes[0].getElementorTemplate.footer;
  const header = data?.allWp.nodes[0].getElementorTemplate.header;
  const globalCSS = data?.allWp.nodes[0].getElementorTemplate.globalCSS;
  return (
    <>
      <Helmet>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <style id="global-css">
          {globalCSS}
        </style>
        <style id="happy-addon-css">
          {happyAddonCSS}
        </style>
      </Helmet>
      <Header data={header} />
      <main>{children}</main>
      <Footer data={footer} />
    </>
  )
}

export default Layout
