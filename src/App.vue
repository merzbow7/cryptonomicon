<template>
  <div class="row">
    <div class="">
      <div class="col-md-4 mb-3">
        <label for="exampleInputEmail1" class="form-label">Ticker</label>
        <input type="text" class="form-control" id="exampleInputEmail1"
               v-model="ticker"
               @keypress.enter="exist ? add() : null"
        >
        <div
          v-if="this.inputError"
          class="mt-2 text-danger"
        >{{ inputError }}
        </div>
        <div v-if="inputTip.length" class="mt-3 d-flex justify-content-evenly">
          <span v-for="(tip, idx) in inputTip" :key="idx"
                class="btn bg-secondary bg-opacity-25 rounded-pill py-0"
                @click.stop.prevent="ticker = tip"
          >{{ tip }}</span>
        </div>
      </div>
      <div class="d-flex">
        <button type="submit" class="btn btn-primary" @click="add" :disabled="!exist">Submit</button>
        <div class="text-center">
          <button class="btn btn-primary mx-2">Prev</button>
          <button class="btn btn-primary mx-2">Next</button>
        </div>
      </div>
    </div>
  </div>

  <template v-if="currencyList.length">
    <hr>
    <div class="row">
      <the-exchange
        v-for="(item, idx) in currencyList"
        :key="idx"
        @click="sel = idx"
        @deleteExchange="removeCoin(idx)"
        @dataSet="saveDataSet"
        :currencyName="item"
        :selected="sel === idx"
        class="col-md-4 text-center py-5 rounded-3 border"
        :class="{
          'border-5 border-info': sel === idx
        }"
      />
    </div>
    <hr>
  </template>

  <the-graph v-if="sel!==null" :dataSet="dataSet"/>

</template>

<script>

import TheExchange from '@/components/TheExchange'
import TheGraph from '@/components/TheGraph'

export default {
  name: 'App',
  components: {
    TheGraph,
    TheExchange
  },
  data () {
    return {
      ticker: '',
      dataSet: [],
      coins: null,
      inputError: '',
      exist: false,
      sel: null,
      inputTip: [],
      currencyList: []
    }
  },
  async created () {
    const url = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
    const response = await fetch(url)
    if (response.ok) {
      const { Data } = await response.json()
      this.coins = Array.from(Object.values(Data))
    }
    this.currencyList = JSON.parse(localStorage.getItem('crypto-list'))
  },
  methods: {
    async add () {
      const existOnDesk = this.currencyList.find(item => item === this.ticker.toUpperCase())
      if (existOnDesk) {
        this.inputError = 'This coin already at desk'
      } else if (this.exist) {
        this.currencyList.push(this.ticker.toUpperCase())
        localStorage.setItem('crypto-list', JSON.stringify(this.currencyList))
        this.ticker = ''
        this.inputTip = []
      }
    },
    removeCoin (idx) {
      if (this.sel === idx) {
        this.sel = null
        clearInterval(this.clock)
      }
      this.currencyList.splice(idx, 1)
      localStorage.setItem('crypto-list', JSON.stringify(this.currencyList))
    },
    selectCoin (idx) {
      if (this.sel !== null) {
        console.log('selected')
      }
      this.sel = idx
    },
    saveDataSet (event) {
      this.dataSet = event
    }
  },
  watch: {
    ticker (data) {
      this.inputError = ''
      if (data) {
        data = data.toUpperCase()
        this.exist = !!this.coins.find(item => item.Symbol === data)
        let coins = this.coins.filter(item =>
          item.Symbol.toUpperCase().indexOf(data) !== -1 || item.FullName.toUpperCase().indexOf(data) !== -1)
        coins = coins.map(item => item.Symbol)
        coins.sort(function (a, b) {
          return a.length - b.length
        })
        const index = coins.indexOf(data)
        if (index !== -1) {
          coins.unshift(...coins.splice(index, 1))
        }
        this.inputTip = coins.slice(0, 4)
      } else {
        this.exist = false
        this.inputTip = []
      }
    }
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";

#app {
  margin: 30px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
