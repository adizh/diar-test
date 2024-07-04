<template>
    <div>
        <InputNumber v-if="selectedOption?.value=='orderNumber'"
        class="flex-auto"
        v-model.trim="filterValue"
        placeholder="Искать"
        :useGrouping="false"
        @input="handleOrderNumber"
        :min="0"
      />
 
      <InputMask v-else
       v-model="filterPhone"
        mask="999 99-99-99"
        placeholder="700 11-11-11"
        @update:modelValue="handlePhone"
        :autoClear="false"
      />
  <Dropdown
          :options="options"
          placeholder="Выбрать еду"
          class="w-full md:w-13rem"
          id="category"
          optionLabel="name"
          v-model.trim="selectedOption"
          @change="changeOption"

        />
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const selectedOption=ref({
    name:'Телефон',value:'phone'
})
const filterPhone =ref()
const filterValue =ref()
const options=ref([
    {name:'Телефон',value:'phone'},
    {name:'Номер заказа',value:'orderNumber'}
])
const emit = defineEmits<{
    handlePhone: [event:any]
    handleOrderNumber: [event:any]
    changeOption:[]

 
}>()
const handlePhone =(event:any)=>{
emit('handlePhone',event)
}

const handleOrderNumber =(event:any)=>{
emit('handleOrderNumber',event)
}

const changeOption =()=>{
    filterPhone.value=null   
    filterValue.value=null
    emit('changeOption')
}

</script>

<style scoped>

</style>