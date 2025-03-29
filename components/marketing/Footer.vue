<script setup lang="ts">

</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="flex flex-col justify-center pb-16 lg:pb-24">
        <div class="flex items-center gap-6">
          <div>
            <h2 class="text-xl font-semibold text-primary-600">
              Einfach erklärt
            </h2>
            <p class="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Datenschutz und Sicherheit
            </p>
          </div>
        </div>
        <p class="mt-8 text-lg/8 text-gray-600">
          Jeder Gewerbetreibende, der personenbezogene Daten erhebt und verarbeitet, ist gesetzlich dazu verpflichtet, mit diesen Daten sorgfältig umzugehen und betroffenen Personen Auskunft zu gewähren.
          Diese Auskunft hilft einem natürlich nicht viel, wenn sie in einem juristischen Fachtext verpackt ist.
          Ein wichtiger Aspekt einer Datenschutzerklärung ist für mich daher folgender:
        </p>
        <p class="border-l-4 border-gray-300 rounded-lg p-4 mt-4 text-lg/8 text-gray-500">
          Der Verantwortliche trifft geeignete Maßnahmen, um der betroffenen Person alle Informationen [...] in <span class="font-bold">präziser, transparenter, verständlicher und leicht zugänglicher Form</span> in einer <span class="font-bold">klaren und einfachen Sprache</span> zu übermitteln.
          <span class="block mt-2 text-sm text-gray-400">
            Art. 12 Abs. 1 DSGVO
          </span>
        </p>
        <p class="mt-4 text-lg/8 text-gray-600">
          Gleichzeitig muss sie natürlich den gesetzlichen Anforderungen genügen und Maßnahmen müssen korrekt umgesetzt werden.
          Für Einzelunternehmer und kleine Unternehmen kann es in vielen Fällen aber auch recht überschaubar bleiben.
          Nutze den Generator, um deine Datenschutzerklärung zu erstellen oder informiere dich über den Datenschutz bei Solihost.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <UButton
            to="/datenschutz"
            target="_blank"
            size="xl"
            variant="ghost"
            icon="i-heroicons-shield-check"
          >
            Solihost Datenschutzerklärung
          </UButton>
          <UButton
            to="/datenschutz-erstellen"
            target="_blank"
            size="xl"
            variant="ghost"
            icon="i-heroicons-cursor-arrow-rays"
            disabled
          >
            Datenschutzerklärung erstellen
          </UButton>
          <UButton
            to="/impressum-erstellen"
            target="_blank"
            size="xl"
            variant="ghost"
            icon="i-heroicons-cursor-arrow-rays"
            disabled
          >
            Impressum erstellen
          </UButton>
        </div>
      </div>
    </div>
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="flex flex-col justify-center pb-16 lg:pb-24">
        <div class="flex items-center gap-6">
          <div>
            <p class="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Impressum
            </p>
            <h2 class="text-xl font-semibold text-gray-400">
              Gemäß § 5 DDG
            </h2>
          </div>
        </div>
        <h2 class="mt-8 text-lg/8 font-bold">
          Inhaltlich verantwortlich:
        </h2>
        <p class="text-lg/8 text-gray-600">
          Markus Kottländer
          <br />
          Gertrudenstraße 23a
          <br />
          49074 Osnabrück
          <br />
          <br />
          <strong>Telefon:</strong> +49 123 456789
          <br />
          <strong>E-Mail</strong> kontakt@markus-kottlaender.de
        </p>
      </div>
    </div>
  </div>
</template>