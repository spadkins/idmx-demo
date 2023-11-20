<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <nav>
    [ <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/signup">Signup</RouterLink> |
    <RouterLink to="/login">Login</RouterLink> |
    <RouterLink to="/reset">Reset Password</RouterLink> |
    <RouterLink to="/profile">Profile</RouterLink> |
    <RouterLink to="/about">About</RouterLink> ]
  </nav>
  <RouterView />
</template>

<style scoped>

  /* nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } */

</style>
