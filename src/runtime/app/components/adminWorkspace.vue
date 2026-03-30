<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { useRuntimeConfig } from '#imports'
import Header from './header.vue'
import Content from './content/index.vue'
import Versioning from './content/versioning.vue'
import Stats from './content/stats.vue'
import Usage from './content/usage.vue'

const props = withDefaults(defineProps<{
  primarySidebarLabel?: string
  sectionLabel?: string
}>(), {
  primarySidebarLabel: 'Chats',
  sectionLabel: 'Dateien',
})

const { public: { mktcms: { showVersioning } } } = useRuntimeConfig()
const slots = useSlots()

const hasSidebarPrimary = computed(() => Boolean(slots.sidebarPrimary))
const isPrimarySidebarExpanded = ref(true)
const isFilesSidebarExpanded = ref(true)
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <aside class="flex flex-col w-full shrink-0 px-4 pb-6 pt-2 gap-5 order-2 bg-ds-surface lg:w-96 lg:p-5 lg:gap-6 lg:order-0">
      <div class="font-display font-bold text-lg tracking-[-0.01em] text-ds-on-surface">
        MKTCMS
      </div>

      <div class="flex flex-col gap-3 min-h-0 lg:flex-1 lg:overflow-y-auto">
        <section
          v-if="hasSidebarPrimary"
          class="bg-ds-surface-container-lowest rounded-[1.25rem]"
        >
          <button
            type="button"
            class="flex items-center justify-between w-full gap-3 py-[0.95rem] px-4 bg-transparent border-none cursor-pointer text-left"
            :aria-expanded="isPrimarySidebarExpanded"
            @click="isPrimarySidebarExpanded = !isPrimarySidebarExpanded"
          >
            <span class="text-xs font-semibold uppercase tracking-widest text-ds-on-surface-variant">
              {{ props.primarySidebarLabel }}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4 shrink-0 text-ds-on-surface-variant transition-transform duration-200"
              :class="{ '-rotate-90': !isPrimarySidebarExpanded }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          <div
            v-show="isPrimarySidebarExpanded"
            class="min-h-0 px-4 pb-4"
          >
            <slot name="sidebarPrimary" />
          </div>
        </section>

        <section class="bg-ds-surface-container-lowest rounded-[1.25rem] min-h-0">
          <div class="flex items-center justify-between gap-3 pr-2">
            <button
              type="button"
              class="flex items-center justify-between w-full gap-3 py-[0.95rem] px-4 bg-transparent border-none cursor-pointer text-left"
              :aria-expanded="isFilesSidebarExpanded"
              @click="isFilesSidebarExpanded = !isFilesSidebarExpanded"
            >
              <span class="text-xs font-semibold uppercase tracking-widest text-ds-on-surface-variant">
                {{ props.sectionLabel }}
              </span>

              <Versioning v-if="showVersioning" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4 shrink-0 text-ds-on-surface-variant transition-transform duration-200"
                :class="{ '-rotate-90': !isFilesSidebarExpanded }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </div>

          <div
            v-show="isFilesSidebarExpanded"
            class="min-h-0 px-4 pb-4"
          >
            <Content />
          </div>
        </section>
      </div>

      <div class="flex flex-col gap-4 lg:mt-auto">
        <Usage />
        <Stats />
      </div>
    </aside>

    <div class="admin-main flex flex-1 flex-col min-w-0 min-h-dvh order-1 lg:min-h-screen lg:order-0">
      <div class="flex flex-wrap items-center gap-3 px-4 py-4 md:px-6 bg-white">
        <Header />
      </div>

      <div class="admin-view-slot flex flex-1 flex-col min-h-0 max-w-5xl mx-auto w-full">
        <slot />
      </div>
    </div>
  </div>
</template>
