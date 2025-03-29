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
          Ich bin Markus, der Entwickler von Solihost, einem Leidenschaftsprojekt, das ich nach 20 Jahren in der IT-Branche endlich umsetzen kann.
          In dieser Zeit habe ich meist als Allrounder gearbeitet, von der Systemadministration über Redaktion bis zum Design.
          Ich liebe es, komplexe Systeme zu entwickeln, technische und fachliche Herausforderungen zu meistern und damit einen Mehrwert zu schaffen.
        </p>
        <p class="mt-4 text-lg/8 text-gray-600">
          Die starre und zergliederte Rollenverteilung in der Branche liegt mir aber nicht.
          Ich möchte auch nicht für große Konzerne arbeiten, sondern für und mit Menschen, die einfach Hilfe mit diesem ganzen Technik-Kram brauchen und mit einem begrenzten Budget auskommen müssen.
          Daraus ist Solihost entstanden.
        </p>
        <p class="mt-4 text-lg/8 text-gray-600">
          Die Infrastruktur für so einen Service ist natürlich nicht ganz trivial.
          Vor allem wenn es um Datenschutz und Datensicherheit geht, braucht es viel Liebe zum Detail.
          Die Entwicklung wird noch ein bisschen dauern, findet aber öffentlich und transparent statt.
          Es gibt kein ausformuliertes Konzept, keinen Plan und keine Roadmap. Solihost entsteht einfach.
          Ich freue mich über Kommentare und Anregungen.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <UButton
            to="https://github.com/users/mktcode/projects/6"
            target="_blank"
            size="xl"
            variant="ghost"
            icon="i-heroicons-code-bracket"
          >
            Entwicklung verfolgen
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>