<template>
    <v-dialog persistent max-width="800px" v-model="addModuleModal">
        <v-card>
            <v-toolbar>
                <template #title>
                    Adicionar novo módulo
                </template>
                <template #append>
                    <v-icon icon="mdi-close" @click="closeModal"></v-icon>
                </template>
            </v-toolbar>
            <v-card-text>

                <v-form v-model="isValid">
                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <v-text-field validate-on="eager" v-model.trim="computedValue" :rules="variableNameRules" label="Valor do campo"
                                hint="Valor que vai ser usado na geração da table" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field validate-on="eager" v-model="newModule.text" :rules="required" label="Texto da coluna"
                                hint="Texto usado na coluna" />
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-text-field v-model="newModule.tooltip" label="Formação da tooltip do módulo"
                                hint="Ainda não está sendo utilizado" />
                        </v-col>
                        <v-col cols="12">
                            <v-card variant="outlined" title="Valores:">
                                <v-card-text class="scrollable">
                                    <v-row align="center" justify="center" dense v-if="newModule.points.length <= 0">
                                        <h3 class="text-center">Não há nenhuma pontuação associada.</h3>
                                    </v-row>
                                    <v-row dense v-for="(point, index) in newModule.points" :key="index">
                                        <v-col>
                                            <v-number-input validate-on="eager" :rules="pointsRules"
                                                v-model="point.value" :precision="0" :min="0" label="Valor do ponto"
                                                prepend-icon="mdi-delete" @click:prepend="deleteValue(index)" />
                                        </v-col>
                                        <v-col>
                                            <v-text-field validate-on="eager" v-model="point.text" :rules="required" label="Valor exibido no select" />
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
                <v-btn :disabled="!isValid" @click="saveModule" color="success" variant="tonal">Salvar Módulo</v-btn>
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

function findHighestValue(arr, property = 'value') {
    if (!arr || arr.length === 0) {
        return 0; // Or throw an error, depending on desired behavior
    }
    const values = arr.map(obj => obj[property]);
    return Math.max(...values) + 1;
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

function isValidVariableName(name) {
    // 1. Check if it's a string
    if (typeof name !== 'string') {
        return "Nome de variável inválido";
    }

    // 2. Check against JavaScript's naming rules using a regular expression
    //    - Starts with a letter, underscore, or dollar sign.
    //    - Subsequent characters can also include numbers.
    const validIdentifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if (!validIdentifierRegex.test(name)) {
        return "Nome de variável inválido";
    }

    // 3. Check for reserved keywords (case-sensitive)
    const reservedKeywords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
        'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
        'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while',
        'with', 'yield', 'enum', 'implements', 'interface', 'let', 'package', 'private', 'protected',
        'public', 'static', 'await', 'abstract', 'boolean', 'byte', 'char', 'double', 'final', 'float',
        'goto', 'int', 'long', 'native', 'short', 'synchronized', 'throws', 'transient', 'volatile',
        'null', 'true', 'false', 'undefined'
    ];
    if (reservedKeywords.includes(name)) {
        return "Nome de variável inválido";
    }

    // If all checks pass, it's a valid variable name
    return true;
}
function isRequired(v) {
    return (!v&&typeof v!= "number") ? 'Campo obrigatório' : true
}
</script>

<style lang="scss" scoped>
.scrollable {
    max-height: calc(100vh - 600px);
    overflow-y: scroll;
}
</style>