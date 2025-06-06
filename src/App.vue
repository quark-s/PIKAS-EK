<script setup>

import { ref } from 'vue'
import SimpleDraggable from './components/SimpleDraggable.vue'
import Keyboard from './components/Keyboard.vue'
import FakeInput from './components/FakeInput.vue'
import ListItem from './components/ListItem.vue';

import draggable from 'vuedraggable'
import 'primeicons/primeicons.css'
import { list } from 'postcss';
// import TransitionExample from './components/TransitionExample.vue';


  let initialItems = ref([
    { content: '2+4=6', id: 1 },
    { content: '8-3=4', id: 2 },
    { content: '9+4', id: 3 },
    { content: '9+', id: 4 },
  ])

  const listRef = ref(null)
  // const newItem = ref('')
  const selectedItemIndex = ref(-1)
  let inputRef = ref('1+2')
  let fakeInputComponent = ref(null)
  let deletedItems = ref([])
  let displayMode = ref('student') // 'student' or 'teacher'
  let refDebugIbMsg = ref('');
  let isDragging = ref(false);

  let deletedAllowDrop = ref(true)

  // Track hidden items by id
  const hiddenDeletedIds = ref([])

  const onSaveItem = (inputValue) => {
    if (inputValue.trim() === '') {
      return
    }
    
    // Update existing item
    if (selectedItemIndex.value>=0) {
      listRef.value.updateItem(selectedItemIndex.value, inputValue)
      return
    }

    // Add new item
    listRef.value.addItem({ content: inputValue })    
  }

  const onCancelEdit = () => {
    listRef.value.clearSelected()
  }

  const onToggleSelectedItem = (item, idx) => {
    if (item === null) {
      selectedItemIndex.value = -1
      inputRef.value = ''
      return
    }
    selectedItemIndex.value = idx
    inputRef.value = item.content
  }

  const onItemsUpdated = (newItems, oldITems) => {
    console.log('Items updated:', newItems)
    listRef.value.clearSelected()
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

function onTrashbinAdd(evt) {
  // Move the last added item to the end
  deletedAllowDrop.value = false; // Prevent further drops before hiding the last item

  if (deletedItems.value.length > 1) {
    const [item] = deletedItems.value.splice(evt.newDraggableIndex, 1)
    deletedItems.value.push(item)
    // Hide after 5 seconds
    setTimeout(() => {
      deletedAllowDrop.value = true;
      if (!deletedItems.value.includes(item)) return; // Check if item still exists
      hiddenDeletedIds.value.push(item.id)
    }, 7500)
  } else if (deletedItems.value.length === 1) {
    // Only one item, hide after 5 seconds
    setTimeout(() => {
      deletedAllowDrop.value = true;
      if (!deletedItems.value.length) return; // Check if item still exists
      hiddenDeletedIds.value.push(deletedItems.value[0].id)
    }, 7500)
  }
}

</script>

<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 p-4 mb-4">
    <div class="text-sm text-gray-500 mb-2">Debug: {{ refDebugIbMsg }}</div>
  </div>
  <div class="flex gap-8 text-base">
    <div class="min-w-[450px] flex flex-col gap-2">
      <div class="flex gap-2 items-start">
        <div class="max-h-[300px] overflow-y-auto flex-1">
          <SimpleDraggable :initialItems="initialItems" :compute="true" ref="listRef" @toggle-selected="onToggleSelectedItem"  @items-updated="onItemsUpdated" @item-deleted="onItemDeleted" class="font-ubuntu" />
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
      <FakeInput ref="fakeInputComponent" :content="inputRef" @save="onSaveItem" @cancel="onCancelEdit" :edit="selectedItemIndex>=0" class="font-ubuntu" />

      <!-- trashbin -->
      <draggable 
        v-model="deletedItems"
        :group="{ name: 'math', put: deletedAllowDrop, pull: true }"
        :animation="200"
        tag="ul"
        @start="isDragging=true"
        @end="isDragging=false"
        @add="onTrashbinAdd"
        class="font-ubuntu relative list-none flex flex-col items-center min-h-24 w-full p-2 pt-8 border-2 border-dashed border-red-400 bg-red-50 rounded transition-colors"
        item-key="id">
          <template #item="{element, index}">
            <transition name="fade" appear>
              <li
                v-show="element?.content && 
                        deletedItems.length &&
                        index === deletedItems.length - 1 &&
                        !hiddenDeletedIds.includes(element.id)"
                class="w-full"
              >
                <ListItem
                    class="rounded-md cursor-move"
                    :content="element.content"
                    :isLast="index === deletedItems.length - 1"
                    :isFirst="index === 0"                     
                />
                </li>
              </transition>
          </template>
          <template #header>
            <div
              class="text-red-400 absolute top-1 -z-0"
            >
              <i class="pi pi-trash text-xl"></i>
              <p v-if="deletedItems.length==0 || hiddenDeletedIds.includes(deletedItems[deletedItems.length-1].id)" class="text-sm text-red-400 font-bold">Papierkorb</p>
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

<style>
  .sortable-chosen {
    z-index: 50 !important;
    position: relative;
  }
  .sortable-ghost {
    z-index: 40 !important;
    position: relative;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.8s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }  
</style>
