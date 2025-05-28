<script setup>

import { ref } from 'vue'
import SimpleDraggable from './components/SimpleDraggable.vue'
import Keyboard from './components/Keyboard.vue'
import FakeInput from './components/FakeInput.vue'
import ListItem from './components/ListItem.vue';

import draggable from 'vuedraggable'
import 'primeicons/primeicons.css'
// import TransitionExample from './components/TransitionExample.vue';


  let initialItems = ref([
    { content: '2+4', id: 1 },
    { content: '8-3', id: 2 },
    { content: '9+4', id: 3 },
    { content: '5-1', id: 4 },
  ])

  const listRef = ref(null)
  // const newItem = ref('')
  const selectedItem = ref(null)
  let inputRef = ref('1+2')
  let fakeInputComponent = ref(null)
  let deletedItems = ref([])
  let displayMode = ref('student') // 'student' or 'teacher'
  let refDebugIbMsg = ref('');

  const addItem = (inputValue) => {
    if (inputValue.trim() === '') {
      return
    }
    listRef.value.addItem({ content: inputValue })
  }

  const setSelectedItem = (item) => {
    selectedItem.value = item
    inputRef.value = item.content
  }

  const onItemsUpdated = (newItems, oldITems) => {
    console.log('Items updated:', newItems)    
  }

  const onItemDeleted = ({item}) => {
    console.log('Item deleted:', item)
    deletedItems.value.push(item)
  }

  const onIbEvent = (e) => {
    refDebugIbMsg.value = e
    if(e.includes('btn_')){
      const btn = e.split('_')[1]
      if(btn.includes('backspace')){
        // inputRef.value = inputRef.value.slice(0, -1)
        fakeInputComponent.value.backspace()
      } else if(btn.includes('clear')){
        inputRef.value = ''
      } else if(btn.includes('result')){
        // inputRef.value = inputRef.value + '='
        fakeInputComponent.value.sendChar('=')
      } else if(btn.includes('plus')){
        // inputRef.value = inputRef.value + '+'
        fakeInputComponent.value.sendChar('+')
      } else if(btn.includes('minus')){
        // inputRef.value = inputRef.value + '-'
        fakeInputComponent.value.sendChar('-')
      } 
      else if(btn.includes('right')) {
        fakeInputComponent.value.moveCursorNext()
      } else if(btn.includes('left')) {
        fakeInputComponent.value.moveCursorPrev()
      } 
      else {
        // inputRef.value = inputRef.value + ''+btn
        fakeInputComponent.value.sendChar(btn)
      }
    }
    else if(e.includes('show_')) {
      if(e === 'show_student') {
        console.log('Show student mode')
        displayMode.value = 'student'
      } else if(e === 'show_teacher') {
        console.log('Show teacher mode')
        displayMode.value = 'teacher'
      }
    } 
  }

</script>

<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 p-4 mb-4">
    <div class="text-sm text-gray-500 mb-2">Debug: {{ refDebugIbMsg }}</div>
  </div>
  <div class="flex gap-8 max-h-[600px]">
    <div class="min-w-[450px] flex flex-col gap-2">
      <div class="flex gap-2 items-start">
        <div class="max-h-[200px] overflow-y-auto flex-1">
          <SimpleDraggable :initialItems="initialItems" ref="listRef" @item-selected="setSelectedItem"  @items-updated="onItemsUpdated" @item-deleted="onItemDeleted" />
        </div>
        <div v-if="displayMode === 'teacher'" class="flex flex-col flex-1 gap-2 max-h-[200px] overflow-y-auto ">
          <div v-if="!deletedItems.length" class="text-sm text-gray-500 font-bold">Papierkorb ist leer</div>
          <ListItem
            class="rounded-md bg-red-200"
            v-if="deletedItems.length"
            v-for="deletedItem in deletedItems"
            :key="deletedItem.id"
            :content="deletedItem.content"
           />
        </div>
      </div>
      <!-- <input v-model="newItem" @keyup.enter="addItem()" placeholder="Add new item" /> -->
      <FakeInput ref="fakeInputComponent" :content="inputRef" @save="addItem" />

      <!-- trashbin -->
      <draggable 
        v-model="deletedItems"
        group="math" 
        class="flex items-center justify-center h-16 w-full border-2 border-dashed border-red-400 bg-red-50 rounded transition-colors"
        item-key="id">
          <template #item="{element, index}">
              <div v-show="false" :id="`item-${index}`">{{ index }}</div>
          </template>
          <template #footer>
            <div class="text-red-400 flex flex-col items-center">
              <i class="pi pi-trash text-2xl"></i>
            </div>
          </template>          
      </draggable>


      
    </div>
    <div>
      <Keyboard @button-pressed="onIbEvent" devmode />
    </div>
  </div>
  <!-- <TransitionExample/> -->

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
