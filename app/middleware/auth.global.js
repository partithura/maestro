export default defineNuxtRouteMiddleware((to) => {
    const userStore = useUserStore();
    const route = useRoute();
    const token = useCookie("token");
    console.log("Route:", route);
    const publicPages = ["/login"];
    if (publicPages.includes(to.path)) {
        if (token.value) {
            userStore
                .login(token.value)
                .then((r) => {
                    if (publicPages.includes(to.path)) {
                        return navigateTo("/");
                    }
                    return;
                })
                .catch((err) => {
                    navigateTo("/login");
                });
        } else {
            return;
        }
    } else {
        if (!token.value) {
            //chamar api para verificar o token
            if (publicPages.includes(to.path)) {
                return;
            }
            return navigateTo("/login");
        } else if (!userStore.getUser.token) {
            userStore
                .login(token.value)
                .then((r) => {
                    if (publicPages.includes(to.path)) {
                        return navigateTo("/");
                    }
                    return;
                })
                .catch((err) => {
                    return navigateTo("/login");
                });
        } else {
            return;
        }
    }
});
