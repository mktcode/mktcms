<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '#app'
import FileIcon from './fileIcon.vue'
import FileButtons from './fileButtons.vue'

const props = defineProps<{
  path: string
  name: string
  isDirectory: boolean
  level: number
}>()

const isExpanded = ref(false)
const isLoading = ref(false)
const files = ref<string[]>([])
const dirs = ref<string[]>([])

function filenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function fileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/)
  return match && match[1] ? match[1] : ''
}

async function toggleExpand() {
  if (!props.isDirectory) return
  
  isExpanded.value = !isExpanded.value
  
  // Load contents when expanding for the first time
  if (isExpanded.value && files.value.length === 0 && dirs.value.length === 0 && !isLoading.value) {
    isLoading.value = true
    const { data } = await useFetch('/api/admin/list', {
      query: { path: props.path },
    })
    if (data.value) {
      files.value = data.value.files
      dirs.value = data.value.dirs
    }
    isLoading.value = false
  }
}

const indentStyle = {
  paddingLeft: `${props.level * 1.5}rem`,
}
</script>

<template>
  <div>
    <!-- Directory Item -->
    <div v-if="isDirectory">
      <button
        class="button secondary w-full flex items-center text-left"
        @click="toggleExpand"
      >
        <!-- Folder Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 opacity-20 ml-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
          />
        </svg>
        
        <span>{{ name }}</span>
        
        <!-- Chevron Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4 ml-auto transition-transform duration-300"
          :class="isExpanded ? 'rotate-90' : ''"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      
      <!-- Collapsible Content -->
      <div
        class="grid transition-[grid-template-rows] duration-300 ease-in-out"
        :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div v-if="isLoading" class="py-2" :style="{ paddingLeft: `${(level + 1) * 1.5}rem` }">
            <span class="text-sm text-gray-500">Laden...</span>
          </div>
          <div v-else class="py-2 space-y-2">
            <!-- Files -->
            <div
              v-for="file in files"
              :key="file"
              class="flex gap-2"
              :style="{ paddingLeft: `${(level + 1) * 1.5}rem` }"
            >
              <NuxtLink
                :to="`/admin/edit/${fileExtension(file) === 'md' ? 'markdown/' : 'file/'}${path}${path ? ':' : ''}${file}`"
                class="flex-1 button secondary"
              >
                <FileIcon :file-path="`${path}${path ? ':' : ''}${file}`" />
                <div class="w-full flex">
                  {{ filenameWithoutExtension(file) }}
                  <span
                    v-if="fileExtension(file)"
                    class="text-sm text-gray-400 ml-auto"
                  >
                    .{{ fileExtension(file) }}
                  </span>
                </div>
              </NuxtLink>
              <FileButtons :file-path="`${path}${path ? ':' : ''}${file}`" />
            </div>
            
            <!-- Subdirectories -->
            <TreeNode
              v-for="dir in dirs"
              :key="dir"
              :path="`${path}${path ? ':' : ''}${dir}`"
              :name="dir"
              :is-directory="true"
              :level="level + 1"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- File Item (non-directory) -->
    <div v-else class="flex gap-2" :style="indentStyle">
      <NuxtLink
        :to="`/admin/edit/${fileExtension(name) === 'md' ? 'markdown/' : 'file/'}${path}`"
        class="flex-1 button secondary"
      >
        <FileIcon :file-path="path" />
        <div class="w-full flex">
          {{ filenameWithoutExtension(name) }}
          <span
            v-if="fileExtension(name)"
            class="text-sm text-gray-400 ml-auto"
          >
            .{{ fileExtension(name) }}
          </span>
        </div>
      </NuxtLink>
      <FileButtons :file-path="path" />
    </div>
  </div>
</template>
