<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h1>
      <NuxtLink to="/admin" style="text-decoration: none; color: inherit;">
        Website Verwaltung
      </NuxtLink>
    </h1>
    <NuxtLink to="/admin/new" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: auto; margin-right: 10px;">
      Neuer Inhalt
    </NuxtLink>
    <NuxtLink
      external
      to="/api/admin/logout"
      style="background-color: #ccc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
    >
      Abmelden
    </NuxtLink>
  </div>
</template>