<template>
    <v-card :loading="loading" width="300px" title="Faça login via Fine-Grained Token" elevation="12">
        <div>
            <span class="text-center text-grey-darken-1 font-weight-thin text-subtitle-2">
                {{ name }} v{{ version }}
            </span>
        </div>
        <v-form @submit.prevent="login">
            <v-card-text>
                <v-text-field v-model="token" :loading="loading" label="GitHub Fine-Grained Token" type="password"
                    required @keyup.enter="login" clearable hint="Cole seu token de acesso do GitHub" persistent-hint
                    :error="error" />
            </v-card-text>
            <v-card-actions>
                <v-btn :disabled="loading || invalid" block text="Login com GitHub" @click="login" />
            </v-card-actions>
        </v-form>
        <ErrorBar v-model="showErrorBar" :error-data="errorData" timeout="10000" />
    </v-card>
</template>

<script setup>
// Define o layout "auth"
import { useAppStore } from '#imports'
import { firstCase, appPkg as pkg } from '../utils'
definePageMeta({
    layout: 'auth'
})
const version = pkg.version

const name = firstCase(pkg.name)
const token = ref('')
const error = ref(false)
const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)

const showErrorBar = ref(false)
const errorData = ref()

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
            errorData.value = e
            showErrorBar.value = true
        })
        .finally(() => {
            loading.value = false
        })
}
</script>
