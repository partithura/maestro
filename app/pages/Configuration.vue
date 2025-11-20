<template>
    <v-container>
        <v-card title="Configurações gerais">
            <v-card-text>
                <v-tabs v-model="tab" color="primary">
                    <v-tab value="one">Projetos</v-tab>
                    <v-tab value="two">Cartas</v-tab>
                </v-tabs>

                <v-divider></v-divider>

                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="one">
                        <ProjectConfig />
                    </v-tabs-window-item>
                    <v-tabs-window-item value="two">
                        <CardsConfig />
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script setup>
definePageMeta({
    layout: 'app',
})
const tab = ref()
</script>