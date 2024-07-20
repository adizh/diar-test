<template>
  <div>
    <Dropdown
      v-model="selectedOptionDelete"
      :options="deleteOptions"
      optionLabel="name"
      placeholder="Удалить"
      class="w-full md:w-15rem mb-4 mt-4"
      @change="handleDelete"
    />

    <Dialog
      v-model:visible="foodModal"
      header="Удалить еду"
      style="width: 40rem"
      modal
    >
      <div class="card flex flex-column align-items-center w-full gap-3">
        <label for="category" class="font-semibold w-full">Выбрать еду</label>

        <MultiSelect
          display="chip"
          v-model="selectedFood"
          :options="store.getters.allFoodsNames"
          filter
          placeholder="Выберите еду"
          :maxSelectedLabels="3"
          :selectionLimit="3"
          class="w-full"
          id="category"
        />
      </div>
      <div
        class="flex justify-content-end mt-2"
        v-if="selectedFood?.length > 0"
      >
        <Button
          @click="confirmFood"
          label="Удалить"
          severity="danger"
          outlined
        ></Button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="isFoodDeleteOpen"
      modal
      header="Удалить еду"
      :style="{ width: '25rem' }"
    >
      <ConfirmButtons
        :descrText="`Вы действительно хотите удалить ${selectedFood}`"
        confirmText="Удалить"
        declineText="Отменить"
        @closeModal="isFoodDeleteOpen = false"
        @confirmAction="deleteFood"
      />
    </Dialog>

    <Dialog
      v-model:visible="categoryModal"
      header="Удалить категорию"
      style="width: 30rem"
      modal
    >
      <div class="card flex flex-column gap-3 w-full">
        <label for="category" class="font-semibold w-full"
          >Выбрать категорию</label
        >
        <Dropdown
          v-model="selectedCategory"
          :options="store.getters.categoriesName"
          optionLabel="name"
          placeholder="Выбрать категорию"
          filter
          class="w-full md:w-14rem"
          id="category"
        />
      </div>
      <div class="flex justify-content-end mt-2" v-if="selectedCategory.name">
        <Button
          @click="confirm2()"
          label="Удалить"
          severity="danger"
          outlined
        ></Button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="isCategoryDeleteOpen"
      modal
      header="Удалить категорию"
      :style="{ width: '25rem' }"
    >
      <ConfirmButtons
        :descrText="`Вы действительно хотите удалить  ${selectedCategory?.name}`"
        confirmText="Удалить"
        declineText="Отменить"
        @closeModal="isCategoryDeleteOpen = false"
        @confirmAction="deleteCategory"
      />
    </Dialog>

    <Dialog v-model:visible="containerModal" header="Удалить контейнер" style="width:35rem" modal>
     <div class="flex flex-column gap-3">
        <label for="category" class="font-semibold w-full"
        >Выбрать контейнер</label
      >
      <Dropdown
        v-model="selectedContainer"
        :options="store.getters.allContainers"
        optionLabel="name"
        placeholder="Выбрать контейнер"
        filter
        class="w-full md:w-14rem"
        id="container"
        @change="handleContainer"
      />

      <div class="flex justify-content-end mt-2" v-if="selectedContainer?.name">
        <Button
          @click="confirm3()"
          label="Удалить"
          severity="danger"
          outlined
        ></Button>
      </div>
     </div>
</Dialog>

<Dialog
v-model:visible="isDeleteContainer"
modal
header="Удалить контейнер"
:style="{ width: '25rem' }"
>
<ConfirmButtons
  :descrText="`Вы действительно хотите удалить  ${selectedContainer?.name}`"
  confirmText="Удалить"
  declineText="Отменить"
  @closeModal="isDeleteContainer = false"
  @confirmAction="deleteContainer"
/>
</Dialog>
  </div>
</template>

