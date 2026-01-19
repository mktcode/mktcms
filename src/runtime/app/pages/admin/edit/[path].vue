<script setup lang="ts">
import Admin from '../../../components/admin.vue'
import Header from '../../../components/header.vue'
import Image from '../../../components/content/editor/image.vue'
import Pdf from '../../../components/content/editor/pdf.vue'
import Markdown from '../../../components/content/editor/markdown.vue'
import Csv from '../../../components/content/editor/csv.vue'
import Txt from '../../../components/content/editor/txt.vue'
import Breadcrumb from '../../../components/content/breadcrumb.vue'
import usePathParam from '../../../composables/usePathParam'

const { isImage, isPdf, isMarkdown, isCsv, isText } = usePathParam()
</script>

<template>
  <Admin>
    <Header />
    <Breadcrumb />
    <Image v-if="isImage" />
    <Pdf v-else-if="isPdf" />
    <Markdown v-else-if="isMarkdown" />
    <Csv v-else-if="isCsv" />
    <Txt v-else-if="isText" />
  </Admin>
</template>
