<script setup>
  import ListItem from './ListItem.vue'
  defineProps({
    isMovable: {
      type: [Boolean, String],
      default: false
    },
    isDeletable: {
      type: [Boolean, String],
      default: false
    },
    items: {
      type: Array,
      required: true
    },
  })

</script>

<template>
  <div class="flex flex-col">
    <div v-for="(item, index) in items" :key="index" class="mb-2">
      <ListItem
        :content="item.content"
        :isDeletable="isDeletable"
        :isMovable="isMovable"
        :isLast="index === items.length - 1"
        :isFirst="index === 0"
        @move-up="$emit('move-up', index)"
        @move-down="$emit('move-down', index)"
        @delete="$emit('delete', index)"
      />
    </div>

  </div>
</template>
