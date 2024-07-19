
<template>
  <div class="card">
      <DataTable v-model:expandedRows="expandedRows" :value="store.getters.getCategoriesWithFoods" dataKey="id"
          tableStyle="min-width: 20rem">
          <template #header>
              <div class="flex flex-wrap justify-content-end gap-2">
                  <Button text icon="pi pi-plus" label="Открыть все" @click="expandAll" />
                  <Button text icon="pi pi-minus" label="Скрыть все" @click="collapseAll" />
              </div>
          </template>
          <Column expander style="width: 5rem" />
          <Column field="name" header="Категория"></Column>
          <template #expansion="slotProps">
              <div class="p-3">
                  <DataTable :value="slotProps?.data?.foods">
                  
                      <Column field="name" header="Название" style="width:2rem">
                        <template #body="slotProps">
                       <div class="flex align-items-center gap-1">
                        {{slotProps.data.name}}
                        <img :src="`${slotProps.data.URLPhoto}`" :alt="slotProps.data.URLPhoto" class="w-6rem border-round" />
                       </div>
                        </template>
                    </Column>
                      <Column  field="price" header="Цена"></Column>
                      <Column field="weight" header="Вес"></Column>
                      <Column field="iDCTMax" header="iDCTMax"></Column>
                      <Column field="containerName" header="Контейнер"></Column>
                      <Column field="containerCount" header="Кол-во конт"></Column>
                      <Column>
                        <template #body="slotProps">
                          <Button label="Поставить на СТОП-ЛИСТ" @click="sendToStopList(slotProps.data.name)"/>
                        </template>
                      </Column>

                      <Column>
                        <template #body="slotProps">
                          <Button icon="pi pi-pencil"
                          severity="success"
                          v-tooltip.top="'Редактировать'"
                          @click="editItem(slotProps.data?.name,slotProps.data?.containerName)"/>
                        </template>
                      </Column>
                    
                  </DataTable>
              </div>
          </template>
      </DataTable>
<Toast />

<Dialog
v-model:visible="isEditOpen"
modal
header="Обновить еду"
:style="{ width: '35rem' }"
>
<EditFood :editItemName='editItemValues.name' :editItenContainer="editItemValues.container" @closeModal="isEditOpen=false"/>
</Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import {useStore} from 'vuex'
import EditFood from '@/components/Update/EditFood.vue';
const store= useStore()
const expandedRows = ref();
const toast = useToast();
const isEditOpen=ref(false)
const editItemValues=ref({
  name:"",
  container:''
})

const editItem =(itemName:string,itemContainer:string)=>{
  isEditOpen.value=true;
  editItemValues.value.name=itemName
  editItemValues.value.container=itemContainer
}


onMounted(() => {
  store.dispatch('getAllCategoryNames');
  

});

const sendToStopList = async(name:string)=>{
const status=await store.dispatch('sendFoodToStopList',{foodName:name,status:true})
if(status===200){
  toast.add({
            severity: "success",
            detail: "Видимость еды обновлена!",
            summary: "Успешно",
          });
}
}


const expandAll = () => {
  expandedRows.value =store.getters.getCategoriesWithFoods.reduce((acc:any, p:any) => (acc[p.id] = true) && acc, {});
}

const collapseAll = () => {
  expandedRows.value = null;
};



</script>
