<template>
  <div class="section">
    <div class="mb-5">
      <div class="flex justify-content-between align-items-center mb-5">
        <p>Распродажи</p>

        <Button
          type="button"
          label="Добавить распродажу"
          @click="isModalVisible = true"
        ></Button>
      </div>

      <div class="sales flex gap-2" v-if="sales.length">
        <SaleItem
          v-for="sale in sales"
          :key="sale?.id"
          :sale="sale"
          class="flex flex-column justify-content-center w-20rem"
        />
      </div>

      <Card v-else>
        <template #content>Нет данных</template>
      </Card>
    </div>
  </div>
  <div class="card flex justify-content-center">
    <Dialog
      v-model:visible="isModalVisible"
      modal
      header="Создать распродажу"
      :style="{ width: '35rem' }"
    >
      <div class="flex flex-column gap-3 mb-5">
        <label for="name" class="font-semibold">Название</label>
        <InputText
          id="name"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="newsName"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="info" class="font-semibold">Описание</label>
        <InputText
          id="descrInputRef"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="newsInfo"
          ref="descrInputRef"
          @input="handleDescr"
          :disabled="isDescrDisabled ? true : false"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="info" class="font-semibold">Скидка (в процентах)</label>
        <InputText
          id="info"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="saleDiscount"
        />
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <label for="Weight" class="font-semibold"
          >Изображение для распродажи</label
        >
        <input
          type="file"
          @change="($event: any) => onUpload($event)"
          id="uploadImage"
        />
      </div>
      <Button type="button" label="Создать" @click="createSale"></Button>
    </Dialog>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { News } from "@/types/News";
import http from "@/http";
const descrInputRef = ref<HTMLInputElement | null>(null);
import { useToast } from "primevue/usetoast";
import SaleItem from "@/components/Items/Sale.vue";
import { Sale } from "@/types/Sale";
const news = ref([] as News[]);
const isModalVisible = ref(false);
const uploadFile = ref();
const newsName = ref("");
const newsInfo = ref("");
const sales = ref([] as Sale[]);
const saleDiscount = ref("");
const toast = useToast();
const isDescrDisabled = ref(false);

const fetchSales = async () => {
  try {
    const response = await http("sale/get-all-sales");
    if (response.status === 200) {
      console.log("response get all sales", response);
      sales.value = response.data;
    }
  } catch (err) {
    console.log(err);
  }
};

const onUpload = async (event: any) => {
  uploadFile.value = event.target.files[0];
};

onMounted(() => {
  fetchSales();
});

const handleDescr = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let text = target.value;
  const valueWithoutSpaces = text.replace(/\s+/g, "");
  let maxLength = 225;
  if (valueWithoutSpaces.length > maxLength) {
    let trimmedText = "";
    let nonSpaceCount = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " ") {
        nonSpaceCount++;
      }
      if (nonSpaceCount > maxLength) {
        break;
      }
      trimmedText += text[i];
    }
    newsInfo.value = trimmedText;
  } else {
    newsInfo.value = text;
  }
};

const createSale = async () => {
  if (
    newsName.value?.length &&
    newsInfo.value?.length &&
    uploadFile.value &&
    saleDiscount.value
  ) {
    try {
      const formData = new FormData();
      formData.append("file", uploadFile.value);
      formData.append("name", newsName.value);
      formData.append("description", newsInfo.value);
      formData.append("discount", saleDiscount.value);
      const response = await http.post("admin/create-sale", formData);
      console.log("response create createSale", response);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Распродажа добавлена!",
        });
      }
      isModalVisible.value = false;
      fetchSales();
    } catch (err: any) {
      isModalVisible.value = true;
      console.log(err);
      if (err.response.data.developerMessage.includes("value too long")) {
        toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: "Название слишком длинное!",
        });
      }
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Заполните все поля!",
    });
  }
};
</script>

<style scoped></style>
