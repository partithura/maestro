<template>
    <v-dialog v-model="addModuleModal" persistent max-width="800px">
        <v-card>
            <v-toolbar>
                <template #title>
                    Adicionar novo módulo
                </template>
                <template #append>
                    <v-icon icon="mdi-close" @click="closeModal" />
                </template>
            </v-toolbar>
            <v-card-text>

                <v-form v-model="isValid">
                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <v-text-field
v-model.trim="computedValue" validate-on="eager" :rules="variableNameRules"
                                label="Valor do campo" hint="Valor que vai ser usado na geração da table" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
v-model="newModule.text" validate-on="eager" :rules="required"
                                label="Texto da coluna" hint="Texto usado na coluna" />
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-text-field
v-model="newModule.tooltip" label="Formação da tooltip do módulo"
                                hint="Ainda não está sendo utilizado" />
                        </v-col>
                        <v-col cols="12">
                            <v-card variant="outlined" title="Valores:">
                                <v-card-text class="scrollable">
                                    <v-row v-if="newModule.points.length <= 0" align="center" justify="center" dense>
                                        <h3 class="text-center">Não há nenhuma pontuação associada.</h3>
                                    </v-row>
                                    <v-row v-for="(point, index) in newModule.points" :key="index" dense>
                                        <v-col>
                                            <v-number-input
v-model="point.value" validate-on="eager"
                                                :rules="pointsRules" :precision="0" :min="0" label="Valor do ponto"
                                                prepend-icon="mdi-delete" @click:prepend="deleteValue(index)" />
                                        </v-col>
                                        <v-col>
                                            <v-text-field
v-model="point.text" validate-on="eager" :rules="required"
                                                label="Valor exibido no select" />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn block @click="addNewValue">
                                        <v-icon icon="mdi-plus" />
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>


            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn :disabled="!isValid" color="success" variant="tonal" @click="saveModule">Salvar Módulo</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useEffortStore } from '#imports'
const effortStore = useEffortStore()

const addModuleModal = defineModel({ type: Boolean })

/*
text: "QA",
tooltip: "testes de qualidade",
value: 'qa',
points: [
    {
    value: 0,
    text: "Não necessita testes de qualidade."
    },
    {
    value: 1,
    text: "Necessita testes que já foram feitos antes."
    },
    {
    value: 2,
    text: "Necessita testes que nunca foram feitos antes."
    },

]
*/

const newModule = ref({
    text: "",
    value: "",
    tooltip: "",
    points: []
})

const isValid = ref()

const pointsRules = computed(() => {
    return [isRequired, checkIfUnique]
})
const variableNameRules = computed(() => {
    return [isRequired, isValidVariableName]
})
const required = computed(() => {
    return [isRequired]
})

// function checkMinimum(index,item){
//     if(index<=0){
//         return 0
//     }
//     const filteredArray = newModule.value.points.filter(f=>{
//         return f.value!=item.value
//     })
//     return findHighestValue(filteredArray,'value')
// }
function checkIfUnique(val) {
    const filtered = newModule.value.points.filter(f => {
        return f.value == val
    })
    return filtered.length <= 1 || 'O valor precisa ser único'
}


const loading = ref(false)

function addNewValue() {
    newModule.value.points.push(
        {
            value: newModule.value.points.length,
            text: '',
        }
    )
}

function deleteValue(index) {
    newModule.value.points.splice(index, 1)

}

async function saveModule() {
    //salvar na API
    loading.value = true
    await effortStore.createEffortModules(newModule.value)
    loading.value = false
    closeModal()
    effortStore.readEffortModules()
}

function closeModal() {
    addModuleModal.value = false
    newModule.value = {
        text: "",
        value: "",
        tooltip: "",
        points: []
    }
}
const computedValue = computed({
    get() {
        return newModule.value.value
    },
    set(v) {
        newModule.value.value = v.trim().replace(/\s/g, "_")
    }
})

</script>

<style lang="scss" scoped>
.scrollable {
    max-height: calc(100vh - 600px);
    overflow-y: scroll;
}
</style>