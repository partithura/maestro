<template>
    <v-container>
        <ApplicationUserToolbar />
        <!-- <v-app-bar height="48"> -->
            <!-- <NuxtLink to="/dashboard">Dashboard</NuxtLink> -->
            <!-- <NuxtLink to="/profile">Perfil</NuxtLink> -->
            <!-- <v-app-bar-title class="text-h6 ms-3"> -->
                <!-- <v-icon icon="mdi-apps"></v-icon> -->
                <!-- <span class="ms-1">Projeto</span> -->
            <!-- </v-app-bar-title> -->
        <!-- </v-app-bar> -->
            <slot />
    </v-container>
</template>

<script setup>
// import { useAppStore } from '#imports';
// const appStore = useAppStore()
// onBeforeMount(async ()=>{
//     await appStore.updateUser()
// })
</script>