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
    name: "globalConfig",
    pageName: "Configuração Global",
});
const navigationStore = useNavigationStore();

const baseRoute = computed(() => {
    return `/`;
});

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Configurações Globais`,
            disabled: true,
            to: `/configuration`,
        },
    ]);
});
</script>
