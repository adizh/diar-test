<template>
  <Dropdown
    v-model="selectedOptionAdd"
    :options="addOptions"
    optionLabel="name"
    placeholder="Добавить"
    class="w-full md:w-15rem mb-4 mt-4"
    @change="handleAdditions"
  />

  <Dialog
    header="Добавить категорию"
    v-model:visible="isModalVisible"
    modal
    style="width: 25rem"
  >
    <div class="flex flex-column gap-3 mb-5">
      <label for="email" class="font-semibold">Название категории</label>
      <InputText
        id="email"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="categoryName"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Отменить"
        severity="secondary"
        @click="isModalVisible = false"
      ></Button>
      <Button type="button" label="Добавить" @click="addNewCategory"></Button>
    </div>
  </Dialog>

  <Dialog
    header="Добавить контейнер"
    v-model:visible="isModalContainer"
    modal
    style="width: 25rem"
  >
    <div class="flex flex-column gap-3 mb-5">
      <label for="email" class="font-semibold">Название контейнера</label>
      <InputText
        id="email"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="containerName"
      />
    </div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="price" class="font-semibold">Цена</label>
      <InputNumber
        id="price"
        class="flex-auto"
        autocomplete="off"
        v-model="containerPrice"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="idt" class="font-semibold">iDCTMax</label>
      <InputNumber
        id="idt"
        class="flex-auto"
        autocomplete="off"
        v-model="containeriDCTMax"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Отменить"
        severity="secondary"
        @click="isModalContainer = false"
      ></Button>
      <Button type="button" label="Добавить" @click="addContainer"></Button>
    </div>
  </Dialog>

  <Dialog
    header="Добавить еду"
    v-model:visible="isModalVisibleFood"
    modal
    style="width: 28rem"
  >
    <div class="flex flex-column gap-3 mb-5">
      <label for="name" class="font-semibold">Название еды</label>
      <InputText
        id="name"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="foodName"
      />
    </div>

    <div class="card flex gap-3 mb-5 flex-column">
      <label for="category" class="font-semibold w-full"
        >Название категории</label
      >
      <Dropdown
        v-model="selectedCategory"
        :options="store.getters.categoriesName"
        optionLabel="name"
        placeholder="Выбрать категорию"
        class="w-full md:w-14rem"
        id="category"
      />
    </div>

    <div class="card flex gap-3 mb-5 flex-column">
      <label for="category" class="font-semibold w-full"
        >Название контейнера</label
      >
      <Dropdown
        v-model="selectedContainerName"
        :options="store.getters.allContainers"
        optionLabel="name"
        placeholder="Выбрать контейнер"
        class="w-full md:w-14rem"
        id="category"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="iDCTMax" class="font-semibold">iDCTMax</label>
      <InputText
        id="iDCTMax"
        class="flex-auto"
        autocomplete="off"
        v-model="foodiDCTMax"
      />
    </div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="containerCount" class="font-semibold"
        >Кол-во контейнеров</label
      >
      <InputText
        id="containerCount"
        class="flex-auto"
        autocomplete="off"
        v-model="foodContainerCount"
      />
    </div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="price" class="font-semibold">Цена</label>
      <InputText
        id="price"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="foodPrice"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="Weight" class="font-semibold">Вес</label>
      <InputText
        id="Weight"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="foodWeight"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="Weight" class="font-semibold">Файл</label>
      <input
        type="file"
        @change="($event: any) => onUpload($event)"
        id="uploadImage"
      />
    </div>

    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Отменить"
        severity="secondary"
        @click="isModalVisibleFood = false"
      ></Button>
      <Button type="button" label="Добавить еду" @click="addFood"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import http from "@/http";
import { useToast } from "primevue/usetoast";
import { onMounted } from "vue";
import { ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const categoryName = ref("");
const selectedOptionAdd = ref("");
const isModalVisible = ref(false);
const isModalVisibleFood = ref(false);
const isModalContainer = ref(false);
const containerName = ref("");
const containerPrice = ref(0);
const containeriDCTMax = ref(0);
const uploadFile = ref();
const selectedCategory = ref<{ name: string }>({} as { name: string });
const selectedContainerName = ref<{ name: string }>({} as { name: string });
const foodPrice = ref("");
const foodWeight = ref("");
const foodiDCTMax = ref("");
const foodContainerCount = ref("");
const foodName = ref("");
const toast = useToast();
type Option = {
  name: "Добавить еду" | "Добавить категорию" | "Добавить контейнер";
  value: "add-food" | "add-category" | "add-container";
};

type Event = {
  value: Option;
};

const addOptions: Option[] = [
  { name: "Добавить еду", value: "add-food" },
  { name: "Добавить категорию", value: "add-category" },
  { name: "Добавить контейнер", value: "add-container" },
];
const handleAdditions = (event: Event) => {
  if (event.value.value === "add-category") {
    isModalVisible.value = true;
  } else if (event.value.value === "add-container") {
    isModalContainer.value = true;
  } else if (event.value.value === "add-food") {
    isModalVisibleFood.value = true;
  }
};

const addNewCategory = async () => {
  if (categoryName.value?.length > 0) {
    try {
      const response = await http.post("admin/add-category", {
        name: categoryName.value,
      });
      console.log("response addNewCategory", response);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно добавлен",
          detail: "Добавить категорию",
          life: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.add({ detail: "Ошибка", severity: "error" });
    } finally {
      isModalVisible.value = false;
      store.dispatch("getAllCategoryNames");
    }
  }
};

const addContainer = async () => {
  if (containerName.value?.length > 0) {
    try {
      const response = await http.post("admin/create-container", {
        name: containerName.value,
        iDCTMax: containeriDCTMax.value,
        price: containerPrice.value,
      });
      console.log("response addNewCategory", response);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно добавлен",
          detail: "Добавить контейнер",
          life: 3000,
        });
        isModalContainer.value = false;
      }
    } catch (err) {
      console.log(err);
      toast.add({ detail: "Ошибка", severity: "error" });
    } finally {
      isModalContainer.value = false;
      store.dispatch("getAllCategoryNames");
      store.dispatch("fetchAllContainers");
    }
  }
};
const onUpload = async (event: any) => {
  uploadFile.value = event.target.files[0];
};

const checkFields = () => {
  if (
    uploadFile?.value &&
    foodName?.value &&
    selectedCategory?.value?.name &&
    foodPrice?.value &&
    foodWeight?.value &&
    foodiDCTMax?.value &&
    selectedContainerName?.value?.name &&
    foodContainerCount?.value
  ) {
    return true;
  } else {
    return false;
  }
};

const addFood = async () => {
  const result = checkFields();
  if (!result) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Заполните все поля!",
      life: 3000,
    });
  } else {
    try {
      const formData = new FormData();
      formData.append("file", uploadFile.value);
      formData.append("name", foodName.value);
      formData.append("categoryName", selectedCategory.value.name);
      formData.append("price", foodPrice.value);
      formData.append("weight", foodWeight.value);
      formData.append("iDCTMax", foodiDCTMax.value);
      formData.append("containerName", selectedContainerName.value.name);
      formData.append("containerCount", foodContainerCount.value);

      const response = await http.post("admin/add-food", formData);
      console.log("response", response);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Еда добавлена!",
        });
        isModalVisibleFood.value = false;
      }
    } catch (err) {
      console.log(err);
    } finally {
      store.dispatch("getAllCategoryNames");
    }
  }
};

onMounted(() => {
  store.dispatch("getAllCategoryNames");
  store.dispatch("fetchAllContainers");
});
</script>

<style scoped></style>
