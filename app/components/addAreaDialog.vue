<template>
    <v-dialog
        v-model="model"
        max-width="600">
        <v-card
            :loading="loading"
            :title="isEditing ? 'Editar área' : 'Adicionar área'">
            <template #append>
                <v-icon
                    icon="mdi-close"
                    @click="clearContent" />
            </template>
            <template #text>
                <v-form v-model="isValid">
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field
                                v-model="area.text"
                                :rules="[isRequired]"
                                label="nome *" 
                                autofocus />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="area.value"
                                :rules="[isRequired, isValidVariableName]"
                                label="valor *" />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="area.repository"
                                label="repositório"
                                hide-details />
                        </v-col>
                    </v-row>
                </v-form>
            </template>
            <template #actions>
                <v-btn
                    prepend-icon="mdi-close"
                    text="Cancelar"
                    variant="outlined"
                    color="error"
                    :disabled="loading"
                    :loading="loading"
                    @click="clearContent" />
                <v-btn
                    prepend-icon="mdi-check"
                    text="Salvar"
                    variant="outlined"
                    color="success"
                    :disabled="loading || !isValid"
                    :loading="loading"
                    @click="saveArea()" />
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup>
const areaStore = useAreaStore();
const model = defineModel({ type: Boolean });
const emits = defineEmits(["modalClose"]);
const props = defineProps({
    initialArea: {
        type: [Object, null],
        default: null,
    },
});
const isEditing = computed(() => {
    return Boolean(props.initialArea);
});
const area = ref({
    text: null,
    value: null,
    repository: null,
});

const isValid = ref(false);

const loading = computed(() => {
    return areaStore.getLoading;
});

function clearContent() {
    model.value = false;
    area.value = {
        text: null,
        value: null,
        repository: null,
    };
    emits("modalClose");
}

async function saveArea() {
  if (isValid.value) {
    if (isEditing.value) {
        areaStore.editArea(area.value).then(() => {
            clearContent();
        });
    } else {
        areaStore.addNewArea(area.value).then(() => {
          clearContent();
        });
    }
  }
}
watch(model, (value) => {
    //associar a carta props
    if (value && props.initialArea?.value) {
        area.value = Object.assign(area.value, props.initialArea);
    }
});
</script>
