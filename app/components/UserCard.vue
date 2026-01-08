<template>
    <v-card
        :rounded="0"
        variant="elevated"
        hover
        :color="user.isManagement ? 'blue-grey-darken-4' : 'grey-darken-4'"
        border="thin"
        class="mx-auto mb-1"
        :subtitle="timeTaken"
        :title="user.name">
        <template #prepend>
            <v-avatar
                color="blue-darken-2"
                :image="user.avatar_url" />
        </template>
        <template #append>
            <SimpleCard
                :card-value="user.vote"
                :show="showCards" />
        </template>
    </v-card>
</template>
<script setup>
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    timer: {
        type: Number,
        default: 0,
    },
    showCards: {
        type: Boolean,
        default: false,
    },
});
function calculateTimer(v) {
    let t = Math.floor(v / 1000); //total em segundos
    const h = Math.floor(t / (60 * 60));
    let m = Math.floor((t - h * 60 * 60) / 60);
    let s = Math.floor(t - h * 60 * 60 - m * 60);
    return `${h}:${m}:${s}`;
}
const timeTaken = computed(() => {
    if (props.timer > 0) {
        return props.user.timestamp
            ? calculateTimer(props.user.timestamp - props.timer)
            : "Aguardando voto...";
    }
    return "00:00:00";
});
</script>
