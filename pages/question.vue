<template>
    <div class="p-2">
        <div class="overflow-hidden rounded-lg w-full bg-white shadow">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="question1">
          <div class="w-full">
              <p><span>01.</span>Which city is the capital of Tamil Nadu?</p>
              <div v-for="options in question_option1" :key="options.id" class="flex items-center mt-2" >
                <input :id="options.id" :value="options.id" v-model="selected_answer" name="notification-method"
                  type="radio"
                  class="relative w-4 h-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden" />
                <label :for="options.id" class="ml-3 block text-sm/6 font-medium text-gray-900">{{
                  options.title }}</label>
              </div>
            </div>

            <div class="w-full mt-1">
              <button type="submit"  :disabled="timeLeft === 0 ||result ==='Correct Answer' ||  result === 'Incorrect'" class="rounded-md w-full bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm 
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                focus-visible:outline-green-500 disabled:bg-gray-300">
               <span>Time: {{ timeLeft }}</span><br>
               <span class="text-lg">Submit</span>
              </button>
            </div>

        <div class="w-full mt-2">
          <span :class="{
            'text-green-500 pi pi-check': result === 'Correct Answer',
            'text-red-500 pi pi-times': result === 'Incorrect'
          }"> 
           {{ result }}
          </span>
        </div>

        <div class="w-full mt-2" v-if="spinbtn">
              <button @click="spinnerpage" class="rounded-md w-full bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm 
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-indigo-500 disabled:bg-gray-300">
                Spin to Win
              </button>
            </div>

        </form>
      </div>
    </div>
    </div>
</template>

<script setup>
import 'primeicons/primeicons.css'
import { useRouter } from 'vue-router';

const router = useRouter();

const question_option1 = [
    { id: 'Chennai', title: 'Chennai' },
    { id: 'Madurai', title: 'Madurai' },
    { id: 'Thanjavur', title: 'Thanjavur' },
    { id: 'Trichy', title: 'Trichy' },
  ]


  const timeLeft = ref(30);
let timer = null;

  
onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      if (timeLeft.value == 0) {
        clearInterval(timer);
      }
    } else {
      clearInterval(timer);
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

 
const selected_answer=ref('')
  const answer = ['Chennai']
const result=ref('')
const spinbtn=ref(false)

  const question1 = () => {
    if (answer.includes(selected_answer.value)) {
      result.value = 'Correct Answer'
      clearInterval(timer);
      spinbtn.value=true
     
  
    }
    else if (result.value ='Incorrect') {
      result.value = 'Incorrect'
      clearInterval(timer);
     setTimeout(() => {
        router.push('/')
     }, 1000);
     
    }
  
  }
 
  const spinnerpage=()=>{
    router.push('/dummy')
  }

</script>

<style >

</style>