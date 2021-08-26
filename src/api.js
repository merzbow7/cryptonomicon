const API_COIN_LIST = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
const API_KEY = '44e13f016ce1bc6fdc3d289c770949fe2787903525fc4b65d35ea3abd443187e'
const API_COINS = 'https://min-api.cryptocompare.com/data/pricemulti'
const API_COIN = 'https://min-api.cryptocompare.com/data/price'

export const loadCoinList = () => fetch(API_COIN_LIST)
  .then(response => response.json())
  .then(({ Data }) => Array.from(Object.values(Data)))

const ulrForTickers = (tickerName, urlApi) => {
  const params = new URLSearchParams({
    fsym: tickerName,
    tsyms: 'USD',
    api_key: API_KEY
  })
  const url = new URL(urlApi)
  url.search = params
  return url
}

export const loadTickers = (tickersName) =>
  fetch(ulrForTickers(tickersName, API_COINS))
    .then(response => response.json())
    .then(data =>
      Object.entries(data).map(([key, value]) => ({
        name: key,
        value: Number(value.USD)
      }))
    )

const tickersHandler = new Map()

export const subsribeTicker = (ticker, cb) => tickersHandler.set(ticker.name, cb)

export const unSubsribeTicker = (ticker) => tickersHandler.delete(ticker.name)

const processHandlers = () => {
  setInterval(() => {
    tickersHandler.forEach((value, key) => {
      fetch(ulrForTickers(key, API_COIN))
        .then(response => response.json())
        .then(data => value(key, data.USD))
    })
  }, 5000)
}

processHandlers()
