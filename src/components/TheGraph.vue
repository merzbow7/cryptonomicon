<template>
  <div class="row">
    <div class="mt-5 d-flex align-items-end" style="height: 250px;">
      <div v-for="(h, idx) in calcH()" :key="idx" class="bg-primary border border-1"
           style="min-width: 2%"
           :style="'height: ' + h +'%;'"
      ></div>
    </div>
    <div id="chartContainer">
    </div>
  </div>
</template>

<script>
// import CanvasJS from 'canvasjs'

export default {
  name: 'TheGraph',
  props: ['dataSet'],
  methods: {
    calcH () {
      const max = Math.max(...this.dataSet.filter(item => item > 0))
      const min = Math.min(...this.dataSet.filter(item => item > 0))
      return this.dataSet.map(price => 10 + ((price - min) * 90) / (max - min))
    }
  },
  computed: {},
  mounted () {
  }
}
</script>

<style scoped>

</style>
