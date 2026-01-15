<template>
    <table>
        <tbody>
            <tr>
                <th class="last-header" />
                <th
                    v-for="header in headers"
                    :key="header.value">
                    {{ header.text }}
                </th>
                <th class="last-header">Voto</th>
            </tr>
            <tr
                v-for="(item, index) in items"
                :key="`row_${item.value}`">
                <td>{{ item.text }}</td>
                <td
                    v-for="header in headers"
                    :key="`${item.text}_${header.text}_${index}`">
                    <v-select
                        v-model="
                            internalSelections[header.value][item.value]
                        "
                        v-bind="props"
                        density="compact"
                        hide-details
                        :items="header.points"
                        item-value="value"
                        item-title="text"
                        @update:model-value="
                            update(header.value)
                        " />
                </td>
                <td class="last-header" />
            </tr>
            <tr>
                <td class="last-header">TOTAL:</td>
                <td
                    v-for="header in headers"
                    :key="`soma_${header.text}`"
                    class="last-header">
                    {{ internalSelections[header.value].total }}
                </td>
                <td class="last-header">{{ props.total }}</td>
            </tr>
        </tbody>
      </table>
</template>

<script setup>
const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => []
  },
  selections: {
    type: Object,
    default: () => {}
  },
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  "update:modelValue",
  "update"
])

const internalSelections = computed({
  get: () => props.selections,
  set: (v) => emit("update:modelValue", v)
})

function update(v) {
    emit("update", v);
}
</script>

<style lang="scss" scoped>
td,
th {
    text-align: center;
    max-width: 160px;
    min-width: 100px;
    padding: 8px;
    background-color: rgb(49, 49, 49);
}
table {
    background-color: rgb(20, 20, 20);
}
.last-header {
    background-color: rgb(27, 27, 27);
}
</style>