<script setup>

  defineEmits(['moveUp', 'moveDown', 'delete', 'item-selected'])

  defineProps({
    content: String,
    isDeletable: [Boolean, String],
    isMovable: [Boolean, String],
    isLast: [Boolean, String],
    isFirst: [Boolean, String],
  })

</script>

<template>
  <div
    @click="$emit('item-selected')"
    :class="[
      'flex items-center p-2 bg-accent1-lighter',
      { 'cursor-move': isMovable }
    ]"
  >
    <div class="flex-1 text-left font-bold">
        {{ content }}
    </div>
    <div class="flex items-center gap-x-1">
      <button v-if="isMovable" :disabled="isFirst" @click.stop="$emit('moveUp')" @mouseDown.prevent type="button" class="bg-transparent text-accent1 hover:text-orange-500 disabled:hover:text-accent1 disabled:cursor-not-allowed disabled:text-gray-400">
        <i class="pi pi-caret-up"></i>
      </button>
      <button v-if="isMovable" :disabled="isLast" @click.stop="$emit('moveDown')" @mouseDown.prevent type="button" class="bg-transparent text-accent1 hover:text-orange-500 disabled:hover:text-accent1 disabled:cursor-not-allowed disabled:text-gray-400">
        <i class="pi pi-caret-down"></i>
      </button>
      <button v-if="isDeletable" @click.stop="$emit('delete')" type="button" @mouseDown.prevent class="bg-transparent text-accent1 hover:text-orange-500 disabled:hover:text-accent1 disabled:cursor-not-allowed disabled:text-gray-400">
        <i class="pi pi-trash"></i>
      </button>
    </div>
  </div>
</template>
