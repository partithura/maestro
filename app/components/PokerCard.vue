<template>
    <v-tooltip :text="tootlip" location="top center">
        <template #activator="activator">
            <v-card
:loading="loading" v-bind="activator.props" class="animated-card" :class="{ selected: selected }"
                theme="light" width="80px" :elevation="selected ? 12 : 1" :color="selected ? color : 'white'"
                @click="emitVote">
                <v-card-text>
                    <div class="card-value">
                        {{ cardValue }}
                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-tooltip>
</template>
<script setup>
const emits = defineEmits(["click"])
const props = defineProps({
    cardValue: {
        type: [Number, String],
        default: 0
    },
    minimumValue: {
        type: Number,
        default: 0
    },
    maximumValue: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: "#3333ff"
    },
    selected: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
})
const tootlip = computed(() => {
    return props.maximumValue > 0 ? `Estimativa entre ${props.minimumValue}h e ${props.maximumValue}h de trabalho` : `Não há um valor atribuido a essa carta`
})
function emitVote() {
    emits("click", props.cardValue)
}
</script>
<style lang="scss" scoped>
.card-value {
    font-size: 28px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
    height: 80px;
}

.animated-card {
    transition: 0.33s;
}

.selected {
    transform: translateY(-32px) scale(1.2);
}
</style>