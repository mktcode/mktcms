<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <div class="min-h-screen flex flex-col font-nunito">
    <LayoutNavbar v-if="loggedIn" />
    <slot name="navbar2" />
    
    <main class="grow mx-auto w-full max-w-7xl md:px-6 lg:px-8">
      <div class="bg-white border-x border-gray-200">
        <slot />
      </div>
    </main>
  </div>
</template>