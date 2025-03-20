<script setup lang="ts">
import type { Website } from '~/types';

const props = defineProps<{
  website: Website
}>()

const firstname = ref('');
const lastname = ref('');
const phone = ref('');
const email = ref('');
const message = ref('');

const isSending = ref(false);
const showSuccess = ref(false);

const submit = async () => {
  isSending.value = true;
  await $fetch('/api/contactForm/send', {
    method: 'POST',
    body: JSON.stringify({
      websiteId: props.website.id,
      firstname: firstname.value,
      lastname: lastname.value,
      phone: phone.value,
      email: email.value,
      message: message.value
    })
  })
  isSending.value = false;
  showSuccess.value = true;
}
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div class="w-full p-6 sm:p-12 lg:p-24" id="contact">
      <div class="w-full max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-8">
          Kontakt
        </h2>
        <div v-if="showSuccess" class="bg-green-100 border border-green-200 text-green-800 p-4 rounded mb-4">
          Ihre Nachricht wurde erfolgreich versendet.
        </div>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Vorname" name="firstname" size="xl" class="w-full">
              <UInput v-model="firstname" class="w-full" />
            </UFormField>
            <UFormField label="Nachname" name="lastname" size="xl" class="w-full">
              <UInput v-model="lastname" class="w-full" />
            </UFormField>
            <UFormField label="Telefon" name="phone" size="xl" class="w-full">
              <UInput v-model="phone" class="w-full" />
            </UFormField>
            <UFormField label="E-Mail" name="email" size="xl" class="w-full">
              <UInput v-model="email" class="w-full" />
            </UFormField>
            <UFormField label="Nachricht" name="message" size="xl" class="w-full col-span-2">
              <UTextarea v-model="message" class="w-full" />
            </UFormField>
            <div class="col-span-2 flex justify-end">
              <UButton @click="submit" :loading="isSending" size="xl">
                Absenden
              </UButton>
            </div>
          </div>
          <div class="mt-4 text-right">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>