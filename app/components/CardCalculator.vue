<template>
    <v-btn
        class="mx-2"
        color="secondary"
        size="x-large"
        text="Usar tabela"
        :disabled="props.disabled"
        @click="showCalculator" />
    <v-dialog
        v-model="isVisible"
        max-width="1440px">
        <v-card>
            <v-toolbar title="Calculadora de esforço">
                <template #append>
                    <v-icon
                        class="mx-3"
                        icon="mdi-close"
                        @click="closeModal" />
                </template>
            </v-toolbar>
            <v-card-text class="d-flex align-center justify-center">
                <CalculatorTable 
                    :headers="headers"
                    :items="items"
                    :selections="selections"
                    :total="total"
                    @update="updateTotal"
                />
            </v-card-text>
            <div class="text-center pb-4">
                {{ tooltip }}
            </div>
            <template #actions>
                <v-btn
                    variant="outlined"
                    @click="resetTable"
                    >Resetar</v-btn
                >
                <v-spacer />
                <v-btn
                    color="success"
                    variant="outlined"
                    @click="emitTotalValue"
                    >Votar {{ total }}</v-btn
                >
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { nextTick, ref } from "vue";

const configStore = useConfigStore();
const areaStore = useAreaStore();
const cardStore = useCardStore();

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

const headers = computed(() => {
    return configStore.getModulesConfig;
});
const items = computed(() => {
    return areaStore.getAreasConfig;
});

const effort = computed(() => {
    return cardStore.getCards.filter((c) => {
        return !isNaN(Number(c.value));
    });
});

const tooltip = computed(() => {
    return effort.value.find((card) => {
        return card.value == total.value;
    })?.tooltip;
});

const emits = defineEmits(["valueCalculated"]);
const isVisible = ref(false);
const selections = ref(setInitialSelections());
const total = computed(() => {
    let sum = 0;
    headers.value.forEach((header) => {
        sum += selections.value[header.value].total;
    });
    return findClosestValue(sum);
});

const effortValues = computed(() => {
    return effort.value.map((ef) => {
        return ef.value;
    });
});

function showCalculator() {
    isVisible.value = true;
}
function closeModal() {
    isVisible.value = false;
}

function emitTotalValue() {
    emits("valueCalculated", total.value);
    closeModal();
}

async function updateTotal(e) {
    let sum = 0;
    await nextTick(() => {
        items.value.forEach((item) => {
            sum += selections.value[e][item.value];
        });
        selections.value[e].total = sum;
    });
}

function setInitialSelections() {
    let obj = {};
    headers.value.forEach((header) => {
        obj[header.value] = {
            total: 0,
        };
        items.value.forEach((item) => {
            obj[header.value][item.value] = 0;
        });
    });
    return obj;
}
function resetTable() {
    selections.value = setInitialSelections();
}

function findClosestValue(numero) {
    // Ordena o effortValues.value para garantir que está em ordem crescente
    const ordenado = effortValues.value.slice().sort((a, b) => a - b);

    // Percorre o effortValues.value procurando o primeiro número >= ao número dado
    for (let i = 0; i < ordenado.length; i++) {
        if (ordenado[i] >= numero) {
            return ordenado[i];
        }
    }

    // Se nenhum número for maior ou igual, retorna o último (maior)
    return ordenado[ordenado.length - 1];
}
</script>
