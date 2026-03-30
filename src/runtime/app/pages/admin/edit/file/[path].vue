<script setup lang="ts">
import Admin from '../../../../components/admin.vue'
import AdminWorkspace from '../../../../components/adminWorkspace.vue'
import Image from '../../../../components/content/editor/image.vue'
import Pdf from '../../../../components/content/editor/pdf.vue'
import Csv from '../../../../components/content/editor/csv.vue'
import Txt from '../../../../components/content/editor/txt.vue'
import usePathParam from '../../../../composables/usePathParam'

const { isImage, isPdf, isCsv, isText } = usePathParam()
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <div class="flex flex-1 flex-col min-h-0 p-4 md:px-6 overflow-y-auto max-w-[64rem]">
        <Image v-if="isImage" />
        <Pdf v-else-if="isPdf" />
        <Csv v-else-if="isCsv" />
        <Txt v-else-if="isText" />
        <div v-else>
          Unbekannter Dateityp.
        </div>
      </div>
    </AdminWorkspace>
  </Admin>
</template>
