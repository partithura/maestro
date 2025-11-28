<template>
    <v-card :loading="loading" width="300px" title="Faça login via Fine-Grained Token" elevation="12">
        <v-card-text>
            <v-text-field v-model="token" :loading="loading" label="GitHub Fine-Grained Token" type="password" required
                clearable hint="Cole seu token de acesso do GitHub" persistent-hint :error="error" />
        </v-card-text>
        <v-card-actions>
            <v-btn :disabled="loading || invalid" block @click="login" text="Login com GitHub" />
        </v-card-actions>
    </v-card>
</template>

<script setup>
// Define o layout "auth"
import { useAppStore } from '#imports'
definePageMeta({
    layout: 'auth'
})
const token = ref('')
const error = ref(false)
const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)

const invalid = computed(() => {
    return !token.value
})

const login = () => {
    loading.value = true
    error.value = false
    // Salva o token no cookie
    const githubToken = useCookie('token', { maxAge: 60 * 60 * 24 * 7 })
    githubToken.value = token.value
    appStore.updateCurrentToken(token.value)
    appStore.updateUser(token.value)
        .then(valid => {
            if (!valid.id) {
                error.value = true
            } else {
                // Redireciona para dashboard
                router.push('/dashboard')
            }
        })
        .catch(e => {
            window.alert(`Erro na chamada em appStore.updateUser(${token.value}). Error:${e}`)
        })
        .finally(() => {
            loading.value = false
        })
}
</script>
