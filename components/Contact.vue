<script setup lang="ts">
const name = ref('');
const email = ref('');
const message = ref('');
const isSending = ref(false);
const showThanksMessage = ref(false);
const showErrorMessage = ref(false);

const submit = async () => {
  isSending.value = true;

  const response = await $fetch('/api/mail/send', {
    method: 'POST',
    body: { name: name.value, email: email.value, message: message.value },
  });

  isSending.value = false;

  if (response.success) {
    showThanksMessage.value = true;
  } else {
    showErrorMessage.value = true;
  }
}
</script>

<template>
  <section id="contact" class="pb-16 bg-white relative">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="absolute top-0 left-0 w-full z-50">
      <path fill="#f3f4f6" fill-opacity="1" d="M0,160L48,165.3C96,171,192,181,288,197.3C384,213,480,235,576,213.3C672,192,768,128,864,96C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
    </svg>
    <img src="/img/header6.jpg" alt="Kontakt" class="w-full h-[900px] object-cover bg-bottom mb-8 relative z-40 saturate-[75%]">
    <div class="max-w-5xl rounded-lg mx-auto p-12 bg-white -mt-[800px] shadow-2xl relative z-50 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Kontakt</h2>
        <p class="text-xl text-gray-600 leading-relaxed">
          Du hast Fragen zu meinen Angeboten oder möchtest einen Termin vereinbaren? Schreib mir einfach eine Nachricht oder ruf an.
        </p>
        <div class="flex flex-col space-y-4 mt-8">
          <span class="flex items-start space-x-10 text-xl text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 opacity-40">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
            <span>
              Ertmanplatz 6<br>
              49082 Osnabrück
            </span>
          </span>
          <a href="#" class="flex items-center space-x-10 text-xl text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 opacity-40">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            0541 40 89 747
          </a>
          <a href="#" class="flex items-center space-x-10 text-xl text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 opacity-40">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
            </svg>
            kontakt@fayo-coach.de
          </a>
        </div>    
      </div>
      <div v-if="showThanksMessage">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Vielen Dank!</h2>
        <p class="text-xl text-gray-600 leading-relaxed">
          Deine Nachricht wurde erfolgreich versendet. Ich werde mich in Kürze bei dir melden.
        </p>
      </div>
      <div v-else-if="showErrorMessage">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Fehler!</h2>
        <p class="text-xl text-gray-600 leading-relaxed">
          Beim Versenden deiner Nachricht ist ein Fehler aufgetreten. Bitte versuche es später erneut.
        </p>
      </div>
      <form v-else class="max-w-lg grow" @submit.prevent="submit">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="name">Name</label>
          <input id="name" type="text" placeholder="Dein Name" v-model="name">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">E-Mail</label>
          <input id="email" type="email" placeholder="Deine E-Mail-Adresse" v-model="email">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="phone">Telefon</label>
          <input id="phone" type="tel" placeholder="Deine Telefonnummer">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="message">Nachricht</label>
          <textarea id="message" rows="4" placeholder="Deine Nachricht" v-model="message"></textarea>
        </div>
        <button type="submit" class="button w-full">
          <span v-if="isSending">Nachricht wird gesendet...</span>
          <span v-else>Nachricht senden</span>
        </button>
      </form>
    </div>
  </section>
</template>