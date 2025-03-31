<script setup lang="ts">

</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="flex flex-col justify-center py-16 lg:py-24">
        <div class="flex items-center gap-6">
          <img src="~/assets/img/mkt.png" alt="" class="size-24 rounded-xl object-cover object-center" />
          <div>
            <h2 class="text-xl font-semibold text-primary-600">@mkt: Hi!</h2>
            <p class="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Ein Gruß vom Entwickler
            </p>
          </div>
        </div>
        <p class="mt-8 text-lg/8 text-gray-600">
          Ich bin Markus, der Entwickler von Solihost. In den letzten 20 Jahren habe ich meist als Allrounder gearbeitet,
          von der Systemadministration und Softwareentwicklung über Redaktion und Design bis zur Kundenberatung. Ich mag es, aus der Vogelperspektive auf Dinge zu schauen.
          Die oft recht starre Rollenverteilung in der IT-Branche liegt mir nicht so sehr und ich bevorzuge einen agileren Ansatz.
        </p>
        <p class="mt-4 text-lg/8 text-gray-600">
          Solihost ist das Ergebnis - Eine technische Infrastruktur (man könnte auch "App" dazu sagen), die eine Reihe von Grundbedürfnissen abdeckt und möglichst kosteneffizient betrieben wird.
          Als Nutzer gestaltest du diese mit und hilfst, die Kosten zu decken. Und neben all dem üblichen Produkt-Geschwafel, soll hier vor allem auch die persönliche Unterstützung im Vordergrund stehen.
          Du bist hier kein anonymer Nutzer, sondern ein Mensch mit einem Anliegen und ich versuche dir dabei zu helfen, so gut ich kann.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <UButton
            to="tel:017670864627"
            size="xl"
            variant="ghost"
            icon="i-heroicons-phone"
          >
            0176 708 646 27
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>