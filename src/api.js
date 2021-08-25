const API_COIN_LIST = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
const API_KEY = '44e13f016ce1bc6fdc3d289c770949fe2787903525fc4b65d35ea3abd443187e'
const API_COIN = 'https://min-api.cryptocompare.com/data/pricemulti'

export const loadCoinList = () => fetch(API_COIN_LIST).then(response => response.json())

export const loadTickers = async function (tickersName) {
  const params = new URLSearchParams({
    fsyms: tickersName.map(ticker => ticker.name),
    tsyms: 'USD',
    api_key: API_KEY
  })
  const url = new URL(API_COIN)
  url.search = params
  const response = await fetch(url)
  const coinsExchangeList = await response.json()
  // return Object.entries(coinsExchangeList).map(([key, value]) => ([key, value.USD]))
  return Object.entries(coinsExchangeList).map(([key, value]) => ({
    name: key,
    value: Number(value.USD)
  }))
}
