<script setup>
    
    import { ref, watch, onMounted, onUpdated, nextTick } from 'vue';
    import draggable from 'vuedraggable'
    import ListItem from './ListItem.vue';
    import { ComputeEngine } from "@cortex-js/compute-engine";

    const emit = defineEmits(['items-updated', 'toggle-selected']);
    defineExpose({addItem, updateItem, clearSelected});

    const props = defineProps({
        initialItems: {
            type: Array,
            default: () => []
        },
        compute: {
            type: Boolean,
            default: false
        }
    })

    const evauluationResult = {
        'NO_CALCULATION': -1,
        'INVALID_SYNTAX': 0,
        'MISSING_RESULT': 1,
        'INCORRECT_RESULT': 2,
        'CORRECT_RESULT': 3
    }
    const { NO_CALCULATION, INVALID_SYNTAX, MISSING_RESULT, INCORRECT_RESULT, CORRECT_RESULT } = evauluationResult;

    let ce = null;
    if (props.compute) {
        ce = new ComputeEngine();
    }

    let itemsNormalized = ref(normalizeItems(props.initialItems));
    let initialCount = ref(itemsNormalized.value.length);
    let isDragging = ref(false);
    let elements = ref([]);
    let scrollContainer = ref(null); // Add this line
    let selectedItem = ref(null);

    function normalizeItems(items) {
        return items.map((item, index) => ({
            ...item,
            id: !item.id ? index + 1 : item.id,
            evaluated: evaluateExpression(item.content || '')
        }));
    }

    function evaluateExpression(expression) {
        if (!ce) return NO_CALCULATION;
        try {
            const result = ce.parse(expression);
            if(result.errors.length > 0) {
                // console.error('Parse errors:', result.errors);
                return INVALID_SYNTAX;
            }
            else if(!Array.isArray(result.json) || result.json.length === 0) {
                return INVALID_SYNTAX;
            }
            else if(result.evaluate().json === "False"){
                return INCORRECT_RESULT;
            }
            else if(result.evaluate().json === "True"){
                return CORRECT_RESULT;
            }
            else {
                return MISSING_RESULT;
            }
            
        } catch (e) {
            console.error('Evaluation error:', e);
            return INVALID_SYNTAX;
        }
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

        initialCount.value += 1;
        tmp.push({ ...item, 
            id: initialCount.value,
            evaluated: evaluateExpression(item.content || '')
        })
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
        tmp[index].evaluated = evaluateExpression(content || '');
        itemsNormalized.value = tmp;
        clearSelected();
        nextTick(() => {
            const itemRef = elements.value[index];
            if (itemRef) {
                highlightItem(itemRef);
            }
        });
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

    function toggleSelected(element, index) {
        if (selectedItem.value === element) {
            selectedItem.value = null; // Deselect if already selected
            emit('toggle-selected', null, -1);
        } else {
            selectedItem.value = element; // Select the item
            emit('toggle-selected', element, index);
        }
    }

    function clearSelected() {
        selectedItem.value = null;
        emit('toggle-selected', null, -1);
    }

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
                    <li :id="`item-${element.id}`" :ref="el => elements[index] = el" class="mb-2 cursor-move w-full z-10 relative">
                        <ListItem
                            class="rounded-md flex-1"
                            :active="selectedItem === element"
                            :content="element.content"
                            @toggle-selected="toggleSelected(element, index)"
                            :isLast="index === itemsNormalized.length - 1"
                            :isFirst="index === 0"
                        />
                        <div class="absolute top-1 right-1 rounded-md bg-gray-200 p-1 text-xs font-bold text-gray-600"
                            :class="{
                                'bg-red-200': element.evaluated === INVALID_SYNTAX,
                                'bg-yellow-200': element.evaluated === MISSING_RESULT,
                                'bg-green-200': element.evaluated === CORRECT_RESULT,
                                'bg-orange-200': element.evaluated === INCORRECT_RESULT
                            }">
                            {{ element.evaluated === -1 ? 'NO_CALCULATION' :
                                element.evaluated === 0 ? 'INVALID_SYNTAX' :
                                element.evaluated === 1 ? 'MISSING_RESULT' :
                                element.evaluated === 2 ? 'INCORRECT_RESULT' :
                                element.evaluated === 3 ? 'CORRECT_RESULT' : '' }}
                            {{ element.evaluated }}
                        </div>
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
