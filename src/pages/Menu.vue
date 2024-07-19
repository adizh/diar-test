
<template>
  <div class="card mt-5">
      <DataTable v-model:expandedRows="expandedRows" :value="store.getters.getCategoriesWithFoods" dataKey="id"
          tableStyle="width: 66rem ">
          <template #header>
           <div class="flex justify-content-between mb-3">
            <div class="flex flex-wrap gap-2">
          </div>
              <div class="flex flex-wrap  gap-2">
                  <Button text icon="pi pi-plus" label="Открыть все" @click="expandAll" />
                  <Button text icon="pi pi-minus" label="Скрыть все" @click="collapseAll" />
              </div>
           </div>
          </template>
          <Column expander style="width: 1rem" />
          <Column field="name" header="Категория"></Column>
          <template #expansion="slotProps">
              <div class="pt-0 pb-3 pl-3 pr-3">
                  <DataTable :value="slotProps?.data?.foods">
                      <Column filters field="name" header="Название" style="width:2rem">
                        <template #body="slotProps">
                       <div class="flex align-items-center gap-1">
                        {{slotProps.data.name}}
                        <img v-tooltip.top="'Изменить'" :src="`${imgUrl(slotProps.data.URLPhoto)}`" :alt="slotProps.data.URLPhoto" class="w-6rem border-round"
                        @click="updateFoodImage(slotProps.data?.name)" />
                        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" accept="image/*"   />
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
                          <Button severity="danger" label="Поставить на СТОП-ЛИСТ" @click="sendToStopList(slotProps.data.name)"/>
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

                      <Column>
                        <template #body="slotProps">
                          <Button icon="pi pi-trash"
                          severity="danger"
                          v-tooltip.top="'Удалить'"
                          @click="openDeleteModal(slotProps.data?.name)"/>
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

<Dialog v-model:visible="isDeleteModalOpen"
modal
header="Удаление еды">

  <ConfirmButtons
  confirmText="Удалить"
  declineText="Отменить"
  :descrText="`Вы действительно хотите удалить ${deleteItem}`"
  @confirmAction="confirmDeleteFood"
  @closeModal="isDeleteModalOpen = false"
/>
</Dialog>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import {useStore} from 'vuex'
import EditFood from '@/components/Update/EditFood.vue';
import ConfirmButtons from '@/components/UI/ConfirmButtons.vue';
import http from '@/http';
const store= useStore()
const expandedRows = ref();
const toast = useToast();
const isEditOpen=ref(false)
const foodUpdateName=ref('')
const fileInput = ref<HTMLInputElement | null>(null);
const editItemValues=ref({
  name:"",
  container:''
})
const isDeleteModalOpen=ref(false)
const deleteItem=ref('')
const editItem =(itemName:string,itemContainer:string)=>{
  isEditOpen.value=true;
  editItemValues.value.name=itemName
  editItemValues.value.container=itemContainer
}
const imgUrl =(url:string)=>{
  return url;
}

const handleFileChange = async(event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
          console.log('Selected image file:', file)
          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", foodUpdateName.value);

try{
  const response = await http.put('/admin/update-food-image',formData)

  console.log('response update food image',response)
  if(response.status===200){
    toast.add({
          severity: "success",
          summary: "Успешно",
          detail:'Фотография обновлена',
          life: 3000,
        });
  }
}catch(err){
  console.log(err)
  toast.add({
          severity: "error",
          summary: "Ошибка",
          detail:'Ошибка при загрузке фото',
          life: 3000,
        });
}
          
        

      }
    };
onMounted(() => {
  store.dispatch('getAllCategoryNames');
});



const openDeleteModal =(itemName:string)=>{

  deleteItem.value =itemName
  isDeleteModalOpen.value=true
}

const sendToStopList = async(name:string)=>{
const status=await store.dispatch('sendFoodToStopList',{foodName:name,status:true})
if(status===200){
  toast.add({
            severity: "success",
            detail: "Видимость еды обновлена!",
            summary: "Успешно",
          });
          store.dispatch('getAllCategoryNames');
}
}

const confirmDeleteFood =async()=>{
  console.log('delete fpod',deleteItem)
  const status = await store.dispatch('deleteFood',deleteItem?.value)
  if(status===200){
    toast.add({
            severity: "success",
            summary: "Успешно",
            detail: "Удалено",
            life: 3000,
          });
          store.dispatch('getAllCategoryNames');
          isDeleteModalOpen.value=false
  }else{
    toast.add({
          severity: "error",
          summary: "Ошибка",
          detail:'Ошибка при удалении',
          life: 3000,
        });
  }

}

const expandAll = () => {
  expandedRows.value =store.getters.getCategoriesWithFoods.reduce((acc:any, p:any) => (acc[p.id] = true) && acc, {});
}

const collapseAll = () => {
  expandedRows.value = null;
};

const updateFoodImage =(foodName:string)=>{
  foodUpdateName.value=foodName
if (fileInput.value) {
        fileInput.value.click();
      }
}


</script>
