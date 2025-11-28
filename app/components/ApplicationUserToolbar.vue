<template>
    <!-- Aqui é a configuração a nível de usuário -->
    <v-app-bar elevation="2">
        <!-- <v-app-bar-nav-icon /> -->
        <v-app-bar-title>
            <v-btn @click="goToRoute('/dashboard')" size="x-large" slim class="d-flex align-center">
                <LogoIcon />
                <span class="ml-4">Maestro</span>
            </v-btn>
        </v-app-bar-title>
        <template v-slot:append>
            <!-- <v-tooltip text="Tema" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn @click="toggleTheme" v-bind="props" icon="mdi-theme-light-dark" />
                </template>
            </v-tooltip> -->
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-avatar v-bind="props" :image="userImageUrl" start />
                </template>
                <v-list>
                    <v-list-item @click="goToRoute(item.route)" v-for="(item, index) in userMenu" :key="item.route"
                        :value="index">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="isManagement" @click="goToAdminPage">
                        <v-list-item-title>Configurações</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>
<script setup>
import { useTheme } from 'vuetify'
import { useAppStore } from '#imports'

const appStore = useAppStore()

const userImageUrl = computed(() => appStore.getCurrentUserInfo.avatar_url)

const userMenu = ref([
    {
        route: '/dashboard',
        title: 'Dashboard'
    }
])

const theme = useTheme()
function toggleTheme() {
    theme.toggle()
}

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

</script>