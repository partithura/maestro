<template>
    <v-col
        cols="12"
        sm="8"
        md="6"
        lg="5"
        xl="4"
        xxl="2">
        <v-sheet class="pa-4">
            <h3 class="mb-4">Maestro</h3>
            <v-form
                v-model="isValid"
                class="text-center"
                @submit.prevent="testLogin()">
                <v-text-field
                    v-model="token"
                    class="text-center"
                    :loading="loading"
                    label="Token de acesso"
                    type="password"
                    prepend-inner-icon="mdi-content-paste"
                    :rules="validationRules"
                    @click:prepend-inner="pasteContent()" />
                <div class="mb-3">
                    <v-expansion-panels>
                        <v-expansion-panel title="Como gerar um token válido?">
                            <template #text>
                                <div class="text-start">
                                    <h3 class="text-center mb-4">
                                        Siga esses passos para criar um token:
                                    </h3>
                                    <ul>
                                        <li>
                                            Acesse o endereço
                                            <a
                                                href="https://github.com/settings/tokens/new"
                                                target="_blank"
                                                >github.com/settings/tokens/new</a
                                            >
                                        </li>
                                        <li>
                                            Gere um <b>token classic</b> e
                                            marque as permissões:
                                            <ul class="ml-4 pl-4">
                                                <li><b>repo</b></li>
                                                <li><b>admin:org</b></li>
                                                <li><b>notifications</b></li>
                                                <li><b>user</b></li>
                                                <li><b>project</b></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                <v-btn
                    text="acessar"
                    block
                    size="x-large"
                    type="submit"
                    :disabled="!isValid"
                    :loading="loading"
                    variant="tonal" />
            </v-form>
        </v-sheet>
    </v-col>
</template>
<script setup>
definePageMeta({
    layout: "auth",
    name: "Login",
});
const userStore = useUserStore();
const token = ref();
const isValid = ref(false);
const loading = computed(() => {
    return userStore.getLoading;
});
const validationRules = computed(() => {
    return [(val) => (val != null ? true : "Token é obrigatório")];
});
function testLogin() {
    userStore
        .login(token.value)
        .then((r) => {
            const cookie = useCookie("token", {});
            cookie.value = token.value;
            navigateTo("/");
        })
        .catch((err) => {});
}
async function pasteContent() {
    token.value = await navigator.clipboard.readText();
}
</script>
