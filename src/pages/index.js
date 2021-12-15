import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import '../wp-assets';

const IndexPage = ({data}) => {
  const homeContent = data?.allWpPage.edges[0].node.styledContent;
  const happyAddonCSS = data?.allWpPage.edges[0].node.happyAddon;
  console.log(happyAddonCSS);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: homeContent }} />
      <Helmet>
        <style id="custom-css">
          {happyAddonCSS}
        </style>

      </Helmet>
    </div>
  )
}

export default IndexPage

export const pageQuery = graphql`
query MyQuery {
  allWpPage(filter: {title: {}, isFrontPage: {eq: true}}) {
    edges {
      node {
        id
        content
        title
        uri
        link
        styledContent
        happyAddon
        title
      }
    }
  }
}`;