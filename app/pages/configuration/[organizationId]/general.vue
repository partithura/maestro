<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col cols="12">
            <v-sheet>
                <v-row
                    dense
                    justify="center">
                    <v-col>
                        <div>Grupos de permissões</div>
                        <div>Gerenciamento de salas</div>
                        <div>Mudar parametros do projeto</div>
                        <div>Mudar parametros da organização</div>
                    </v-col>
                    <v-col> Cor Padrão para repositórios: </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Geral",
});
const navigationStore = useNavigationStore();
const route = useRoute();
const organizationId = computed(() => {
    return route.params.organizationId;
});
const organizationName = computed(() => {
    return "Partithura";
});
const baseRoute = computed(() => {
    return `/configuration/${organizationId.value}`;
});

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Configurações`,
            disabled: false,
            to: `/configuration`,
        },
        {
            title: `${organizationName.value}`,
            disabled: false,
            to: `/configuration/${organizationId.value}`,
        },
        {
            title: `Geral`,
            disabled: true,
            to: `/configuration/${organizationId.value}/general`,
        },
    ]);
});
</script>
