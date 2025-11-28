<template>
    <v-col cols="12" sm="12" md="6" lg="4" xl="3" xxl="2">
        <v-card variant="outlined" @click="viewIssue" height="100%" max-height="250px" :title="props.issue.fields[0].value.raw">
            <v-card-text class="card-description">
                <div v-html="mdBody"></div>
            </v-card-text>
            <v-card-actions class="pb-0 mb-0">
                <v-chip v-for="label in props.issue.content.labels" :key="label.id" :color="parseColor(label.color)" variant="outlined">{{label.name}}</v-chip>
            </v-card-actions>
            <v-card-actions class="pt-0 mt-0">
                <v-chip :color="parseColor(props.issue?.content?.type?.color)" variant="outlined">{{props.issue?.content?.type?.name}}</v-chip>
            </v-card-actions>
        </v-card>
    </v-col>
</template>
<script setup>
const emits = defineEmits(['click'])
const props = defineProps({
    issue:{
        type:Object,
        default:()=>{}
    }
})
const mdBody = computed(()=>{
    return props.issue.content.body
})
function viewIssue() {
    emits("click",props.issue)
}

function parseColor(colorStr='') {
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
    height: 100px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>