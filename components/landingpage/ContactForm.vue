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
  <div>
    <div class="bg-gray-100 py-12">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Kontakt</h2>
        <div v-if="showSuccess" class="bg-green-100 border border-green-200 text-green-800 p-4 rounded mb-4">
          Ihre Nachricht wurde erfolgreich versendet.
        </div>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-xl font-bold">Vorname</h3>
              <input type="text" class="w-full border border-gray-300 rounded p-2" v-model="firstname" />
            </div>
            <div>
              <h3 class="text-xl font-bold">Nachname</h3>
              <input type="text" class="w-full border border-gray-300 rounded p-2" v-model="lastname" />
            </div>
            <div>
              <h3 class="text-xl font-bold">Telefon</h3>
              <input type="text" class="w-full border border-gray-300 rounded p-2" v-model="phone" />
            </div>
            <div>
              <h3 class="text-xl font-bold">E-Mail</h3>
              <input type="text" class="w-full border border-gray-300 rounded p-2" v-model="email" />
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-xl font-bold">Nachricht</h3>
            <textarea class="w-full border border-gray-300 rounded p-2" v-model="message"></textarea>
          </div>
          <div class="mt-4 text-right">
            <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="submit">
              Absenden
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>