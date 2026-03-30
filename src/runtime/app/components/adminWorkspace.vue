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
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-brand">
        MKTCMS
      </div>

      <div class="admin-sidebar-sections">
        <section
          v-if="hasSidebarPrimary"
          class="admin-sidebar-section"
        >
          <button
            type="button"
            class="admin-sidebar-section-toggle"
            :aria-expanded="isPrimarySidebarExpanded"
            @click="isPrimarySidebarExpanded = !isPrimarySidebarExpanded"
          >
            <span class="admin-sidebar-section-label">
              {{ props.primarySidebarLabel }}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="admin-sidebar-toggle-icon"
              :class="{ 'is-collapsed': !isPrimarySidebarExpanded }"
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
            class="admin-sidebar-section-body"
          >
            <slot name="sidebarPrimary" />
          </div>
        </section>

        <section class="admin-sidebar-section admin-sidebar-files">
          <div class="admin-sidebar-section-header">
            <button
              type="button"
              class="admin-sidebar-section-toggle"
              :aria-expanded="isFilesSidebarExpanded"
              @click="isFilesSidebarExpanded = !isFilesSidebarExpanded"
            >
              <span class="admin-sidebar-section-label">
                {{ props.sectionLabel }}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="admin-sidebar-toggle-icon"
                :class="{ 'is-collapsed': !isFilesSidebarExpanded }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            <Versioning v-if="showVersioning" />
          </div>

          <div
            v-show="isFilesSidebarExpanded"
            class="admin-sidebar-section-body"
          >
            <Content />
          </div>
        </section>
      </div>

      <div class="admin-sidebar-footer">
        <Usage />
        <Stats />
      </div>
    </aside>

    <div class="admin-main">
      <div class="admin-topbar">
        <Header />
      </div>

      <div class="admin-view-slot">
        <slot />
      </div>
    </div>
  </div>
</template>
