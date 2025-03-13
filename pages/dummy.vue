<template>
       <Toast class="w-100" group="tl" />
     <div class="w-full flex items-center gap-2" style=" position: absolute; top: 13%; z-index: 2; padding: 2%;">
           <div class="w-12 h-12 rounded-full" :style="{backgroundColor:bgcol}" ></div> <p class="text-white text-lg">{{ name }}</p>
    </div>
      
    <div id="app" v-cloak>
      <!-- Lucky wheel -->
     
      <div class="lucky-wheel">
    
        <div class="pointer-container">
          <div class="pointer" ref="pointer" id="pointer" :style="{ transform: rotate_deg, transition: prize_transition }" @click="rotateHandler(num)">
          </div>
        </div>
        <div :class="containerClass">
          <div v-for="(item, index) in prizes" :key="index" ref="items" :class="itemClass">
            <div :class="contentClass">
              <i class="material-icons">{{ item.icon }}</i>
              <span>{{ item.name }} <span :class="countClass">{{ item.count }}</span></span>
            </div>
          </div>
        </div>
  
       
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from "vue";
  import { useToast } from 'primevue/usetoast';
import { useConfetti } from '~/composables/useConfetti';
  const toast = useToast();
  const { fireConfetti } = useConfetti();

  const current_year = ref(2017);
  const time_remaining = ref(20);
  const isClicked = ref(false);
  const isShow = ref(true);
  const prize_name = ref("");
  const prize_icon = ref("");
  const prize_rotate = ref([]);
  const prize_transition = ref("");

  const rotate_deg = ref("rotate(0deg)");
  const start_deg = ref(0);
  const current_deg = ref(0);
  const index = ref(0);
  const duration = ref(3000);
  const num = ref(0);
  const numbers = ref([]);
  const pointer = ref(null);
  const items = ref([]);
  
  const prizes = ref([]);
  const prizes_2017 = ref([]);
 
  const bgcol=ref('')
  const containerClass = computed(() => (current_year.value === 2017 ? "container" : "container container-large"));
  const itemClass = computed(() => (current_year.value === 2017 ? "item item-skew" : "item item-skew-large"));
  const contentClass = computed(() => (current_year.value === 2017 ? "item-content" : "item-content item-content-large"));
  const countClass = computed(() => (current_year.value === 2017 ? "count" : "count count-large"));
  
  const name=ref('')
  onMounted(() => {
  initPrize();
  
  // Wait for the DOM to be updated before accessing elements
  setTimeout(() => {
    getInitialPrizeBgColor();
  }, 100);
});

const getInitialPrizeBgColor = () => {
  const playerName = localStorage.getItem("playername");
  name.value=playerName
  if (!playerName) return;

  // Find the corresponding prize element
  const selectedItem = items.value.find((el) => 
    el.textContent.includes(playerName)
  );

  if (selectedItem) {
    let bgColor = window.getComputedStyle(selectedItem).backgroundColor;
    bgcol.value=bgColor
  } else {
    console.log("No matching prize found for:", playerName);
  }
};

 
  
  const restart = () => {
    if (items.value.length > 0) {
      items.value[index.value].classList.value = itemClass.value;
    }
    time_remaining.value = current_year.value === 2017 ? 20 : 120;
    reset();
    current_year.value === 2017 ? initPrize() :'';
  };
  
  const reset = () => {
    isShow.value = true;
    index.value = 0;
    prize_name.value = "";
    prize_icon.value = "";
    prize_rotate.value = [];
    numbers.value = [];
    start_deg.value = 0;
    rotate_deg.value = "rotate(0deg)";
    current_deg.value = 0;
    isClicked.value = false;
    prize_transition.value = "none";
  };
  
  const initPrize = () => {
    prizes_2017.value = [
      { name: "GOWTHAM"},
      { name: "KABILAN" },
      { name: "ABILASH" },
      { name: "GOPI" }

    ];
    num.value = prizes_2017.value.length;
    degree(num.value);
    prizes.value = prizes_2017.value;
    numberArray();
  };
  
  const degree = (num) => {
    prize_rotate.value = Array.from({ length: num }, (_, i) => (i + 1) * (360 / num));
  };
  
  const numberArray = () => {
    numbers.value = prizes.value.map((_, i) => i);
  };
  
  // Watchers
  watch(current_year, restart);
  
  // Lifecycle Hook
  onMounted(() => {
    initPrize();
  });
  const rotateHandler = (num) => {
  if (isClicked.value) return;

  isClicked.value = true;
  prize_transition.value = `transform ${duration.value}ms cubic-bezier(0.25, 1, 0.5, 1)`;

  let randomIndex = Math.floor(Math.random() * num);
  index.value = randomIndex;

  let rotateValue = 360 * 5 + prize_rotate.value[randomIndex];
  rotate_deg.value = `rotate(${rotateValue}deg)`;

  setTimeout(() => {
    isShow.value = !isShow.value;
    prize_name.value = prizes.value[randomIndex].name;
   
    toast.add({ severity: 'success', summary: 'Price Winning', detail: prize_name.value, group: 'tl', life: 3000 });
    fireConfetti();
  }, duration.value);
};

  </script>
  
  <style lang="scss" scoped>
$primary-color: #343baa;
$primary-color-dark: #1f1172;
$secondary-color: #f0beff;
$access-color: #ff00ba;
$duration: 3s;

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

[v-cloak] {
  display: none !important;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  font-family: "Roboto Condensed", sans-serif;
  position: relative;
  background-color: #5858b9;
  user-select: none;

}

