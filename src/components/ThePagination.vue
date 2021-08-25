<template>
  <ul class="pagination justify-content-center mt-4">
    <li class="page-item" :class="{disabled: page<=1}">
      <button class="page-link" @click.stop="changePage(page - 1)">Previous</button>
    </li>
    <li class="page-item"
        v-for="pg in this.pages"
        :key="pg"
        :class="{active: pg===page}">
      <button class="page-link" @click.stop="changePage(pg)">{{ pg }}</button>
    </li>
    <li class="page-item" :class="{disabled: page===pages}">
      <button class="page-link" @click.stop="changePage(page + 1)">Next</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ThePagination',
  props: ['perPage', 'currencyListLength', 'page'],
  emits: ['changePage'],
  methods: {
    changePage (page) {
      if (page > this.pages) {
        page = this.pages
      }
      this.$emit('changePage', page)
    }
  },
  computed: {
    pages () {
      return Math.floor((this.currencyListLength + (this.perPage - 1)) / this.perPage)
    }
  }
}
</script>

<style scoped>

</style>
