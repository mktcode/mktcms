<script setup lang="ts">
import { computed, watch } from 'vue'
import FrontmatterInput from './input.vue'

defineOptions({
  name: 'FrontmatterForm',
})

const props = withDefaults(defineProps<{
  depth?: number
  schema: Record<string, any> | null
}>(), {
  depth: 0,
})

const frontmatter = defineModel<any>('frontmatter', {
  required: true,
})

type SchemaNode = {
  'type'?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'datetime'
  'label'?: string
  'x-ui'?: 'image' | 'pdf' | 'file'
  'items'?: SchemaNode
  'properties'?: Record<string, SchemaNode>
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isBooleanSchema(schema: unknown): schema is SchemaNode {
  return isRecord(schema) && schema.type === 'boolean'
}

function isObject(value: unknown) {
  return isRecord(value)
}

function isArraySchema(schema: unknown): schema is SchemaNode {
  return isRecord(schema) && schema.type === 'array'
}

function isObjectSchema(schema: unknown): schema is SchemaNode {
  return isRecord(schema) && schema.type === 'object'
}

function isPrimitiveSchema(schema: unknown): schema is SchemaNode {
  return isRecord(schema) && ['string', 'number', 'date', 'datetime'].includes(schema.type ?? '')
}

function isSchemaMap(schema: unknown): schema is Record<string, SchemaNode> {
  return isRecord(schema) && !('type' in schema)
}

function schemaEntries(schema: Record<string, SchemaNode>) {
  return Object.entries(schema)
}

function createDefaultFromSchema(schema: SchemaNode | null | undefined): any {
  if (!schema || !schema.type) {
    return ''
  }

  if (schema.type === 'array') {
    return []
  }

  if (schema.type === 'object') {
    const next: Record<string, any> = {}
    const properties = schema.properties ?? {}

    for (const key of Object.keys(properties)) {
      next[key] = createDefaultFromSchema(properties[key])
    }

    return next
  }

  if (schema.type === 'boolean') {
    return false
  }

  if (schema.type === 'number') {
    return 0
  }

  return ''
}

function ensureInitializedFromSchema() {
  const schema = props.schema

  if (!schema) {
    return
  }

  if (isSchemaMap(schema)) {
    if (!isObject(frontmatter.value)) {
      frontmatter.value = {}
    }

    for (const [key, fieldSchema] of schemaEntries(schema)) {
      if (frontmatter.value[key] === undefined) {
        frontmatter.value[key] = createDefaultFromSchema(fieldSchema)
      }
    }

    return
  }

  if (isObjectSchema(schema)) {
    if (!isObject(frontmatter.value)) {
      frontmatter.value = {}
    }

    const properties = schema.properties ?? {}
    for (const [key, fieldSchema] of schemaEntries(properties)) {
      if (frontmatter.value[key] === undefined) {
        frontmatter.value[key] = createDefaultFromSchema(fieldSchema)
      }
    }

    return
  }

  if (isArraySchema(schema) && !Array.isArray(frontmatter.value)) {
    frontmatter.value = []
  }
}

watch(
  () => props.schema,
  () => {
    ensureInitializedFromSchema()
  },
  { immediate: true, deep: true },
)

const objectSchemaEntries = computed(() => {
  if (!props.schema) {
    return [] as Array<[string, SchemaNode]>
  }

  if (isSchemaMap(props.schema)) {
    return schemaEntries(props.schema)
  }

  if (isObjectSchema(props.schema)) {
    return schemaEntries(props.schema.properties ?? {})
  }

  return [] as Array<[string, SchemaNode]>
})

const arrayItemSchema = computed<SchemaNode | null>(() => {
  if (!props.schema || !isArraySchema(props.schema)) {
    return null
  }

  return props.schema.items ?? null
})

function addArrayItem(arrayRef: any[], itemSchema: SchemaNode | null) {
  arrayRef.push(createDefaultFromSchema(itemSchema))
}

function getFieldLabel(key: string, fieldSchema: SchemaNode) {
  return fieldSchema.label || key
}

function getInputTypeFromSchema(schema: SchemaNode | null | undefined) {
  if (!schema || !schema.type) {
    return 'text'
  }

  if (schema.type === 'number') {
    return 'number'
  }

  if (schema.type === 'date') {
    return 'date'
  }

  if (schema.type === 'datetime') {
    return 'datetime-local'
  }

  return 'text'
}

function getUiHintFromSchema(schema: SchemaNode | null | undefined): 'image' | 'pdf' | 'file' | undefined {
  if (!schema || schema.type !== 'string') {
    return undefined
  }

  if (schema['x-ui'] === 'image' || schema['x-ui'] === 'pdf' || schema['x-ui'] === 'file') {
    return schema['x-ui']
  }

  return undefined
}

function removeArrayItem(arrayRef: any[], index: number) {
  if (arrayRef.length <= 1) {
    return
  }

  arrayRef.splice(index, 1)
}
</script>

<template>
  <div
    class="flex flex-col gap-3"
    :class="{
      'border border-gray-200 rounded-sm p-3': props.depth > 0,
      'bg-gray-100/30': props.depth === 1,
      'bg-gray-100/50': props.depth === 2,
      'bg-gray-100/70': props.depth === 3,
      'bg-gray-100/80': props.depth === 4,
      'bg-gray-100/90': props.depth >= 5,
    }"
  >
    <template v-if="props.schema && isArraySchema(props.schema) && Array.isArray(frontmatter)">
      <div
        v-for="(item, index) in frontmatter"
        :key="index"
        class="flex flex-col gap-2"
      >
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="button secondary small"
            :disabled="frontmatter.length <= 1"
            @click="removeArrayItem(frontmatter, index)"
          >
            Entfernen
          </button>
        </div>

        <div v-if="isBooleanSchema(arrayItemSchema)">
          <label class="inline-flex items-center">
            <input
              v-model="frontmatter[index]"
              type="checkbox"
              class="mr-2"
            >
          </label>
        </div>

        <FrontmatterInput
          v-else-if="isPrimitiveSchema(arrayItemSchema)"
          v-model:value="frontmatter[index]"
          label=""
          :input-type="getInputTypeFromSchema(arrayItemSchema)"
          :ui-hint="getUiHintFromSchema(arrayItemSchema)"
        />

        <FrontmatterForm
          v-else-if="isObjectSchema(arrayItemSchema) || isArraySchema(arrayItemSchema)"
          v-model:frontmatter="frontmatter[index]"
          :schema="arrayItemSchema"
          :depth="props.depth + 1"
        />

        <FrontmatterInput
          v-else
          v-model:value="frontmatter[index]"
          label=""
        />
      </div>

      <button
        type="button"
        class="button secondary small self-start"
        @click="addArrayItem(frontmatter, arrayItemSchema)"
      >
        Element hinzufügen
      </button>
    </template>

    <template v-else-if="objectSchemaEntries.length > 0 && isObject(frontmatter)">
      <div
        v-for="entry in objectSchemaEntries"
        :key="entry[0]"
        class="flex flex-col gap-1"
      >
        <label
          v-if="isBooleanSchema(entry[1])"
          class="w-full inline-flex items-center font-bold text-sm"
        >
          <input
            v-model="frontmatter[entry[0]]"
            type="checkbox"
            class="mr-2"
          >
          <span>{{ getFieldLabel(entry[0], entry[1]) }}</span>
        </label>

        <template v-else>
          <p class="font-bold text-sm">
            {{ getFieldLabel(entry[0], entry[1]) }}
          </p>

          <FrontmatterInput
            v-if="isPrimitiveSchema(entry[1])"
            v-model:value="frontmatter[entry[0]]"
            :input-type="getInputTypeFromSchema(entry[1])"
            :ui-hint="getUiHintFromSchema(entry[1])"
          />

          <FrontmatterForm
            v-else-if="isObjectSchema(entry[1]) || isArraySchema(entry[1])"
            v-model:frontmatter="frontmatter[entry[0]]"
            :schema="entry[1]"
            :depth="props.depth + 1"
          />

          <FrontmatterInput
            v-else
            v-model:value="frontmatter[entry[0]]"
          />
        </template>
      </div>
    </template>

    <template v-else>
      <div class="text-sm text-gray-600">
        Keine Felder in der Frontmatter-Konfiguration vorhanden.
      </div>
    </template>
  </div>
</template>
