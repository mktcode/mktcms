<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <LayoutNavbar v-if="loggedIn" />
    <slot name="navbar2" />
    
    <main class="grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="bg-white border-x border-gray-200">
        <slot />
      </div>
    </main>
  </div>
</template>