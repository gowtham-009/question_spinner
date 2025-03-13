<template>
   <Toast class="w-100" group="tl" />
 
   <div class="w-full p-1 mt-1">
      <P class="text-center text-slate-500" style="font-size: 1.5rem;">Spinner Win</P>
   </div>

  
  <div class="container">
    <div class="w-full p-1 flex justify-start items-center gap-2" style="border: 1px solid red;">
      <div class="w-12 h-12" style="border: 1px solid red;;"></div>  <p>{{ name }}</p>
</div>
    <div class="chart-wrapper">
      <div ref="chart" class="chart"></div>
    </div>
  
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import { useToast } from 'primevue/usetoast';
import { useConfetti } from '~/composables/useConfetti';



const toast = useToast();
const { fireConfetti } = useConfetti();

const chart = ref(null);
const question = ref('Click the wheel to spin!');
let rotation = 0, oldrotation = 0, picked = 100000, oldpick = [];

const data = [
  { label: "GOWTHAM", value: 1 },
  { label: "KABILAN", value: 2 },
  { label: "ABILASH", value: 3},
  { label: "GOPINATH", value: 4 }
];

const name=ref('')
onMounted(() => {
  const playername=localStorage.getItem('playername')
  name.value=playername
  if (!chart.value) return;

  const width = Math.min(window.innerWidth * 0.8, 500);
  const height = width;
  const radius = width / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);
 
  const svg = d3.select(chart.value)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`) // Scales for mobile
    .attr("preserveAspectRatio", "xMidYMid meet") // Keeps proportions
    .style("max-width", "100%") // Ensures responsiveness
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

    const boxElement = document.querySelector(".w-12.h-12");
  const boxBgColor = window.getComputedStyle(boxElement).backgroundColor || "gray";

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .attr("dy", "0.35em")
    .attr("x", 0)
    .attr("y", 0)
    .style("background-color", boxBgColor)
    .text(name.value);
  // Arrow Pointer
  svg.append("polygon")
    .attr("points", "0,-15 -10,-30 10,-30")  // Smaller for mobile
    .attr("fill", "red")
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("transform", `translate(0, -${radius})`);

  const pie = d3.pie().sort(null).value(() => 1);
  const arc = d3.arc().innerRadius(0).outerRadius(radius - 20);

  const wheelGroup = svg.append("g").attr("class", "wheel");

  const arcs = wheelGroup.selectAll("g.slice")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs.append("path")
    .attr("fill", (_, i) => color(i))
    .attr("d", arc);

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px") // Smaller font for mobile
    .attr("fill", "white")
    .text((_, i) => data[i].label);

  const button = svg.append("g")
    .attr("class", "spin-button")
    .attr("transform", "translate(0,0)")
    .style("cursor", "pointer")
    .on("click", spin);

  button.append("circle")
    .attr("r", 40) // Smaller button for mobile
    .style("fill", "white");

  button.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "18px") // Adjust text size
    .attr("font-weight", "bold")
    .attr("dy", "0.35em")
    .text("SPIN");

  function spin() {
    if (oldpick.length === data.length) return;
    
    const sliceAngle = 360 / data.length;
    const randomDegree = Math.floor(Math.random() * 1440 + 360);
    rotation = Math.round(randomDegree / sliceAngle) * sliceAngle;
    picked = Math.round(data.length - (rotation % 360) / sliceAngle);
    picked = picked >= data.length ? picked % data.length : picked;

    if (oldpick.includes(picked)) {
      spin();
      return;
    } else {
      oldpick.push(picked);
    }

    wheelGroup.transition()
      .duration(3000)
      .attrTween("transform", () => {
        const interpolate = d3.interpolate(oldrotation % 360, rotation);
        return t => `rotate(${interpolate(t)})`;
      })
      .on("end", () => {
        question.value = data[picked].question;
        oldrotation = rotation;
        console.log("You won:", data[picked].label);

        toast.add({ severity: 'success', summary: 'Price Winning', detail:  data[picked].label, group: 'tl', life: 3000 });
        fireConfetti();
      });
  }
});


</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
 
}

.chart-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.chart {
  width: 80vw; /* Use viewport width */
  height: 80vw; /* Maintain aspect ratio */
  max-width: 500px;
  max-height: 500px;
  margin-bottom: 20px;
}

.question-box {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 16px;
  width: 90%;
  max-width: 400px;
}

/* Responsive Design for Mobile Screens */
@media (max-width: 600px) {
  .chart {
    width: 90vw;
    height: 90vw;
  }

  .question-box {
    font-size: 14px;
    padding: 12px;
  }
}


</style>
