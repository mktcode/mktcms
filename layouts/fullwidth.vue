<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <div class="min-h-screen flex flex-col font-nunito">
    <LayoutNavbar v-if="loggedIn" />
    <slot name="navbar2" />
    
    <main class="grow w-full">
      <div class="bg-white border-x border-gray-200">
        <slot />
      </div>
    </main>
  </div>
</template>