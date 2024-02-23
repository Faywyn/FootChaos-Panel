<template>
  <main>
    <Transition name="fade">
      <Line v-if="displayChart" class="chart" ref="statChart" :options="chartOptions" :data="chartData"
        @click="chartClick" />
    </Transition>

    <div class="buttons">
      <button :class="shownData[0] ? 'best b-open' : 'best'" @click="updateShown(0)">Best</button>
      <button :class="shownData[1] ? 'average a-open' : 'average'" @click="updateShown(1)">Average</button>
      <button :class="shownData[2] ? 'time t-open' : 'time'" @click="updateShown(2)">Time</button>
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active {
  transition: all 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

main {
  width: 100%;

  .chart {
    width: 100%;
    /* background-color: blue; */
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 2rem 0;
    margin-left: auto;
    margin-right: auto;

    button {
      width: 7rem;
      height: 2rem;
      font-size: 1rem;
      padding: 0;
      background: none;
      border-style: solid;
      color: #ffffff;
      border-radius: 4px;
      border-width: 2px;
      transition: background-color 0.1s ease-in-out
    }


    .best {
      border-color: #e74c3c;
    }

    .b-open {
      background-color: #e74c3c;
    }

    .best:hover {
      box-shadow: 0 0 4px #e74c3c;
    }

    .average {
      border-color: #2ecc71;
    }

    .a-open {
      background-color: #2ecc71;
    }

    .average:hover {
      box-shadow: 0 0 4px #2ecc71;
    }

    .time {
      border-color: #3498db;
    }

    .t-open {
      background-color: #3498db;
    }

    .time:hover {
      box-shadow: 0 0 4px #3498db;
    }
  }

}
</style>

<script lang="ts">
import type { PropType } from 'vue';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import type { ChartOptions, ChartData, Color } from 'chart.js'
import type { apiDataTrainingListType } from '../dev/types';
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin)

const dataLabels: { label: string, id: number, color: Color }[] = [
  {
    label: 'Best (goal per match)',
    id: 0,
    color: "#e74c3c",
  },
  {
    label: 'Average (goal per match)',
    id: 1,
    color: "#2ecc71",
  },
  {
    label: 'Duration (seconds)',
    id: 2,
    color: "#3498db",
  }
]

export default {
  name: "LineChart",
  components: { Line },
  props: {
    trainingItems: { type: Object as PropType<apiDataTrainingListType[]>, require: true },
    trainingId: { type: Number, require: true }
  },
  data(): {
    chartData: ChartData,
    chartOptions: ChartOptions,
    shownData: boolean[],
    mouvingAverage: number,
    trainingData: number[][],
    displayChart: boolean,
    chartClicks: number
  } {
    return {
      trainingData: this.trainingItems?.find(x => x.id === this.trainingId)?.metrics || [],
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: false,
        plugins: {
          legend: {
            display: false,
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              scaleMode: 'x'

            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x',
            }
          }
        },
        animation: {
          duration: 0
        },
      },
      shownData: [true, true, true],
      mouvingAverage: 30,
      displayChart: false,
      chartClicks: 0,
    }
  },
  methods: {
    calcAverage: function (list: number[]): number[] {
      let sum = 0;
      let n = 0;
      let res: number[] = [];
      for (let i = 0; i < list.length; i++) {
        n += 1;
        sum += list[i];

        if (n > this.mouvingAverage) {
          n -= 1;
          sum -= list[i - this.mouvingAverage];
        }

        res.push(sum / n);
      }

      return res;
    },

    updateChart: async function () {
      this.mouvingAverage = Math.ceil(this.trainingData.length / 30);
      this.mouvingAverage = this.mouvingAverage < 10 ? 10 : this.mouvingAverage
      // this.mouvingAverage = 1
      this.chartData.datasets = dataLabels
        .filter((x) => this.shownData[x.id])
        .map((x) => {
          const coef = x.id === 2 ? 1 / 1000 : 1
          return {
            label: x.label,
            yAxisID: `ax${x.id}`,
            data: this.calcAverage(this.trainingData.map(y => y[x.id + 1] * coef) || []),
            fill: false,
            borderColor: x.color,
            tension: 0.1,
            pointStyle: false,
          }
        })

      let scales: { [key: string]: any } = {};
      for (let i = 0; i < dataLabels.length; i++) {
        if (!this.shownData[i])
          continue;
        scales[`ax${i}`] = {
          display: false,
          ticks: {
            display: false,
          },
          grid: {
            display: false
          }
        }
      }
      scales.x = {
        grid: {
          // display: false,
          // color: "#ffffff",
          // tickLength: 100
        }
      }
      this.chartOptions.scales = scales;

      this.chartData.labels = this.trainingData.map(x => x[0])

      this.displayChart = false;
      await new Promise((r, _) => setTimeout(() => { r(true) }, 1));
      this.displayChart = true;
    },

    updateShown: function (id: number) {
      this.shownData[id] = !this.shownData[id];
      this.updateChart();
    },
    chartClick: function () {
      if (this.chartClicks === 1) {
        // @ts-ignore
        this.$refs.statChart.chart.resetZoom()
        return;
      }

      this.chartClicks++;
      setTimeout(() => {
        this.chartClicks--;
      }, 300)

    }
  },

  mounted: async function () {
    this.updateChart();
  },

  watch: {
    trainingData: function (_, __) {
      this.updateChart();
    },
    trainingItems: function (_, __) {
      this.trainingData = this.trainingItems?.find(x => x.id === this.trainingId)?.metrics || [];
    },
    trainingId: function (_, __) {
      this.trainingData = this.trainingItems?.find(x => x.id === this.trainingId)?.metrics || [];
    },
  }
}
</script>
