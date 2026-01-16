<template>
    <v-row
        justify="space-evenly"
        justify-xxl="center"
        justify-xl="center">
        <v-skeleton-loader
            v-if="loading"
            width="100%"
            type="card" />
        <template v-else>
            <template v-if="cards?.length">
                <v-col
                    v-for="card in cards"
                    :key="card.value"
                    cols="6"
                    sm="3"
                    md="3"
                    lg="1"
                    xl="1"
                    xxl="1">
                    <BigCard
                        :disabled="props.disabled"
                        :card-value="card.value"
                        :card-color="card.color"
                        :card-tooltip="card.tooltip"
                        :card-selected="cardSelected"
                        @card-selected="setSelectedCard"
                        @card-unselected="deselectCard" />
                </v-col>
            </template>
            <template v-else>
                <div class="pa-8 text-center">
                    {{ message }}
                </div>
            </template>
        </template>
    </v-row>
    <v-row
        align-content="center"
        justify="center">
        <v-btn
            class="mx-2"
            size="x-large"
            :disabled="isDisabled"
            @click="chooseCard"
            >Votar</v-btn
        >
        <CardCalculator
            :disabled="props.disabled"
            @value-calculated="setSelectedCard" />
        <v-btn
            v-if="isManagement"
            variant="text"
            icon="mdi-cog" />
    </v-row>
</template>
<script setup>
const cardStore = useCardStore();
const userStore = useUserStore();
const emits = defineEmits(["cardSelected", "cardUnselected", "chooseCard"]);

const props = defineProps({
    cardSelected: {
        type: [String, Number],
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    cards: {
        type: Array,
        default: () => [],
    },
});

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

const cards = computed(() => {
    return loading.value ? [] : props.cards;
});

const loading = computed(() => {
    return cardStore.getLoading;
});

const message = computed(() => {
    return "Não há cartas salvas no banco";
});

const isDisabled = computed(() => {
    return props.cardSelected == null || props.disabled;
});

function setSelectedCard(v) {
    emits("cardSelected", v);
}
function deselectCard(v) {
    emits("cardUnselected", v);
}
function chooseCard() {
    emits("chooseCard");
}
</script>
