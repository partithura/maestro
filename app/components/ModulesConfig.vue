<template>
    <v-card>
        <v-card-title>
            <v-skeleton-loader v-if="loading" type="card" />
            <template v-else>
                <v-row justify="start">
                    <v-col cols="12" sm="6" md="6" lg="5" xxl="4">
                        <v-text-field v-model="filter" label="Filtro" clearable /></v-col>
                </v-row>
                <div v-if="!modules.length">
                    <v-btn variant="flat" base-color="grey" size="x-large" @click.stop.prevent="openNewModuleModal">
                        <v-icon size="36px">mdi-plus</v-icon>
                    </v-btn>
                    <span class="mx-4">Nenhum módulo existente</span>
                </div>
                <v-tabs v-else v-model="tab" :disabled="loading" color="primary">
                    <v-tab :variant="module._id == tab ? 'flat' : 'tonal'" v-for="module in modules" base-color="grey"
                        :key="module._id" :value="module._id">
                        <div>
                            <div>{{ module.value }}</div>
                            <div class="text-subtitle-2">{{ module.repository }}</div>
                        </div>
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
                <v-tabs-window-item v-for="(module, index) in modules" :key="module._id" :value="module._id">
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
const filter = ref()
const loading = ref(false)
const newModuleDialog = ref(false)

function openNewModuleModal() {
    newModuleDialog.value = true
}
const modules = computed(() => {
    return effortStore.getEffortModules?.filter(moduleFilter)
})

function moduleFilter(m) {
    if (filter.value) {
        return m?.text?.includes(filter.value.toLowerCase()) ||
            m?.repository?.includes(filter.value.toLowerCase()) ||
            m?.tooltip?.includes(filter.value.toLowerCase()) ||
            m?.value?.includes(filter.value.toLowerCase())
    }
    return true
}

function loadItems() {
    loading.value = true
    effortStore.readEffortModules()
        .finally(() => {
            loading.value = false
        })
}


onMounted(() => {
    loadItems()
})
</script>