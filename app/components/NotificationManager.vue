<template>
    <v-snackbar
        v-model="showSnack"
        position="fixed"
        :timeout="-1"
        location="top end"
        color="grey-darken-4">
        <div class="d-flex">
            <v-spacer />
            <v-icon @click="removeAllAlerts">mdi-close</v-icon>
        </div>
        <v-alert
            v-for="alert in alerts"
            :key="alert.id"
            closable
            variant="flat"
            :icon="alert.icon"
            :type="alert.type"
            class="mt-2"
            :title="alert.title"
            :text="alert.text"
            @click:close.prevent="removeOneAlert(alert.id)">
            <template #title>
                <b>{{ alert.title }}</b>
                <v-spacer />
                <small class="text-right">
                    {{ timestampToTime(alert.timestamp) }}
                </small>
            </template>
        </v-alert>
    </v-snackbar>
</template>
<script setup>
const logStore = useLogStore();
const alerts = computed(() => {
    return logStore.getErrorLog;
});
const showSnack = computed(() => {
    return Boolean(alerts.value.length);
});
function removeAllAlerts() {
    logStore.removeAllAlerts();
}
function removeOneAlert(timestamp) {
    logStore.removeAlert(timestamp);
}
</script>
