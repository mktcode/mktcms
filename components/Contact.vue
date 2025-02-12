<template>
  <section id="contact" class="py-16 bg-white relative">
    <img src="/img/contact-header.jpg" alt="Kontakt" class="w-full object-cover bg-bottom mb-8 relative z-40">
    <div class="max-w-5xl rounded-lg mx-auto p-12 bg-white -mt-72 relative z-50 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Kontakt</h2>
        <p class="text-xl text-gray-600 leading-relaxed">
          Du hast Fragen zu meinen Angeboten oder möchtest einen Termin vereinbaren? Schreib mir einfach eine Nachricht oder ruf mich an.
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
      <form class="max-w-lg grow">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="name">Name</label>
          <input id="name" type="text" placeholder="Dein Name">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">E-Mail</label>
          <input id="email" type="email" placeholder="Deine E-Mail-Adresse">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="message">Nachricht</label>
          <textarea id="message" rows="4" placeholder="Deine Nachricht"></textarea>
        </div>
        <button type="submit" class="button w-full">
          Nachricht senden
        </button>
      </form>
    </div>
  </section>
</template>