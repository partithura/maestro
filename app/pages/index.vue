<template>
    <v-row
        align="center"
        justify="center">
        <v-col cols="12">
            <h2 class="text-center">Selecione uma opção:</h2>
        </v-col>
        <v-col
            cols="12"
            md="6"
            lg="4"
            xl="3"
            xxl="2">
            <v-btn
                to="/projects_"
                height="120px"
                block
                size="x-large">
                <div class="px-4 py-2">Ver Projetos</div>
            </v-btn>
        </v-col>

        <v-col
            v-if="isManagement"
            cols="12"
            md="6"
            lg="4"
            xl="3"
            xxl="2">
            <v-btn
                to="/configuration"
                height="120px"
                block
                size="x-large">
                <div class="px-4 py-2">Configurações</div>
            </v-btn>
        </v-col>

        <v-col
            cols="12"
            md="6"
            lg="4"
            xl="3"
            xxl="2">
            <v-btn
                to="/ChatRoom"
                height="120px"
                block
                size="x-large">
                <v-badge
                    location="top right"
                    color="error"
                    content="!">
                    <div class="px-4 py-2">Sala de votação</div>
                </v-badge>
            </v-btn>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Dashboard",
});
const navigationStore = useNavigationStore();
const userStore = useUserStore();

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});
onMounted(() => {
    navigationStore.setBreadcrumbs([]);
});
</script>
