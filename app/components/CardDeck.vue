<template>
  <v-card :variant="isManagement ? 'outlined' : 'flat'" :loading="props.loading" class="mb-4" :disabled="props.loading"
    :color="isManagement ? 'white' : 'green-darken-4'" title="Votação:">
    <v-card-text class="mt-6 pb-2 pt-2">
      <v-row v-if="isManagement || props.showVotes" align="center" justify="center">
        <v-col v-for="vote in votes" :key="vote.user.id" cols="12" md="2">
          <v-card variant="outlined" hover elevation="6" color="white">
            <v-toolbar>
              <template #prepend>
                <v-avatar :image="vote.user.avatar_url" />
              </template>
              <template #title>
                <v-tooltip location="top left">
                  <template #activator="activator">
                    <span v-bind="activator.props">{{ vote.user.name }}</span>
                  </template>
                  {{ vote.user.name }}
                </v-tooltip>
              </template>
            </v-toolbar>
            <v-card-text>
              <h3 class="text-center">Votou:</h3>
              <h1 class="text-center">{{ vote.vote }}</h1>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-row justify="center" align="center">
            <v-col cols="12" md="6" xl="3">
              <v-card variant="outlined" class="mb-4" :color="result.isFinal ? 'success' : 'warning'" elevation="12">
                <v-toolbar>
                  <template #title>
                    Resultado:
                  </template>
                </v-toolbar>
                <v-card-text>
                  <h3 class="text-center">Decisão do time:</h3>
                  <h3 class="text-center">{{ result.value }}</h3>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="pb-6">
        <h4 v-if="cantVote" class="mb-12">Não há cartas suficientes definidas nas configurações</h4>
        <template v-else>
          <v-col v-for="card in cards" :key="card.value" cols="6" md="1">
            <PokerCard :loading="props.loading" :selected="card.value === model" :card-value="card.value"
              :color="card.color" :minimum-value="card.minimumValue" :maximum-value="card.maximumValue"
              @click="selectCard" />
          </v-col>
        </template>
      </v-row>
      <v-expansion-panels variant="popout" color="green-darken-3">
        <v-expansion-panel title="Como calcular?">
          <template #text>
            <div class="total-title">
              Use a tabela abaixo para ter uma ideia mais objetiva de nota para a task.
            </div>
            <VoteCalculator ref="table" :loading="voteLoading" :headers="headers" :items="items" :effort="effort" />
            <div class="total-description">
              O total sugerido para essa task é de <span class="total-calculated">{{ total }}</span> ponto(s)
            </div>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { useAppStore, useEffortStore } from '#imports'
import { defineExpose } from 'vue'
const appStore = useAppStore()
const effortStore = useEffortStore()
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  cantVote: {
    type: Boolean,
    default: false
  },
  isReady: {
    type: Boolean,
    default: false
  },
  showVotes: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Array,
    default: () => []
  }
})
const voteLoading = ref(false)
const cards = computed(() => {
  return appStore.getCardDeck
})
const isManagement = computed(() => {
  return appStore.getCurrentUserInfo.isManagement
})

const headers = computed(() => {
  return effortStore.getEffortModules
})
const items = computed(() => {
  return effortStore.getEffortAreas
})

const emits = defineEmits([
  "start:loading",
  "success:loading",
  "error:loading",
  "end:loading",
])

const effort = ref([
  {
    value: 1,
    tooltip: "Esforço rápido (entre 15 minutos e 1 hora de trabalho)",
    color: "light-green"
  },
  {
    value: 2,
    tooltip: "Esforço rápido (entre 1 hora e 2 horas de trabalho)",
    color: "light-green"
  },
  {
    value: 3,
    tooltip: "Esforço médio (entre 2 horas e 4 horas de trabalho)",
    color: "green"
  },
  {
    value: 5,
    tooltip: "Esforço médio-alto (entre 4 horas e 8 horas de trabalho)",
    color: "yellow"
  },
  {
    value: 8,
    tooltip: "Esforço alto (entre 8 horas e 12 horas de trabalho)",
    color: "amber"
  },
  {
    value: 13,
    tooltip: "Esforço extremo (entre 12 horas e 24 horas de trabalho)",
    color: "deep-orange"
  },
  {
    value: 21,
    tooltip: "Recomendado quebrar a história (acima de 24 horas de trabalho)",
    color: "red"
  },
])
const table = ref()
const total = computed(() => {
  return table.value?.total || 0
})

const model = defineModel({ type: Number })
function selectCard(v) {
  model.value = v
}
const result = computed(() => {
  let values = []
  if (props.votes.length) {
    props.votes.forEach(vote => {
      if (!values.includes(vote.vote)) {
        values.push(vote.vote)
      }
    });
  }
  values.sort((a, b) => {
    return a - b
  })
  const substring = values.length > 1 ? `Os votos selecionados são ${values}.` : 'Nenhum voto foi contabilizado'
  return values.length == 1 ? { isFinal: true, value: values[0] } : { isFinal: false, value: `O time não chegou em um acordo. ${substring}` }
})

function loadData() {
  emits("start:loading")
  voteLoading.value = true
  Promise.all([effortStore.readEffortModules(),
  effortStore.readEffortAreas()])
    .then(r => {
      emits("success:loading", r)
    })
    .catch(e => {
      emits("error:loading", e)
    })
    .finally(() => {
      voteLoading.value = false
      if (isManagement.value && total.value >= 1) {
        selectCard(total.value)
      }
      emits("end:loading")
    })
}

onMounted(() => {
  loadData()
})

defineExpose({ result })
</script>
<style lang="scss" scoped>
.total-description {
  text-align: center;
  margin-top: 24px;
  font-size: 1.5rem;
}

.total-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

.total-calculated {
  font-weight: 900;
  font-size: 2rem;
  border: 3px solid white;
  padding: 12px 20px;
  border-radius: 50%;
  margin-left: 12px;
  margin-right: 12px;
}
</style>