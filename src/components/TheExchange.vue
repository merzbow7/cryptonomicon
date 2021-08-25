<template>
  <div>
    <div class="text-secondary mb-2">{{ ticker.name }} - USD</div>
    <div class="fs-3 mb-2" v-if="ticker.value">{{ formattedExchangeValue }}</div>
    <div v-else class="mb-2">
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
  props: ['ticker'],
  emits: ['deleteExchange'],
  computed: {
    formattedExchangeValue () {
      return this.ticker.value > 1 ? this.ticker.value.toFixed(2) : this.ticker.value.toPrecision(3)
    }
  }
}
</script>

<style scoped>

</style>
