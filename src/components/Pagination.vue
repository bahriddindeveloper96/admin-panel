<template>
  <ul class="pagination pagination-sm m-0 float-right">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
        Previous
      </a>
    </li>
    
    <template v-for="page in pages" :key="page">
      <li class="page-item" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="changePage(page)">
          {{ page }}
        </a>
      </li>
    </template>
    
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
        Next
      </a>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const totalPages = computed(() => Math.ceil(props.total / props.perPage))

    const pages = computed(() => {
      const range = []
      const maxPages = 5
      let start = Math.max(1, props.currentPage - Math.floor(maxPages / 2))
      let end = Math.min(totalPages.value, start + maxPages - 1)

      if (end - start + 1 < maxPages) {
        start = Math.max(1, end - maxPages + 1)
      }

      for (let i = start; i <= end; i++) {
        range.push(i)
      }

      return range
    })

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
        emit('page-changed', page)
      }
    }

    return {
      totalPages,
      pages,
      changePage
    }
  }
}
</script>
