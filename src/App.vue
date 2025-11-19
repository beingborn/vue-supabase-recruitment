<script setup>
  import Navbar from './components/Navbar.vue';
</script>

<template>
  <!-- 
    Router View : 
    라우터가 연결되는 주소의 페이지 표시  
  -->
  <div id="wrap">
    <Navbar/>
    <router-view/>
  </div>

</template>

<style scoped lang="scss">

</style>
