<template>
    <div class="loader">
        <div>
            <h3 class="text-center">Redirecionando...</h3>
            <h5 class="text-center text-grey-darken-1 font-weight-thin text-subtitle-2">
                {{ name }} v{{ version }}
            </h5>
        </div>
    </div>
</template>
<script setup>
import { firstCase, appPkg as pkg } from '../utils'
const version = pkg.version

const name = firstCase(pkg.name)
onMounted(() => {
    navigateTo('/login')
})
</script>
<style lang="scss" scoped>
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 100vh;
    width: 100vw;
}
</style>