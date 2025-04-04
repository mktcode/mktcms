<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <div class="max-h-screen flex flex-col font-nunito">
    <LayoutNavbar v-if="loggedIn" />
    <slot name="navbar2" />
    
    <main class="h-[calc(100vh-98px)] w-full flex flex-col">
      <slot />
    </main>
  </div>
</template>