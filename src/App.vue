<template>
  <div class="row">
    <div class="">
      <div class="mb-3">
        <div class="input-group mb-3">
          <span class="input-group-text">Currency</span>
          <input type="text" class="form-control" aria-label="Kind of currency"
                 placeholder="for example: BTC"
                 v-model="ticker"
                 @input="inputError = ''"
                 @keypress.enter="existCoin ? add() : null"
          >
        </div>
        <div
          v-if="this.inputError"
          class="mt-2 text-danger"
        >{{ inputError }}
        </div>
        <span v-if="coinTips.length" class="mt-3 d-flex justify-content-start">
          <span class="input-group-text invisible py-0">Currency</span>
          <span v-for="(tip, idx) in coinTips" :key="idx"
                class="btn bg-secondary bg-opacity-25 rounded-pill py-0 mx-2"
                @click.stop.prevent="ticker = tip"
          >{{ tip }}</span>
        </span>
      </div>
      <div class="col-md-4">
        <button type="submit" class="btn btn-primary"
                @click="add"
                :disabled="!existCoin"
        >Submit
        </button>
      </div>

      <div class="input-group my-3">
        <span class="input-group-text">Filter</span>
        <input type="text" class="form-control" aria-label="filter of currency" v-model="filter">
      </div>

      <the-pagination
        v-if="filteredCurrencyLength > perPage"
        :per-page="perPage"
        :page="page"
        :currency-list-length="filteredCurrencyLength"
        @changePage="page = $event ? $event : page"
      />
    </div>
  </div>

  <template v-if="filteredCurrencyLength">
    <hr>
    <div class="row">
      <the-exchange
        v-for="ticker in paginateCurrency"
        :key="ticker.name"
        @click="selectedTickerName = ticker.name; dataSet = []"
        @deleteExchange="removeCurrency(ticker.name)"
        :ticker="ticker"
        class="col-md-4 text-center py-4 rounded-3 border"
        :class="{
          'border-5 border-info': selectedTickerName === ticker.name
        }"
      />
    </div>
    <hr>
  </template>

  <the-graph v-if="selectedTickerName !== null" :data-set="dataSet"/>

</template>

<script>
import { loadCoinList, subscribeTicker, unSubscribeTicker } from '@/api'

import TheExchange from '@/components/TheExchange'
import TheGraph from '@/components/TheGraph'
import ThePagination from '@/components/ThePagination'

export default {
  name: 'App',
  components: {
    ThePagination,
    TheGraph,
    TheExchange
  },
  data () {
    return {
      ticker: '',
      perPage: 3,
      page: 1,
      dataSet: [],
      coins: null,
      inputError: '',
      selectedTickerName: null,
      filter: '',
      currencyListExchange: []
    }
  },
  async created () {
    this.coins = await loadCoinList()
    this.currencyListExchange = JSON.parse(localStorage.getItem('crypto-list')) || []
    const searchParams = Object.fromEntries(new URL(window.location).searchParams.entries())
    if (searchParams.filter) {
      this.filter = searchParams.filter
    }
    if (searchParams.page) {
      this.page = Number(searchParams.page)
    }
    this.currencyListExchange.forEach(item => subscribeTicker(item, this.updateCurrencyValue))
  },
  methods: {
    async add () {
      const existOnDesk = this.currencyList.includes(this.coinUpper)
      if (existOnDesk) {
        this.inputError = 'This coin already at desk'
      } else if (this.existCoin) {
        this.currencyListExchange = [...this.currencyListExchange, {
          name: this.coinUpper,
          value: 0
        }]
        subscribeTicker({ name: this.coinUpper }, this.updateCurrencyValue)
        this.ticker = ''
        this.filter = ''
      }
    },
    removeCurrency (tickerToRemove) {
      if (this.selectedTickerName === tickerToRemove) {
        this.selectedTickerName = null
      }
      unSubscribeTicker({ name: tickerToRemove }, this.updateCurrencyValue)
      const indexToRemove = this.currencyListExchange.findIndex(ticker => Object.keys(ticker) === [tickerToRemove])
      this.currencyListExchange.splice(indexToRemove, 1)
      this.currencyListExchange = [...this.currencyListExchange]
    },
    updateCurrencyValue (tickerName, tickerValue) {
      if (tickerName === this.selectedTickerName) {
        if (this.dataSet.length >= 20) {
          this.dataSet.unshift()
        }
        this.dataSet.push(tickerValue)
      }
      this.currencyListExchange.find(item => item.name === tickerName).value = tickerValue
    }
  },
  computed: {
    currentCurrency () {
      return this.currencyListExchange.find(item => item.name === this.selectedTickerName)
    },
    currencyList () {
      return this.currencyListExchange.map(item => item.name)
    },
    filteredCurrencyLength () {
      return this.currencyList.length
    },
    filteredCurrency () {
      return this.currencyListExchange.filter(ticker => ticker.name.includes(this.filter.toUpperCase()))
    },
    paginateCurrency () {
      return this.filteredCurrency.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    },
    existCoin () {
      return !!this.coins?.find(item => item.Symbol === this.coinUpper)
    },
    coinUpper () {
      return this.ticker.toUpperCase()
    },
    coinTips () {
      if (this.ticker) {
        let coins = this.coins.filter(item =>
          item.Symbol.toUpperCase().indexOf(this.coinUpper) !== -1 ||
          item.FullName.toUpperCase().indexOf(this.coinUpper) !== -1)
        coins = coins.map(item => item.Symbol)
        coins.sort(function (a, b) {
          return a.length - b.length
        })
        const index = coins.indexOf(this.coinUpper)
        if (index !== -1) {
          coins.unshift(...coins.splice(index, 1))
        }
        return coins.slice(0, 4)
      } else {
        return []
      }
    }
  },
  watch: {
    currencyListExchange () {
      localStorage.setItem('crypto-list', JSON.stringify(this.currencyListExchange))
    },
    paginateCurrency () {
      if (this.paginateCurrency.length === 0) {
        this.page = this.page > 1 ? this.page - 1 : 1
      }
    },
    filter () {
      this.page = 1
    },
    page () {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
      )
    }
  },
  beforeUnmount () {
    localStorage.setItem('crypto-list', JSON.stringify(this.currencyListExchange))
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";

#app {
  margin: 30px;
}
</style>
