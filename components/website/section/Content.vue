<script setup lang="ts">
const props = defineProps<{
  contentId: number | null;
}>();

let contentId: number | string | null = props.contentId;

const route = useRoute();

if (!contentId) {
  const contentSlug = Array.isArray(route.params.pageSlug) ? route.params.pageSlug : [route.params.pageSlug];
  contentId = contentSlug.pop() || null;

  if (!contentId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Content not found'
    });
  }
}

const content = await useContentById(contentId);

if (!content) {
  throw createError({
    statusCode: 404,
    statusMessage: 'About content not found'
  });
}
</script>

<template>
  <section id="about" class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12">
        <img
          v-if="content.image"
          :src="`/files/${content.image}`"
          alt="kein Bild"
          class="rounded-full w-64 h-64"
        >
        <div class="about-content">
          <h3 class="text-2xl font-bold text-rose-900 mb-4">
            {{ content.subtitle }}
          </h3>
          <h2 class="text-4xl md:text-6xl font-bold text-indigo-950">
            {{ content.title }}
          </h2>
          <div v-html="content.description" />
        </div>
      </div>
    </div>
  </section>
</template>