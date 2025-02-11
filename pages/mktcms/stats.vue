<script setup lang="ts">
const { data: stats } = await useFetch('/api/stats/list', { method: 'POST' });
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Statistiken
      </h1>
      <NuxtLink to="/" target="_blank" class="button ml-auto">Website öffnen</NuxtLink>
      <NuxtLink to="/mktcms" class="button ml-4">Inhalte</NuxtLink>
    </div>

    <div class="mt-10">
      <table class="divide-y divide-gray-200 w-full">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seite
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Desktop
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mobil
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gesamt
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unteschiedliche Geräte
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="stat in stats" :key="stat.route">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ stat.route }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ stat.desktopCount }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ stat.mobileCount }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ (stat.mobileCount + stat.desktopCount) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ stat.uniqueUsers }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>