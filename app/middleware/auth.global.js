import { useAppStore } from "#imports";
let appStore;

export default defineNuxtRouteMiddleware((to, from) => {
  //Criar appStore caso ainda não tenha sido instanciada
  if (!appStore) {
    appStore = useAppStore();
  }

  //pega o token dos cookies e valida
  const token = useCookie("token").value;

  //página de login com acesso público
  const publicPages = ["/login","/"];

  appStore
    .checkToken(token)
    .then((isValidToken) => {
      //caso não consiga validar o token acessando uma página privada, limpa o token e navega para login
      if (!isValidToken && !publicPages.includes(to.path)) {
        appStore.logout();
        return navigateTo("/login");
      }

      // if (!token && !publicPages.includes(to.path)) {
      //   appStore.logout()
      //   return navigateTo("/login");
      // }

      // if (isValidToken && !appStore.getCurrentUserInfo.login) {
      //   appStore.logout();
      //   return navigateTo("/login");
      // }

      if (isValidToken && publicPages.includes(to.path)) {
        return navigateTo("/dashboard");
      }
    })
    .catch((e) => {
      appStore.logout();
      return navigateTo("/login");
    })
});
