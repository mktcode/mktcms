<script setup lang="ts">
definePageMeta({
  middleware() {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  },
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">
      Support
    </h1>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-bold">
          Kontakt
        </h2>
        <p>
          Bei Fragen oder Problemen wenden Sie sich bitte an unseren Support.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-bold">
          Telefon
        </h2>
        <p>
          +49 123 456 789
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-bold">
          E-Mail
        </h2>
        <p>
          <a href="mailto:kontakt@markus-kottlaender.de">
            kontakt@markus-kottlaender.de
          </a>
        </p>
      </div>
    </div>
  </div>
</template>