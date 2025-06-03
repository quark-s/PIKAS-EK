<script setup>
    
    import { ref, watch, onMounted, onUpdated, nextTick } from 'vue';
    import draggable from 'vuedraggable'
    import ListItem from './ListItem.vue';

    const emit = defineEmits(['items-updated', 'item-selected']);
    defineExpose({addItem, updateItem});

    const props = defineProps({
        initialItems: {
            type: Array,
            default: () => []
        },
    })

    let itemsNormalized = ref(normalizeItems(props.initialItems));
    let initialCount = ref(itemsNormalized.value.length);
    let isDragging = ref(false);
    let elements = ref([]);
    let scrollContainer = ref(null); // Add this line

    function normalizeItems(items) {
        return items.map((item, index) => ({
            ...item,
            id: !item.id ? index + 1 : item.id
        }));
    }

    function logEvent(e){
        console.log('Event:', e)
    }

    function moveDown(index){
        logEvent('move-down'+index)
        if (index < itemsNormalized.value.length - 1) {
            let tmp = [...itemsNormalized.value];
            const item = tmp[index]
            tmp.splice(index, 1)
            tmp.splice(index + 1, 0, item)
            itemsNormalized.value = tmp;
        }
        normalizeItems(itemsNormalized.value)
    }
    function moveUp(index){
        logEvent('move-up' + index)
        if (index > 0) {
            let tmp = [...itemsNormalized.value];
            const item = tmp[index]
            tmp.splice(index, 1)
            tmp.splice(index - 1, 0, item)
            itemsNormalized.value = tmp;
        }
    }
    function deleteItem(index){
        logEvent('delete'+index)
        let tmp = [...itemsNormalized.value];
        let deletedItems = tmp.splice(index, 1)
        itemsNormalized.value = tmp;
        if (deletedItems.length) {
            emit('item-deleted', { index, item: deletedItems[0] });
        }
    }

    function highlightItem(itemRef){
        itemRef.scrollIntoView({ behavior: 'smooth', block: 'end' });
        itemRef.firstChild.classList.add('transition-colors', 'duration-500', 'bg-green-200');
        setTimeout(() => {
            itemRef.firstChild.classList.remove('bg-green-200');
        }, 600);
    }

    function addItem(item){
        logEvent('add: '+item?.content)
        let tmp = [...itemsNormalized.value];

        // Check if item already exists
        const existingItemIdx = tmp.findIndex(i => i.content.trim() === item.content.trim());
        if (existingItemIdx >= 0) {
            console.log('Item already exists:', item.content);
            let itemRef = elements.value[existingItemIdx];
            if (itemRef) {
                highlightItem(itemRef);
            }
            return; // Do not add the item if it already exists
        }

        tmp.push({ ...item, id: initialCount.value + 1 })
        initialCount.value += 1;
        itemsNormalized.value = tmp;
        nextTick(() => {
            const lastEl = elements.value[elements.value.length - 1];
            if (lastEl) {
                highlightItem(lastEl);
            }
        });        
    }
    function updateItem(index, content){
        logEvent('update: '+index+content)
        let tmp = [...itemsNormalized.value];
        tmp[index].content = content;
        itemsNormalized.value = tmp;
    }

    watch(itemsNormalized, (newVal, oldVal) => {
        emit('items-updated', newVal, oldVal)
        elements.value = [];
    });

    onUpdated(() => {
        // text content should be the same as current `count.value`
        console.log("component updated");
    })
    onMounted(() => {
        // text content should be the same as current `count.value`
        console.log("component mounted");
    })    

</script>

<template>
    <div ref="scrollContainer" class="overflow-auto max-h-96">
        <draggable 
            v-model="itemsNormalized"
            :animation="200"
            group="math"
            tag="ul"
            @start="isDragging=true"
            @end="isDragging=false"
            class="list-group p-0 list-style-none"
            :class="{'dragging': isDragging}"
            ghost-class="ghost"
            item-key="id">
                <template #item="{element, index}">
                    <li :id="`item-${element.id}`" :ref="el => elements[index] = el" class="mb-2 cursor-move w-full z-10">
                        <ListItem
                            class="rounded-md"
                            :content="element.content"
                            @item-selected="$emit('item-selected', element)"
                            :isLast="index === itemsNormalized.length - 1"
                            :isFirst="index === 0"
                        />
                        <!-- <span class="transition-colors, duration-500, bg-red-200">test</span> -->
                    </li>
                </template>
        </draggable>
    </div>
</template>

<!--
                            :isDeletable="true"
                            :isMovable="true"
                            @move-up="moveUp(index)"
                            @move-down="moveDown(index)"
                            @delete="deleteItem(index)"
-->

<style scoped>
    .list-item {
        cursor: move;
    }

    .list-move {
        transition: transform 0.2s;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .ghost {
        opacity: 0.8;
        /* background: #713004; */
    }
</style>
