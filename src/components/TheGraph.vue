<template>
  <div class="row">
    <div class="mt-5 d-flex align-items-end" style="height: 250px;">
      <div v-for="(h, idx) in normalizedGraph" :key="idx" class="bg-primary border border-1"
           style="min-width: 2%"
           :style="'height: ' + h +'%;'"
      ></div>
    </div>
    <div id="chartContainer">
    </div>
  </div>
</template>

<script>

export default {
  name: 'TheGraph',
  props: ['ticker'],
  data () {
    return {
      dataSet: []
    }
  },
  methods: {
    normalizedGraph () {
      const max = Math.max(...this.dataSet.filter(item => item > 0))
      const min = Math.min(...this.dataSet.filter(item => item > 0))
      if (min === max) {
        return this.dataSet.map(price => 50)
      }
      console.log(this.dataSet.map(price => 10 + ((price - min) * 90) / (max - min)))
      return this.dataSet.map(price => 10 + ((price - min) * 90) / (max - min))
    }
  },
  watch: {}
}
</script>
