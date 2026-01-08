<template>
    <div
        class="card-container"
        :class="{ selected: isSelected, disabled: props.disabled }"
        :style="isSelected ? `background-color: ${cardColor};` : ''"
        @click="switchCard">
        <div class="mini-card">
            <div>
                <h4 class="text-center">{{ computedCardValue }}</h4>
                <h5 class="text-center">{{ cardTooltip }}</h5>
            </div>
        </div>
    </div>
</template>
<script setup>
const emits = defineEmits(["cardSelected", "cardUnselected"]);
const props = defineProps({
    cardValue: {
        type: [String, Number],
        default: "",
    },
    cardSelected: {
        type: [String, Number],
        default: "",
    },
    cardTooltip: {
        type: String,
        default: "Sem valor definido",
    },
    cardColor: {
        type: String,
        default: "#FFFFFF",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const isSelected = computed(() => {
    return props.cardSelected == props.cardValue;
});
const computedCardValue = computed(() => {
    return props.cardValue;
});

function switchCard() {
    if (!props.disabled) {
        isSelected.value
            ? emits("cardUnselected", props.cardValue)
            : emits("cardSelected", props.cardValue);
    }
}
</script>
<style lang="scss" scoped>
$cardScale: 0.75;
$cardOffset: 5px;
$cardHeight: 150px;
$cardWidth: 100px;
$cardRadius: 5px;
$innerCardRadius: $cardRadius - $cardOffset;
$innerCardHeight: $cardHeight - $cardOffset;
$innerCardWidth: $cardWidth - $cardOffset;
$innerCardBorderWidth: calc($cardOffset / 2);

.card-container {
    cursor: pointer;
    width: $cardWidth;
    height: $cardHeight;
    border-radius: $cardRadius;
    margin: 0;
    background-color: #ffffff;
    transition: 0.32s;
    transform: scaleX($cardScale) scaleY($cardScale);
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
}

.disabled {
    opacity: 0.75 !important;
    cursor: not-allowed !important;
}

.mini-card {
    width: $innerCardWidth;
    height: $innerCardHeight;
    font-size: 1.8rem;
    border: $innerCardBorderWidth solid black;
    font-weight: 900;
    color: black;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    border-radius: $innerCardRadius;

    div {
        h5 {
            font-weight: 600;
            font-size: 1rem;
            line-height: 16px;
            letter-spacing: normal;
        }
    }
}

.selected {
    transform: scaleX(1) scaleY(1);
}
</style>
