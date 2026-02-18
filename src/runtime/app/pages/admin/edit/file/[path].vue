<script setup lang="ts">
import Admin from '../../../../components/admin.vue'
import Header from '../../../../components/header.vue'
import Image from '../../../../components/content/editor/image.vue'
import Pdf from '../../../../components/content/editor/pdf.vue'
import Csv from '../../../../components/content/editor/csv.vue'
import Txt from '../../../../components/content/editor/txt.vue'
import usePathParam from '../../../../composables/usePathParam'

const { isImage, isPdf, isCsv, isText } = usePathParam()
</script>

<template>
  <Admin>
    <Header />
    <Image v-if="isImage" />
    <Pdf v-else-if="isPdf" />
    <Csv v-else-if="isCsv" />
    <Txt v-else-if="isText" />
    <div v-else>
      Unbekannter Dateityp.
    </div>
  </Admin>
</template>
