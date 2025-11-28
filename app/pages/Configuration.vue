<template>
    <v-container>
        <v-card title="Configurações gerais">
            <v-card-text>
                <v-tabs v-model="selectedTab" color="primary">
                    <v-tab v-for="tab in configurationTabs" :key="tab.value" :value="tab.value">{{ tab.title }}</v-tab>
                </v-tabs>
                <v-divider/>
                <v-tabs-window v-model="selectedTab">
                    <v-tabs-window-item v-for="tab in configurationTabs" :key="tab.value" :value="tab.value">
                        <component :is="tab.component" />
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script setup>
import ProjectConfig from '~/components/ProjectConfig.vue'
import CardsConfig from '~/components/CardsConfig.vue'
import ModulesConfig from '~/components/ModulesConfig.vue'
import AreasConfiguration from '~/components/AreasConfiguration.vue'
definePageMeta({
    layout: 'app',
})
const selectedTab = ref()
const configurationTabs = ref([
    {
        value: 'projetos',
        title: 'Projetos',
        component: ProjectConfig
    },
    {
        value: 'cartas',
        title: 'Cartas',
        component: CardsConfig
    },
    {
        value: 'modulos',
        title: 'Módulos',
        component: ModulesConfig
    },
    {
        value: 'areas',
        title: 'Áreas',
        component: AreasConfiguration
    },
])
</script>