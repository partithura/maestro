// plugins/vuetify.js
import 'vue-markdown-shiki/style'
import markdownPlugin from 'vue-markdown-shiki'

const options = {
  breaks:true,
  linkify:true,
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(markdownPlugin, options);
});
