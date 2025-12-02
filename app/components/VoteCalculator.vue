<template>
  <div class="table-container">
    <table>
      <tbody>
        <tr>
          <th />
          <th v-for="header in headers" :key="header.value">{{ header.text }}</th>
        </tr>
        <tr v-for="(item, index) in items" :key="`row_${item.value}`">
          <td>{{ item.text }}</td>
          <td v-for="header in headers" :key="`${item.text}_${header.text}_${index}`">
            <v-select
v-model="selections[header.value][item.value]" max-width="140px" v-bind="props" density="compact"
              :items="header.points" item-value="value" item-title="text"
              @update:model-value="updateTotal(header.value)" />
          </td>
        </tr>
        <tr>
          <td class="total-value">TOTAL:</td>
          <td v-for="header in headers" :key="`soma_${header.text}`" class="total-value">
            {{ selections[header.value].total }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const props = defineProps({
  headers: {
    type: Array,
    default: () => {
      return []
    },
  },
  items: {
    type: Array,
    default: () => {
      return []
    }
  },
  effort: {
    type: Array,
    default: () => {
      return []
    }
  },
})
const selections = ref(setInitialSelections())
const total = computed(() => {
  let sum = 0
  props.headers.forEach(header => {
    sum += selections.value[header.value].total
  })
  return findClosestValue(sum)
})

const effortValues = computed(() => {
  return [...props.effort.map(ef => {
    return ef.value
  })]
})

async function updateTotal(e) {
  let sum = 0
  await nextTick(() => {
    props.items.forEach(item => {
      sum += selections.value[e][item.value]
    })
    selections.value[e].total = sum
  })
}

function setInitialSelections() {
  let obj = {}
  props.headers.forEach(header => {
    obj[header.value] = {
      total: 0
    }
    props.items.forEach(item => {
      obj[header.value][item.value] = 0
    })
  })
  return obj
}
function resetTable() {
  selections.value = setInitialSelections()
}

function findClosestValue(numero) {
  // Ordena o effortValues.value para garantir que está em ordem crescente
  const ordenado = effortValues.value.slice().sort((a, b) => a - b);

  // Percorre o effortValues.value procurando o primeiro número >= ao número dado
  for (let i = 0; i < ordenado.length; i++) {
    if (ordenado[i] >= numero) {
      return ordenado[i];
    }
  }

  // Se nenhum número for maior ou igual, retorna o último (maior)
  return ordenado[ordenado.length - 1];
}

defineExpose({
  total,
  resetTable
})
</script>
<style lang="scss" scoped>
th,
td {
  background-color: rgb(41, 41, 41);
  margin: 0;
  padding: 4px;
  text-align: center;
}

tr {
  padding: 0;
}

.total-value {
  font-weight: 800;
  font-size: 1.5rem;
  background-color: rgb(27, 76, 151);
}

.table-container {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

table {
  border: 1px solid white;
}
</style>
