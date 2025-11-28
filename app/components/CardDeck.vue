<template>
    <v-card :variant="isManagement ? 'outlined' : 'flat'" :loading="props.loading" class="mb-4" :disabled="props.loading"
        :color="isManagement ? 'white' : 'green-darken-4'" title="Votação:">
        <v-card-text class="mt-6 pb-2 pt-2">
            <v-row v-if="isManagement" align="center" justify="center">
                <v-col cols="12" md="2" v-for="vote in votes" :key="vote.user.id">
                    <v-card variant="outlined" hover elevation="6" color="white">
                        <v-toolbar>
                            <template #prepend>
                                <v-avatar :image="vote.user.avatar_url"></v-avatar>
                            </template>
                            <template #title>
                                <v-tooltip location="top left">
                                    <template #activator="{ props }">
                                        <span v-bind="props">{{ vote.user.name }}</span>
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
                            <v-card variant="outlined" :color="result.isFinal ? 'success' : 'warning'" elevation="12">
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
            <v-row v-else align="center" justify="center" class="pb-6">
                <h4 v-if="cantVote" class="mb-12">Não há cartas suficientes definidas nas configurações</h4>
                <template v-else>
                    <v-col cols="6" md="1" v-for="card in cards" :key="card.value">
                        <PokerCard :loading="props.loading" :selected="card.value === model" :card-value="card.value"
                            :color="card.color" :minimum-value="card.minimumValue" :maximum-value="card.maximumValue"
                            @click="selectCard" />
                    </v-col>
                </template>
            </v-row>
            <v-expansion-panels variant="popout" color="green-darken-3">
                <v-expansion-panel title="Como calcular?">
                    <template #text>
                        Use a tabela abaixo para ter uma ideia mais objetiva de nota para a task.
                        <VoteCalculator ref="table" :headers="headers" :items="items" :effort="effort" />
                        <div>
                            O total calculado para essa task é {{ total }}
                        </div>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { useAppStore } from '#imports'
const appStore = useAppStore()
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    cantVote: {
        type: Boolean,
        default: false
    },
    votes: {
        type: Array,
        default: () => []
    }
})
const cards = computed(() => {
    return appStore.getCardDeck
})
const isManagement = computed(() => {
    return appStore.getCurrentUserInfo.isManagement
})

const headers = ref([
  {
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
  },
  {
    text: "Implementação",
    tooltip: "esforço de implementação",
    value: 'implementacao',
    points: [
      {
        value: 0,
        text: "Não necessita Implementação."
      },
      {
        value: 1,
        text: "Necessita implementação que já foi feita antes."
      },
      {
        value: 2,
        text: "Necessita implementação que nunca foi feita antes."
      },
      {
        value: 3,
        text: "Necessita implementação até a morte."
      },

    ]
  },
  {
    text: "Pesquisa",
    tooltip: "esforço de pesquisa",
    value: 'pesquisa',
    points: [
      {
        value: 0,
        text: "Não necessita pesquisa."
      },
      {
        value: 1,
        text: "Necessita pesquisa sobre assunto já conhecido."
      },
      {
        value: 2,
        text: "Necessita pesquisa de assunto não conhecido."
      },
    ]
  },
])
const items = ref([
  {
    text: "Frontend",
    value: 'frontend',
    tooltip: "no frontend?"
  },
  {
    text: "Backend",
    value: 'backend',
    tooltip: "no backend?"
  },
  {
    text: "Banco de dados",
    value: 'database',
    tooltip: "no banco?"
  },
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
const total = computed(()=>{
    return table.value.total
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

defineExpose({ result })
</script>
