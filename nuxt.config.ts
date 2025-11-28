// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ViteConfig } from "nuxt/schema";
import vuetify from "vite-plugin-vuetify";
import { env } from "./server/support/env";

const addHook = (config: Readonly<ViteConfig>): void => {
  if (!config.plugins) {
    return;
  }
  config.plugins.push(
    vuetify({
      autoImport: true,
    })
  );
}

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
      nuxt.hooks.hook("vite:extendConfig", addHook);
    },
  ],
  plugins: ['~/plugins/vuetify.js'],
  components: true,
  css: [
    "vuetify/lib/styles/main.sass", // Main Vuetify styles
    "@mdi/font/css/materialdesignicons.min.css", // Optional: Material Design Icons
    "~/assets/github-markdown.css" //github markdonw
  ],
  devServer: {
    port: 3000, // You can specify a different port if needed
    host: '0.0.0.0' // This makes the server accessible from any IP address on your network
  },
  runtimeConfig: {
    githubClientId: env.GITHUB_CLIENT_ID,
    adminTeamName: env.ADMIN_TEAM_NAME,
    organizationName: env.ORGANIZATION_NAME,
    mongodbURL: env.MONGODB_CONNECTION_STRING,
    mongodbPassword: env.MONGODB_PASSWORD,
    mongodbDatabase: env.MONGODB_DATABASE,
    mongodbAuthSource: env.MONGODB_AUTH_SOURCE,
    githubClientSecret: env.GITHUB_CLIENT_SECRET,
    public: {
      githubClientId: env.GITHUB_CLIENT_ID,
    },
  },
});