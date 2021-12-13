import React from "react";
import { Helmet } from "react-helmet";
import { withPrefix, graphql } from "gatsby";
import '../elementor/assets/lib/eicons/css/elementor-icons.min.css';
import '../elementor/assets/css/common.min.css';
import '../elementor/assets/css/frontend.min.css';
import '../elementor/assets/lib/font-awesome/css/fontawesome.min.css';
import '../elementor/assets/lib/font-awesome/css/brands.min.css';
import '../elementor/assets/lib/font-awesome/css/solid.min.css';
import '../elementor/assets/lib/font-awesome/css/regular.min.css';
import '../elementor/assets/lib/font-awesome/css/all.min.css';
import '../elementor/assets/lib/font-awesome/css/v4-shims.min.css';
import '../elementor/assets/lib/font-awesome/css/font-awesome.min.css';

const IndexPage = ({data}) => {
  const homeContent = data?.allWpPage.edges[0].node.content;
  const customCSS = data?.allWpPage.edges[0].node.customCSS;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: homeContent }} />
      <Helmet>
        <style id="custom-css">
          {customCSS}
        </style>

        <script src={withPrefix('v4-shims.js')} type="text/javascript" />
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
        customCSS
      }
    }
  }
}`;