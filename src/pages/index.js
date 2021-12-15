import React from "react";
import { graphql } from "gatsby";

import Layout from '../components/layout';
import '../wp-assets';

const IndexPage = ({data}) => {
  const homeContent = data?.allWpPage.edges[0].node.styledContent;

  return (
    <Layout data={data}>
      <div dangerouslySetInnerHTML={{ __html: homeContent }} />
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
query MyQuery {
  allWpPage(filter: {isFrontPage: {eq: true}}) {
    edges {
      node {
        happyAddon
        title
        styledContent
      }
    }
  }
  allWp {
    nodes {
      getElementorTemplate {
        footer
        globalCSS
        header
      }
    }
  }
}`;