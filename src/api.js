const API_COIN_LIST = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
const API_KEY = '44e13f016ce1bc6fdc3d289c770949fe2787903525fc4b65d35ea3abd443187e'
// const API_COINS = 'https://min-api.cryptocompare.com/data/pricemulti'
// const API_COIN = 'https://min-api.cryptocompare.com/data/price'
const WEB_SOCK = 'wss://streamer.cryptocompare.com/v2'

export const loadCoinList = () => fetch(API_COIN_LIST)
  .then(response => response.json())
  .then(({ Data }) => Array.from(Object.values(Data)))

const tickersHandler = new Map()
const params = new URLSearchParams({
  api_key: API_KEY
})
const url = new URL(WEB_SOCK)
url.search = params
let socket = new WebSocket(url)

const sendToWebSocket = (tickerData) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(tickerData)
    return true
  }
  socket.addEventListener('open', () => socket.send(), { once: true })
}

export const subscribeTicker = (ticker, cb) => {
  tickersHandler.set(ticker.name, cb)
  sendToWebSocket(JSON.stringify({
    action: 'SubAdd',
    subs: [`5~CCCAGG~${ticker.name}~USD`]
  }))
}

export const unSubscribeTicker = (ticker) => {
  tickersHandler.delete(ticker.name)
  sendToWebSocket(JSON.stringify({
    action: 'SubRemove',
    subs: [`5~CCCAGG~${ticker.name}~USD`]
  }))
}

const AGGREGATE_INDEX = '5'

socket.addEventListener('message', function (event) {
  const {
    TYPE: type,
    PRICE: price,
    FROMSYMBOL: tickerName
  } = JSON.parse(event.data)
  if (type === AGGREGATE_INDEX && price && tickerName) {
    const callback = tickersHandler.get(tickerName)
    if (callback) {
      callback(tickerName, price)
    }
  }
})

socket.addEventListener('close', () => {
  socket = new WebSocket(url)
})