.lucky-wheel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  justify-content: center;
  align-items: center;
  z-index: 3;
 
  .container {
  display: block;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  transform: rotate(-30deg);
  border: 10px solid #32043e; /* White border */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Optional shadow */
}




  .container {
    display: block;
    width: 520px;
    height: 520px;
    border-radius: 520px;
    overflow: hidden;
    position: relative;
    transform: rotate(-30deg);

    &.container-large {
      transform: rotate(-18deg);
    }
  }
}

.pointer-container {
  display: flex;
  width: 128px;
  height: 208px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  position: absolute;
  color: $access-color;
  font-size: 2rem;

  &::after {
    display: block;
    content: "PRESS";
    font-size:large;
    width: 120px;
    height: 120px;
    border-radius: 120px;
    background-color: #1f1172;
    line-height: 120px;
    text-align: center;
    font-weight: bold;
  }

  .pointer {
    width: 128px;
    height: 208px;
    display: block;
    background-image: url("https://raw.githubusercontent.com/HuiyuLiz/vue-lucky-wheel/306abe15b78c71c3cd25ed8eaf97554101fd405e/svg/hand.svg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    bottom: 39.7px;
    transform-origin: 64px 144px;
    cursor: pointer;
  }
}

.item {
  position: absolute;
  display: flex;
  width: 50%;
  height: 50%;
  border: 1px solid #1f1172;
  top: 0;
  right: 0;
  transform-origin: 0% 100%;
  justify-content: center;
  align-items: center;
}

$n: 4;

@for $i from 1 through $n {
  $deg: 360deg / $n;

  .item-skew:nth-child(#{$i}) {
    transform: rotate($deg * $i) skewY($deg - 90);
  }
}

.item-content {
  display: flex;
  width: 100px;
  align-items: center;
  flex-direction: column;
  font-size: 2rem;
  font-weight: bold;
  transform-origin: center center;

  transform: skewY(0deg) rotate(44deg) translate(-133px, -29px);
  position: absolute;
  right: 0;
  bottom: 0;

  &.item-content-large {
    transform: skewY(72deg) rotate(9deg) translate(-22px, -10px);
    position: absolute;
    left: 0;
    top: 200px;
  }

  .count {
    position: absolute;
    left: 28px;
    top: 112px;
    font-size: 1.2rem;
    text-align: center;
    width: 45px;
    line-height: 25px;
    border-radius: 30px;
    display: block;

    &.count-large {
      left: 39px;
      top: 40px;
      font-size: 1rem;
      width: 25px;
      line-height: 25px;
      border-radius: 25px;
    }
  }

  > i {
    font-size: 4rem;
  }
}
// Define four different colors
$item-color-1: #1d798c; // Red
$item-color-2: #3d7dd6; // Green
$item-color-3: #09144a; // Blue
$item-color-4: #893f68; // Pink

// Assign colors based on position in the wheel
.item:nth-child(4n + 1) {
  background-color: $item-color-1;

  .item-content {
    color: white;
  }

  .count {
    color: $item-color-1;
    background-color: white;
  }
}

.item:nth-child(4n + 2) {
  background-color: $item-color-2;

  .item-content {
    color: white;
  }

  .count {
    color: $item-color-2;
    background-color: black;
  }
}

.item:nth-child(4n + 3) {
  background-color: $item-color-3;

  .item-content {
    color: white;
  }

  .count {
    color: $item-color-3;
    background-color: yellow;
  }
}

.item:nth-child(4n + 4) {
  background-color: $item-color-4;

  .item-content {
    color: white;
  }

  .count {
    color: $item-color-4;
    background-color: black;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .lucky-wheel {
    .container {
      width: 300px;
      height: 300px;
      border-radius: 300px;
    }
  }

  .pointer-container {
    width: 80px;
    height: 130px;

    &::after {
        font-size: small;
      width: 80px;
      height: 80px;
      line-height: 80px;
     
    }

    .pointer {
      width: 80px;
      height: 130px;
      transform-origin: 40px 90px;
      bottom: 25px;
    }
  }

  .item-content {
    font-size: 1.2rem;
    transform: skewY(0deg) rotate(50deg) translate(-60px, -29px);

    &.item-content-large {
      transform: skewY(72deg) rotate(9deg) translate(-12px, -5px);
    }

    .count {
      font-size: 0.8rem;
      left: 15px;
      top: 70px;
      width: 30px;
      line-height: 20px;

      &.count-large {
        left: 20px;
        top: 25px;
        font-size: 0.8rem;
        width: 20px;
        line-height: 20px;
      }
    }

    > i {
      font-size: 2rem;
    }
  }
}

@media (max-width: 480px) {
  .lucky-wheel {
    .container {
      width: 250px;
      height: 250px;
      border-radius: 250px;
    }
  }

  .pointer-container {
    width: 60px;
    height: 100px;

    &::after {
        font-size: small;
      width: 60px;
      height: 60px;
      line-height: 60px;
    
    }

    .pointer {
      width: 60px;
      height: 100px;
      transform-origin: 30px 70px;
      bottom: 20px;
    }
  }

  .item-content {
    font-size: 1rem;
    transform: skewY(0deg) rotate(45deg) translate(-45px, -31px);
    &.item-content-large {
    transform: skewY(30deg) rotate(45deg) translate(-36px, -35px);
    }

    .count {
      font-size: 0.7rem;
      left: 10px;
      top: 50px;
      width: 25px;
      line-height: 15px;

      &.count-large {
        left: 15px;
        top: 20px;
        font-size: 0.7rem;
        width: 15px;
        line-height: 15px;
      }
    }

    > i {
      font-size: 1.5rem;
    }
  }
}

</style>