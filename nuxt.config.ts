// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@nuxt/eslint",
    // "@nuxt/fonts",
    // "@nuxt/icon",
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(
          vuetify({
            autoImport: true,
            // styles: {
            //   configFile: "/assets/settings.scss", // Optional: for custom SASS variables
            // },
          })
        );
      });
    },
  ],
  plugins: ['~/plugins/vuetify.js'],
  components: true,
  css: [
    "vuetify/lib/styles/main.sass", // Main Vuetify styles
    "@mdi/font/css/materialdesignicons.min.css", // Optional: Material Design Icons
  ],
  runtimeConfig: {
    githubClientId: process.env.GITHUB_CLIENT_ID,
    adminTeamName: process.env.ADMIN_TEAM_NAME,
    organizationName: process.env.ORGANIZATION_NAME,
    mongodbURL: process.env.MONGODB_URL,
    mongodbPassword: process.env.MONGODB_PASSWORD,
    mongodbUsername: process.env.MONGODB_USERNAME,
    mongodbDatabase: process.env.MONGODB_DATABASE,
    mongodbAuthSource: process.env.MONGODB_AUTH_SOURCE,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      githubClientId: process.env.GITHUB_CLIENT_ID,
    },
  },
});