<script setup lang="ts">
import http from "@/http";
import { useToast } from "primevue/usetoast";
import {Container} from '@/types/Container'
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import ConfirmButtons from "../UI/ConfirmButtons.vue";
import { Category } from "@/types/Category";

const selectedOptionDelete = ref("");
const foodModal = ref(false);
const containerModal = ref(false);
const categoryModal = ref(false);
const isCategoryDeleteOpen = ref(false);
const isFoodDeleteOpen = ref(false);
const selectedContainer = ref({} as Container)
const isDeleteContainer=ref(false)
const selectedFood = ref([]);
const store = useStore();
const toast = useToast();
const selectedCategory = ref({} as Category);
type Option = {
  name: "Удалить еду" | "Удалить категорию" | "Удалить контейнер";
  value: "delete-food" | "delete-category" | "delete-container";
};

const confirmFood = () => {
  isFoodDeleteOpen.value = true;
};

const confirm3 =()=>{
    isDeleteContainer.value=true
}
type Event = {
  value: Option;
};

const deleteOptions: Option[] = [
  { name: "Удалить еду", value: "delete-food" },
  { name: "Удалить категорию", value: "delete-category" },
  { name: "Удалить контейнер", value: "delete-container" },
];
const confirm2 = () => {
  isCategoryDeleteOpen.value = true;
};
const handleDelete = (event: Event) => {
  if (event.value.value === "delete-category") {
    categoryModal.value = true;
  } else if (event.value.value === "delete-container") {
    containerModal.value = true;
  } else if (event.value.value === "delete-food") {
    foodModal.value = true;
  }
};

const handleContainer =()=>{
    console.log('handleContainer',selectedContainer)
}
const deleteFood = async () => {
  console.log("selectedFood", selectedFood);
  if (selectedFood?.value?.length > 0) {
    selectedFood?.value?.forEach(async (foodName: string) => {
      try {
        const response = await http({
          method: "delete",
          url: `admin/delete-food`,
          data: { name: foodName },
        });
        console.log("response", response);
        if (response.status) {
          toast.add({
            severity: "success",
            summary: "Успешно",
            detail: "Удалено",
            life: 3000,
          });
          isFoodDeleteOpen.value = false;
          selectedFood.value = [];
          setTimeout(() => {
            window.location.reload();
          }, 700);
        }
      } catch (err: any) {
        console.log(err);
        toast.add({
          severity: "error",
          summary: "Ошибка при удалении",
          detail: err.response.statusText,
          life: 3000,
        });
      }finally{
        foodModal.value=false
        isFoodDeleteOpen.value = false;
        store.dispatch("getAllCategoryNames");
      }
    });
  }
};
const deleteCategory = async () => {
  try {
    const response = await http({
      method: "delete",
      data: { name: selectedCategory.value.name },
      url: "admin/delete-category",
    });
    if (response.status === 200) {
      toast.add({
        severity: "info",
        summary: "Успешно",
        detail: "Категория удалена",
      });
      isCategoryDeleteOpen.value = false;
    }
  } catch (err: any) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: err.response.statusText,
    });
  }finally{
    isCategoryDeleteOpen.value = false;
    categoryModal.value=false
    store.dispatch("getAllCategoryNames");

  }
};


const deleteContainer =async()=>{
    try{
        const response= await http({
            method:'delete',
            url:'/admin/delete-container-by-name',
            data: { containerName: selectedContainer.value.name }
        })

        console.log('response delete container',response)
        if(response.status===200){
            toast.add({
      severity: "success",
      summary: "Успешно",
      detail: 'Контейнер удален',
    });
        }

    }catch(err:any){
        console.log(err)
        toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: err.response.statusText,
    });
    }finally{
        isDeleteContainer.value= false;
        containerModal.value=false
        store.dispatch("getAllCategoryNames");
        store.dispatch("fetchAllContainers");
    }
}
onMounted(() => {
  store.dispatch("getAllCategoryNames");
  store.dispatch("fetchAllContainers");
});
</script>

<style scoped></style>
