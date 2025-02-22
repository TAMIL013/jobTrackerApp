<template>
  <v-app>
    <v-app-bar
        color="primary"
      >
        <v-app-bar-title class="text-center">Job Tracker App</v-app-bar-title>
      </v-app-bar>
    <v-main class="main">
      <router-view />
    </v-main>

  </v-app>
</template>

<script setup>

</script>

<style>
.main{
  margin-top: 1rem;
}
</style>