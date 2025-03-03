<script setup lang="ts">
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});

definePageMeta({
  middleware() {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  },
})

const businessinfo = await $fetch('/api/businessinfo')

const name = ref(businessinfo?.name)
const street = ref(businessinfo?.street)
const city = ref(businessinfo?.city)
const zip = ref(businessinfo?.zip)
const phone = ref(businessinfo?.phone)
const email = ref(businessinfo?.email)
const taxId = ref(businessinfo?.taxId)

const save = async () => {
  await useFetch('/api/businessinfo/save', {
    method: 'POST',
    body: {
      name: name.value,
      street: street.value,
      city: city.value,
      zip: zip.value,
      phone: phone.value,
      email: email.value,
      taxId: taxId.value,
    },
  })

  navigateTo('/')
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">
      Ihr Unternehmen
    </h1>

    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="companyName">Firmenname</label>
        <input id="companyName" type="text" v-model="name" />
      </div>
      <div>
        <label for="companyAddress">Straße/Nr.</label>
        <input id="companyAddress" type="text" v-model="street" />
      </div>
      <div>
        <label for="companyCity">Stadt</label>
        <input id="companyCity" type="text" v-model="city" />
      </div>
      <div>
        <label for="companyZip">PLZ</label>
        <input id="companyZip" type="text" v-model="zip" />
      </div>
      <div>
        <label for="companyPhone">Telefon</label>
        <input id="companyPhone" type="text" v-model="phone" />
      </div>
      <div>
        <label for="companyEmail">E-Mail</label>
        <input id="companyEmail" type="email" v-model="email" />
      </div>
      <div>
        <label for="companyTaxId">USt-IdNr.</label>
        <input id="companyTaxId" type="text" v-model="taxId" />
      </div>
    </form>
    <div class="mt-4 flex justify-end">
      <button type="submit" class="button" @click="save">
        Speichern
      </button>
    </div>
  </div>
</template>