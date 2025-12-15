<template>
    <div>
        <ApplicationUserToolbar />
        <slot />
        <div class="api-usage-status">
            <v-tooltip location="bottom">
                <template #activator="{ props }">
                    <v-icon :color="iconColor" v-bind="props">mdi-network-strength-{{ iconType }}</v-icon>
                </template>
                Uso da API: {{ usageCredits }}/{{ totalCredits }}
            </v-tooltip>
        </div>
    </div>
</template>

<script setup>
const appStore = useAppStore()

const usageCredits = computed(() => {
    return Number(appStore.getUsageCredits)
})
const totalCredits = computed(() => {
    return appStore.getTotalCredits
})
const iconType = computed(() => {
    return Math.ceil(usageCredits.value / (totalCredits.value / 4))
})
const iconColor = computed(() => {
    if (Math.ceil(usageCredits.value / (totalCredits.value / 8)) <= 1) {
        return 'error'
    }
    return 'white'
})
</script>

<style lang="scss" scoped>
.api-usage-status {
    position: fixed;
    top: 12px;
    right: 190px;
    color: white;
    z-index: 3000;
}
</style>