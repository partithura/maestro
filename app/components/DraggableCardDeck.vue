<template>
    <div>
        <h3>{{ title }}</h3>   
        <div
            class="d-flex mb-4">
            <VueDraggable
                v-model="internalCards"
                :group="group"
                :sort="sort"
                :class="['d-flex', deckClass]"
                @update="emitChange"
                @add="emitChange"
                @remove="emitChange">
                <div
                    v-for="card in internalCards"
                    :key="card.value"
                    class="mx-3">
                    <BigCard
                        :loading="loading"
                        :card-value="card.value"
                        :card-color="card.color"
                        :card-tooltip="card.tooltip"
                        :card-selected="card.value" 
                        @card-unselected="handleCardClick(card)" />
                    <v-btn
                        class="my-2"
                        variant="flat"
                        density="compact"
                        color="grey-darken-3"
                        block
                        :icon="actionIcon"
                        @click="$emit('action-click', card)" />
                </div>
            </VueDraggable>
            <slot name="append" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: "cartas"
  },
  group: {
    type: Object,
    default: () => ({
      name: "cards",
      pull: true,
      put: true
    })
  },
  sort: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  clickableCard: {
    type: Boolean,
    default: false
  },
  actionIcon: {
    type: String,
    default: "mdi-delete"
  },
  deckClass: {
    type: String,
    default: ""
  }
});
const emit = defineEmits([
  "update:modelValue",
  "action-click",
  "card-click",
  "drag-change"
])

const internalCards = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v)
})

function handleCardClick(card) {
  if (!props.clickableCard) return;
  emit("card-click", card);
}

function emitChange() {
  emit("drag-change");
}
</script>

<style lang="scss" scoped>
.project-card-deck {
    max-width: 100%;
    min-width: 112px;
    min-height: 209px;
    margin-right: 12px;
    overflow-x: scroll;
    background-color: #143314;
}
.card-deck {
    max-width: calc(100% - 112px);
    min-width: 112px;
    min-height: 209px;
    margin-right: 12px;
    overflow-x: scroll;
    background-color: #333;
}
</style>