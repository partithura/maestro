<!-- eslint-disable vue/no-v-html -->
<template>
    <v-col cols="12" sm="12" md="6" lg="4" xl="3" xxl="2">
        <v-card
:color="prop.isSelected ? 'primary' : ''" variant="outlined" max-height="250px" height="100%"
            @click="viewIssue">
            <v-toolbar :color="prop.isSelected ? 'primary' : 'grey-darken-4'" density="compact">
                <template #prepend>
                    <v-chip
class="ml-3" :color="parseColor(prop.issue?.content?.type?.color)" variant="outlined"
                        density="compact">{{
                            prop.issue?.content?.type?.name }}</v-chip>
                </template>
                <v-toolbar-title>
                    <v-tooltip :text="rawIssueTitle" location="top">
                        <template #activator="{ props }">
                            <span v-bind="props" v-html="issueTitle" />
                        </template>
                    </v-tooltip>
                </v-toolbar-title>
                <template #append>
                    <span :class="{ selected: prop.isSelected }" class="issue-number" href="">#{{
                        prop.issue?.content?.number }}</span>
                </template>
            </v-toolbar>
            <v-card-text class="card-description text-white">
                <div class="px-3" v-html="mdBody" />
            </v-card-text>
            <v-card-actions class="pb-0 mb-0">
                <v-chip
v-for="label in prop.issue.content.labels" :key="label.id" density="compact"
                    :color="parseColor(label.color)" variant="outlined">{{ label.name }}</v-chip>
            </v-card-actions>
        </v-card>
    </v-col>
</template>
<script setup>
const emits = defineEmits(['click'])
const prop = defineProps({
    issue: {
        type: Object,
        default: () => { }
    },
    isSelected: {
        type: Boolean,
        default: false
    }
})
const mdBody = computed(() => {

    return parseGitMD(prop.issue?.content?.body, prop.issue?.content?.repository?.name)
})

const issueTitle = computed(() => {

    return parseGitMD(prop.issue?.fields[0]?.value?.html, prop.issue?.content?.repository?.name)
})
const rawIssueTitle = computed(() => {
    return prop.issue?.fields[0]?.value?.raw
})

function viewIssue() {
    emits("click", prop.issue)
}

function parseColor(colorStr = '') {
    // Passo 1: Verificar se é um valor hexadecimal (com ou sem #)
    let hex = colorStr.trim();

    // Se não começar com #, adicionamos temporariamente para validação
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }

    // Testa se é um valor hexadecimal válido (6 dígitos)
    if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
        return hex.toUpperCase();
    }

    // Passo 2: Tentar converter nome de cor para hexadecimal
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = colorStr.trim();

    // Obter o estilo computado após definir a cor
    const computedColor = ctx.fillStyle;

    // Verificar se o valor resultante é um hexadecimal
    if (/^#([A-Fa-f0-9]{6})$/.test(computedColor)) {
        return computedColor.toUpperCase();
    }

    // Caso não seja uma cor válida
    return null;
}
</script>
<style lang="scss">
.card-description {
    height: 94px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
}

.issue-number {
    font-weight: 800;
    color: rgb(128, 128, 128);
    font-size: 1.5rem;
    margin-right: 12px;
}

.selected {
    color: white;
}
</style>