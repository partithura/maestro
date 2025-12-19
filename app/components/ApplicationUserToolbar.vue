<template>
    <v-app-bar elevation="8" density="compact" border="b-sm">
        <v-app-bar-title>
            <v-btn size="large" slim class="d-flex align-center" @click="goToRoute('/dashboard')">
                <LogoIcon size="42px" />
                <span class="ml-4">Maestro</span>
            </v-btn>
        </v-app-bar-title>
        <template #append>
            <v-tooltip location="bottom end" theme="dark">
                <template #activator="{ props }">
                    <span v-bind="props" class="mr-3 text-center text-grey-darken-1 font-weight-thin text-subtitle-2">{{
                        name }} v{{ version
                        }}</span>
                </template>
                <div class="pa-4">
                    <h3>Changelog:</h3>
                    <h5>v{{ version }}</h5>
                    <ul>
                        <li v-for="(logData, index) in changelog" :key="index">{{ logData }}</li>
                    </ul>
                </div>
            </v-tooltip>
            <v-menu>
                <template #activator="{ props }">
                    <v-avatar v-bind="props" :image="userImageUrl" start />
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in userMenu" :key="item.route" :value="index"
                        @click="goToRoute(item.route)">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="isManagement" @click="goToAdminPage">
                        <v-list-item-title>Configurações</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="registerTelegram">
                        <v-list-item-title>Ativar notificações</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
        <TelegramNotification v-model="showTelegramModal" />
    </v-app-bar>
</template>
<script setup>
import { firstCase, appPkg as pkg } from '../utils'
import { useAppStore } from '#imports'
const version = pkg.version

const name = firstCase(pkg.name)

const appStore = useAppStore()

const userImageUrl = computed(() => appStore.getCurrentUserInfo.avatar_url)

const userMenu = ref([
    {
        route: '/dashboard',
        title: 'Dashboard'
    }
])

const showTelegramModal = ref(false)


const isManagement = computed(() => {
    return appStore.getCurrentUserInfo.isManagement
})

const logout = () => {
    // Remove o token
    appStore.logout()

    // Redireciona para login
    navigateTo('/login')
}
function goToAdminPage() {
    if (isManagement.value) {
        navigateTo('/configuration')
    }
}
function goToRoute(r) {
    navigateTo(r)
}
function registerTelegram() {
    showTelegramModal.value = true
}

</script>