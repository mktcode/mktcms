<script setup lang="ts">
import type { InvoiceOut } from '~/types';

defineProps<{
  invoice: InvoiceOut
}>()
</script>

<template>
  <div class="@container bg-white flex aspect-[8.5/5.5] w-full overflow-hidden text-gray-950 whitespace-normal">
    <div class="p-[6cqw] flex flex-col justify-between w-[67cqw]">
      <div class="flex items-center gap-[3cqw]">
        <div>
          <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full w-[15cqw]" />
        </div>
        <div>
          <div class="font-bold text-[3cqw] leading-none">
            {{ invoice.id }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>