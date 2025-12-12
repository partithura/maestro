<template>
    <v-card>
        <v-card-text>
            <v-row justify="start">
                <v-col cols="12" sm="6" md="6" lg="5" xxl="4"><v-text-field v-model="filter" label="Filtro"
                        clearable /></v-col>
            </v-row>
            <AreaFields v-for="(area, i) in areas" :key="area.id" v-model="areas[i]" @end:deleting="reload()" />
            <v-row>
                <v-col cols="12">
                    <v-btn block variant="flat" size="x-large" @click.stop.prevent="addNewArea">
                        <v-icon size="36px">mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <NewAreaDialog v-model="addNewAreaModal" @end:creating="reload()" />
    </v-card>
</template>
<script setup>
import { useEffortStore } from "#imports"
const effortStore = useEffortStore()
const loading = ref(false)
const addNewAreaModal = ref(false)
const filter = ref()

const emits = defineEmits([
    "start:loading",
    "success:loading",
    "error:loading",
    "end:loading"
])
const areas = computed({
    get() {
        return effortStore.getEffortAreas.filter(searchFilter)
    },
    set(v) {
        effortStore.setAreas(v)
    }
})

function searchFilter(v) {
    if (filter.value) {
        return v.text.includes(filter.value?.toLowerCase()) || v.value.includes(filter.value?.toLowerCase()) || v.repository.includes(filter.value?.toLowerCase())
    }
    return true
}

function reload() {
    emits("start:loading")
    loading.value = true
    effortStore.readEffortAreas()
        .then(resp => {
            emits("success:loading", resp)
        })
        .catch(err => {
            emits("error:loading", err)
        })
        .finally(() => {
            loading.value = false
            emits("end:loading")
        })
}



function addNewArea() {
    addNewAreaModal.value = true
}
onMounted(() => {
    reload()
})
</script>