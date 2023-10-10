<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <Header />
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style>
body {
  background: #121212;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
}
</style>
