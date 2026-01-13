<template>
    <v-dialog
        v-model="model"
        max-width="600">
        <v-card
            :loading="loading"
            title="Adicionar Organização">
            <template #append>
                <v-icon
                    icon="mdi-close"
                    @click="clearContent" />
            </template>
            <template #text>
                <v-form v-model="isValid">
                    <v-row dense>
                        <v-col cols="6">
                            <v-text-field
                                v-model="organization.name"
                                :rules="[isRequired]"
                                label="Nome *" />
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="organization.id"
                                :rules="[isRequired]"
                                label="ID *" />
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
                    @click="saveOrganization()" />
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup>
const organizationStore = useOrganizationStore();
const model = defineModel({ type: Boolean });
const organization = ref({
    name: null,
    id: null,
});

const isValid = ref(false);

const loading = computed(() => {
    return organizationStore.getLoading;
});

function clearContent() {
    model.value = false;
    organization.value = {
        name: null,
        id: null,
    };
}

async function saveOrganization() {
    if (isValid.value) {
        organizationStore.addNewOrganization(organization.value).then(() => {
            clearContent();
        });
    }
}
</script>
