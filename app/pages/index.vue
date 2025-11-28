<template>
    <div class="loader">
        <h3 class="text-center">Redirecionando...</h3>
    </div>
</template>
<script setup>
onMounted(()=>{
    navigateTo('/dashboard')
})
</script>
<style lang="scss" scoped>
.loader{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 100vh;
    width: 100vw;
}
</style>