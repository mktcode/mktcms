<script setup lang="ts">
import { ref } from 'vue'
import Header from './header.vue'
import ChatSessionBar from './chat/sessionBar.vue'
import Content from './content/index.vue'
import Stats from './content/stats.vue'
import Usage from './content/usage.vue'

const props = withDefaults(defineProps<{
  sectionLabel?: string
}>(), {
  sectionLabel: 'Dateien',
})

const isSidebarTopExpanded = ref(true)
const isFilesSidebarExpanded = ref(true)
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <aside class="flex flex-col w-full shrink-0 px-4 pb-6 pt-2 gap-5 order-2 bg-ds-surface lg:w-96 lg:p-5 lg:gap-6 lg:order-0">
      <div class="font-display font-bold text-lg tracking-[-0.01em] text-ds-on-surface">
        MKTCMS
      </div>

      <div class="flex flex-col gap-3 min-h-0 lg:flex-1 lg:overflow-y-auto">
        <section class="bg-ds-surface-container-lowest rounded-[1.25rem]">
          <button
            type="button"
            class="flex items-center justify-between w-full gap-3 py-[0.95rem] px-4 bg-transparent border-none cursor-pointer text-left"
            :aria-expanded="isSidebarTopExpanded"
            @click="isSidebarTopExpanded = !isSidebarTopExpanded"
          >
            <span class="text-xs font-semibold uppercase tracking-widest text-ds-on-surface-variant">
              Chats
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4 shrink-0 text-ds-on-surface-variant transition-transform duration-300"
              :class="{ '-rotate-90': !isSidebarTopExpanded }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          <div
            class="grid transition-[grid-template-rows] duration-300 ease-in-out"
            :class="isSidebarTopExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <div class="px-4 pb-4">
                <ChatSessionBar />
              </div>
            </div>
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

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4 shrink-0 text-ds-on-surface-variant transition-transform duration-300"
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
            class="grid transition-[grid-template-rows] duration-300 ease-in-out"
            :class="isFilesSidebarExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <div class="px-4 pb-4">
                <Content />
              </div>
            </div>
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

