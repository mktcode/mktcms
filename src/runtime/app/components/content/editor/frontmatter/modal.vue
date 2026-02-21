<script setup lang="ts">
import { ref, watch } from 'vue'
import { parse, stringify } from 'yaml'
import FrontmatterForm from './form.vue'
import MonacoEditor from '../monacoEditor.vue'

const { isOpen } = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const frontmatter = defineModel<any>('frontmatter', {
  required: true,
})

const mode = ref<'form' | 'yaml'>('form')
const yamlContent = ref('')
const yamlError = ref('')

let syncingYamlFromModel = false

function syncYamlFromFrontmatter() {
  syncingYamlFromModel = true
  yamlContent.value = stringify(frontmatter.value ?? {})
  yamlError.value = ''
  syncingYamlFromModel = false
}

function syncFrontmatterFromYaml(value: string) {
  try {
    const parsed = parse(value)
    frontmatter.value = parsed && typeof parsed === 'object' ? parsed : {}
    yamlError.value = ''
  }
  catch {
    yamlError.value = 'Ungültiges YAML. Änderungen werden erst bei gültigem YAML übernommen.'
  }
}

watch(() => isOpen, (open) => {
  if (!open)
    return

  syncYamlFromFrontmatter()
})

watch(frontmatter, () => {
  if (mode.value !== 'form')
    return

  syncYamlFromFrontmatter()
}, { deep: true })

watch(yamlContent, (value) => {
  if (mode.value !== 'yaml' || syncingYamlFromModel)
    return

  syncFrontmatterFromYaml(value)
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
    role="presentation"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-220 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-3"
      role="dialog"
      aria-modal="true"
      aria-label="Metadaten"
    >
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-bold text-2xl">
          Metadaten
        </h2>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="button secondary small"
            @click="mode = mode === 'form' ? 'yaml' : 'form'"
          >
            {{ mode === 'form' ? 'YAML' : 'Formular' }}
          </button>
          <button
            type="button"
            class="button secondary small"
            @click="emit('close')"
          >
            Schließen
          </button>
        </div>
      </div>

      <div
        v-if="mode === 'form'"
        class="max-h-[70vh] overflow-auto pr-1"
      >
        <FrontmatterForm v-model:frontmatter="frontmatter" />
      </div>

      <div
        v-else
        class="h-[70vh] min-h-80 flex flex-col gap-2"
      >
        <ClientOnly>
          <MonacoEditor
            v-model="yamlContent"
            language="yaml"
            class="w-full h-full border border-gray-200 rounded-sm"
          />
        </ClientOnly>

        <p
          v-if="yamlError"
          class="text-sm"
        >
          {{ yamlError }}
        </p>
      </div>
    </div>
  </div>
</template>
