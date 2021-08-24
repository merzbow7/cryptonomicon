<template>
  <div>
    <div class="text-secondary my-3">{{ currencyName }} - USD</div>
    <div class="fs-3 my-3" v-if="exchange!==null">{{ exchangeValue }}</div>
    <div v-else class="my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
    <button class="btn btn-outline-danger" @click.stop="$emit('deleteExchange')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
           viewBox="0 0 16 16">
        <path
          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
      Delete
    </button>
  </div>
</template>

<script>
export default {
  name: 'TheExchange',
  data () {
    return {
      exchange: null,
      exchangeList: new Array(48).fill(0),
      clock: null
    }
  },
  props: ['currencyName', 'selected'],
  emits: ['deleteExchange', 'dataSet'],
  methods: {
    async loadCrypto () {
      // const apiKey = 'f15144f5d36c62f6258ceac23aad8f820eecc8fc08c1001a5a97cef32d15701b'
      const apiKey = '44e13f016ce1bc6fdc3d289c770949fe2787903525fc4b65d35ea3abd443187e'
      const url = `https://min-api.cryptocompare.com/data/price?fsym=${this.currencyName}&tsyms=USD&api_key=${apiKey}`
      const response = await fetch(url)
      if (response.ok) {
        return response.json()
      } else {
        return false
      }
    }
  },
  computed: {
    exchangeValue () {
      return this.exchange > 1 ? this.exchange?.toFixed(2) : this.exchange?.toPrecision(2)
    }
  },
  async created () {
    this.clock = setInterval(async () => {
      const data = await this.loadCrypto()
      if (data) {
        [this.exchange] = Object.values(data)
        await this.exchangeList.shift()
        this.exchangeList.push(this.exchange)
        if (this.selected) {
          this.$emit('dataSet', this.exchangeList)
        }
      }
    }, 2500)
  }
}
</script>

<style scoped>

</style>
