<template>
    <v-card>
        <v-card-title>
            <v-skeleton-loader v-if="loading" type="card" />
            <template v-else>
                <div v-if="!modules.length">
                    <v-btn variant="flat" size="x-large" @click.stop.prevent="openNewModuleModal">
                        <v-icon size="36px">mdi-plus</v-icon>
                    </v-btn>
                    <span>Nenhum módulo existente</span>
                </div>
                <v-tabs v-else :disabled="loading" v-model="tab" color="primary">
                    <v-tab v-for="module in modules" :value="module.value" :key="module.value">
                        {{ module.value }}
                    </v-tab>
                    <v-btn variant="flat" size="x-large" @click.stop.prevent="openNewModuleModal">
                        <v-icon size="36px">mdi-plus</v-icon>
                    </v-btn>
                </v-tabs>
            </template>
        </v-card-title>
        <v-card-text>
            <v-skeleton-loader v-if="loading" type="article" />
            <v-tabs-window v-else v-model="tab">
                <v-tabs-window-item v-for="(module,index) in modules" :value="module.value" :key="module.value">
                    <ModuleFields v-model="modules[index]" />
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
        <NewModuleDialog v-model="newModuleDialog" />
    </v-card>
</template>
<script setup>
import { useEffortStore } from '#imports'
const effortStore = useEffortStore()
const tab = ref()
const loading = ref(false)
const newModuleDialog = ref(false)

function openNewModuleModal() {
    newModuleDialog.value = true
}
const modules = computed(() => {
    return effortStore.getEffortModules ?? []
})

function loadItems(){
    loading.value=true
    effortStore.readEffortModules()
    .finally(()=>{
        loading.value=false
    })
}


onMounted(() => {
    loadItems()
})
</script>