// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true, // Crucial for Server-Side Rendering
    theme: {
      defaultTheme: "dark", // Options: 'light', 'dark', 'system'
      // disable: true, // Set to true to disable theme functionality
    },
    components,
    directives,
    // styles: {
    //   configFile: "/assets/settings.scss",
    // },
  });
  nuxtApp.vueApp.use(vuetify);
});
