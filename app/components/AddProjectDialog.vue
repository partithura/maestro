<template>
  <v-dialog
    v-model="model"
    max-width="600"
  >
    <v-card
      :loading="loading"
      title="Adicionar Projeto"
    >
      <template #append>
        <v-icon 
          icon="mdi-close"
          @click="clearContent"
        />
      </template>
      <template #text>
        <v-form v-model="isValid">
          <v-row dense>
            <v-col cols="3">
              <v-number-input
                v-model="project.number"
                control-variant="hidden"
                :rules="[ isRequired ]"
                label="Número *"
              />
            </v-col>
            <v-col cols="9">
              <v-text-field 
                v-model="project.name"
                :rules="[ isRequired ]"
                label="Nome *"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="project.query"
                label="query"
                hide-details
              />
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
              @click="saveProject()" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
const projectStore = useProjectStore();
const model = defineModel({ type: Boolean });
const project = ref({
  number: null,
  name: null,
  query: null
})

const isValid = ref(false);

const loading = computed(() => {
  return projectStore.getLoading;
})

function clearContent() {
  model.value = false;
  project.value = {
    number: null,
    name: null,
    query: null
  }
}

async function saveProject() {
  if (isValid.value) {
    projectStore.addNewProject(project.value).then(() => {
      clearContent();
    })
  }
}
</script>
