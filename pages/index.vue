<template>
  <Toast position="top-right" group="tl" />
  <div class="p-2">

    <div class="overflow-hidden rounded-lg w-full bg-white shadow" >
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="onSubmit">
          <div class="w-full">
            <label for="name" class="block text-md font-medium text-gray-900">Name</label>
            <div class="mt-1">
              <input type="text" name="name" v-model="name" @input="formatInput"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter a name" />
            </div>
            <button type="submit"
              class="rounded-md w-full mt-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
          </div>
        </form>
      </div>
    </div>

   


  </div>
</template>

<script setup>

import { useToast } from 'primevue/usetoast';
import 'primeicons/primeicons.css'
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();


const name = ref('')

const formatInput = (event) => {
  let value = event.target.value

  name.value = value.replace(/[^a-zA-Z-.]/g, '').toUpperCase()
}



const onSubmit = () => {
  if (!name.value) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Name is Required', group: 'tl', life: 3000 });
  }
  else {
    localStorage.setItem('playername', name.value)
   router.push('/question')

   
  }

}



 
</script>

<style>
.op {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>