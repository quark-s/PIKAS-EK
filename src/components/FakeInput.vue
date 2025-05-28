<script setup>
import { ref, computed, watch, defineExpose } from 'vue'

const props = defineProps({
    content: {
        type: String,
        default: '1+1'
    }
})
const emit = defineEmits(['save', 'update:content'])

// Internal state
const value = ref(props.content)
const cursor = ref(0)

// Keep value in sync with prop
watch(() => props.content, (val) => {
    value.value = val
    // if (cursor.value > val.length) cursor.value = val.length
    cursor.value = val.length
    console.log('Content updated:', val, 'Cursor:', cursor.value)
}, { immediate: true, deep: true })

// Rendered string with cursor
const rendered = computed(() => {
    const chars = value.value.split('')
    if (cursor.value < 0 || cursor.value > chars.length) {
        return value.value // Fallback to original value if cursor is out of bounds
    }
    // Insert cursor span at the current cursor position    
    chars.splice(cursor.value, 1, '<span class="border-b-4 border-accent2 text-accent2 animate-pulse">'+ (value.value[cursor.value] ? value.value[cursor.value] : '&nbsp;&nbsp;') +'</span>')
    return chars.join('')
})

function sendChar(char) {
    let arr = value.value.split('')
    if (cursor.value < arr.length) {
        arr[cursor.value] = char
    } else {
        arr.push(char)
    }
    value.value = arr.join('')
    cursor.value = Math.min(cursor.value + 1, value.value.length)
    emit('update:content', value.value)
}

function moveCursorNext() {
    if (cursor.value < value.value.length) cursor.value++
}
function moveCursorPrev() {
    if (cursor.value > 0) cursor.value--
}
function backspace() {
    if (cursor.value > 0) {
        let arr = value.value.split('')
        if (cursor.value == arr.length) {
            arr.splice(cursor.value - 1, 1)
        } 
        else if (cursor.value < arr.length) {
            arr.splice(cursor.value - 1, 2)
        }
        else {
            arr.pop()
        }
        value.value = arr.join('')
        cursor.value--
        emit('update:content', value.value)
    }
}

function save() {
    emit('save', value.value)
}

defineExpose({ sendChar, moveCursorNext, moveCursorPrev, backspace })
</script>

<template>
  <div class="bg-accent1-lighter rounded-md p-2 border-2 border-accent1 min-h-12 flex items-center">
    <div class="flex-1 font-bold text-left select-none">
      <span v-html="rendered" />
    </div>
    <div @click="save" class="rounded-full bg-accent1 text-white h-6 w-6 flex items-center justify-center cursor-pointer text-center pt-1 pr-1 rotate-45">
      <i class="pi pi-send text-sm"></i>
    </div>
  </div>
</template>