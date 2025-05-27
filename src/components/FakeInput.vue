<script setup>
    import { defineProps } from 'vue'

    defineProps({
        content: {
            type: String,
            default: '1+1'
        }
    });
    const emit = defineEmits(['save'])

        // const emit = defineEmits(['button-pressed'])
        // Add your script logic here
</script>

<template>
      <div class="bg-accent1-lighter rounded-md p-2 border-2 border-accent1 min-h-12 flex items-center">
        <div class="flex-1 font-bold text-left">
            {{ content.toString() }}
        </div>
        <div @click="emit('save')" class="rounded-full bg-accent1 text-white h-6 w-6 flex items-center justify-center cursor-pointer text-center pt-1 pr-1 rotate-45">
            <i class="pi pi-send text-sm"></i>
        </div>
      </div>
</template>