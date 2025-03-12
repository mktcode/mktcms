<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting>
        <UButton class="ml-auto" icon="i-lucide-plus" to="/buchhaltung/kunden/neu">
          Neuer Kunde
        </UButton>
      </LayoutNavbarAccounting>
    </template>
    <CustomersList />
  </NuxtLayout>
</template>