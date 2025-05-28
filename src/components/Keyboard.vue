<script setup>
    import { onMounted, ref } from 'vue'

    defineProps({
        devmode: {
            type: Boolean,
            default: false
        },
    })
    const defaultMode = 'student'
    const emit = defineEmits(['button-pressed'])

    const displayMode = ref('student')
    const toggleMode = () => {
        displayMode.value = displayMode.value === 'student' ? 'teacher' : 'student'
        emit('button-pressed', 'show_'+displayMode.value)
    }

    onMounted(() => {
        emit('button-pressed', 'show_'+defaultMode)
    })

    // Add your script logic here
</script>

<template>

      <div class="flex flex-col gap-2">
          <div class="grid grid-cols-3 gap-2 bg-accent1 rounded-md p-2">
            <div
              class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer"
              v-for="i in 9"
              :key="i"
              @click="emit('button-pressed', 'btn_'+i.toString())"
              @mousedown.prevent
            >
              {{ i }}
            </div>
          
            <div class="h-8 w-8"></div>
            <div @click="emit('button-pressed', 'btn_0')" class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer">0</div>
            <div @click="emit('button-pressed', 'btn_backspace')" class="bg-red-400 rounded-md text-white font-bold h-8 w-8 flex items-center justify-center border border-white cursor-pointer"><i class="pi pi-delete-left"></i></div>
            <div @click="emit('button-pressed', 'btn_plus')" class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer">+</div>
            <div @click="emit('button-pressed', 'btn_minus')" class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer">-</div>
            <div @click="emit('button-pressed', 'btn_result')" class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer">=</div>
            <div @click="emit('button-pressed', 'btn_left')" class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer"><</div>
            <div class="h-8 w-8"></div>
            <div @click="emit('button-pressed', 'btn_right')" class="bg-white rounded-md text-black font-bold h-8 w-8 flex items-center justify-center cursor-pointer">></div>
          </div>
          <div v-if="devmode" class="flex gap-2 text-sm">
            <div @click="toggleMode" class=" flex-1 bg-accent1 rounded-md p-2 text-white font-bold h-8 flex items-center justify-center cursor-pointer">mode: {{ displayMode }}</div>
          </div>
      </div>

</template>