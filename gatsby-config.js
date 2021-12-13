module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
    siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: `https://measured-doe.10web.me/graphql`,
        html: {
          createStaticFiles: true,
        },
        type: {
          Category: {
            exclude: true,
          },
          Comment: {
            exclude: true,
          },
          ContentType: {
            exclude: true,
          },
          MenuItem: {
            exclude: true,
          },
          Menu: {
            exclude: true,
          },
          // Page: {
          //   exclude: true,
          // },
          PostFormat: {
            exclude: true,
          },
          Post: {
            exclude: true,
          },
          Tag: {
            exclude: true,
          },
          Taxonomy: {
            exclude: true,
          },
          UserRole: {
            exclude: true,
          },
          User: {
            exclude: true,
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Raleway\:300,400,500,700,800`],
        display: "swap",
      },
    },
  ],
}
