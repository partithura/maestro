<template>
    <v-row>
        <DefaultHeader to="/" />
        <v-col cols="12">
            <v-row
                dense
                align="center"
                justify="center">
                <v-col
                    v-for="organization in organizations"
                    :key="organization.id"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`/configuration/${organization.id}`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">{{ organization.name }}</div>
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Organizações",
});
const navigationStore = useNavigationStore();

const organizations = computed(() => {
    return [
        {
            id: "partithura",
            name: "Partithura",
        },
    ];
});

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Configurações`,
            disabled: true,
            to: `/configuration`,
        },
    ]);
});
</script>
