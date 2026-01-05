<template>
    <v-col cols="12">
        <v-sheet
            class="d-flex"
            :color="isConnected ? 'primary-darken-1' : 'error'">
            <span class="mx-3 py-1">
                {{ computedTimer }}
            </span>
            <v-spacer />
            <span class="mx-3 py-1"
                >Você está
                {{ isConnected ? "conectado" : "desconectado" }}.</span
            >
        </v-sheet>
    </v-col>
</template>
<script setup>
const props = defineProps({
    isConnected: {
        type: Boolean,
        default: false,
    },
    startTime: {
        type: Number,
        default: 0,
    },
});
const elapsedTime = ref(0);
const finalTime = computed(() => {
    return props.startTime + elapsedTime.value;
});
const isRunning = ref(false);
const timerInterval = ref();
const computedTimer = computed(() => {
    if (props.startTime == 0) {
        return "00:00:00";
    }
    const hours = Math.floor(elapsedTime.value / 1000 / (60 * 60));
    const minutes = Math.floor(
        (elapsedTime.value / 1000 - hours * 60 * 60) / 60
    );
    const secs = Math.floor(
        elapsedTime.value / 1000 - hours * 60 * 60 - minutes * 60
    );
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}:${String(secs).padStart(2, "0")}`;
});

function startTimer() {
    if (isRunning.value) return;
    isRunning.value = true;
    timerInterval.value = setInterval(() => {
        elapsedTime.value += 1000;
    }, 1000);
}

function stopTimer() {
    isRunning.value = false;
    clearInterval(timerInterval.value);
}
onUnmounted(() => {
    clearInterval(timerInterval.value);
});
defineExpose({
    startTimer,
    stopTimer,
    finalTime,
});
</script>
