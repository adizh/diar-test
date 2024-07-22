<template>
  <div class="w-6">
    <h3>Снять с СТОП-ЛИСТА</h3>
    <DataTable :value="stoppedListFoodsFalse" dataKey="id">
      <template #header>
        <div class="flex flex-column justify-content-between mb-3">
          <div class="flex flex-wrap gap-2">
            <InputText
              v-model="globalSearch"
              type="text"
              @input="handleGlobalSearch"
              class="w-30rem p-column-filter"
              placeholder="Поиск"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <Button
              text
              icon="pi pi-plus"
              label="Открыть все"
              @click="expandAll"
            />
            <Button
              text
              icon="pi pi-minus"
              label="Скрыть все"
              @click="collapseAll"
            />
          </div>
        </div>
      </template>

      <Column field="name" header="Название">
        <template #body="slotProps">
          <div class="flex gap-2 align-items-center">
            <span>{{ slotProps.data.name }}</span>
            <Button
              icon="pi pi-times"
              severity="danger"
              v-tooltip.top="'Снять с СТОП-ЛИСТА'"
              @click="removeFromList(slotProps.data.name)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog modal header="СТОП-ЛИСТ" v-model:visible="openStopListModal">
      <ConfirmButtons
        confirmText="Потвердить"
        declineText="Отменить"
        :descrText="`Вы действительно хотите снять с СТОП-ЛИСТА ${selectedFoodList}`"
        @confirmAction="confirmRemoveStopList"
        @closeModal="openStopListModal = false"
      />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import http from "@/http";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import {
  Category,
  CategoryWithFoods,
  CategoryWithFoodsUpdated,
} from "@/types/Category";
import { useStore } from "vuex";
import { Food } from "@/types/Food";

const store = useStore();
const showCheck = ref(false);
const globalSearch = ref("");

import ConfirmButtons from "../UI/ConfirmButtons.vue";
const expandedRows = ref();

const toast = useToast();
const selectedFoodFalse = ref();

const categories = ref([] as Category[]);
const isFoodOpen = ref(false);
const stoppedListFoodsFalse = ref([] as Food[]);
const filteredFoods = ref([] as Food[]);
const selectedFoodList = ref("");
const openStopListModal = ref(false);
const selectCategory = (event: any) => {
  console.log("event", event);
  isFoodOpen.value = true;
  if (selectedFoodFalse?.value) {
    selectedFoodFalse.value = null;
    showCheck.value = false;
  }
};

const removeFromList = (foodName: string) => {
  openStopListModal.value = true;
  selectedFoodList.value = foodName;
};

const expandAll = () => {
  expandedRows.value = stoppedListFoodsFalse.value?.reduce(
    (acc: any, p: any) => (acc[p.id] = true) && acc,
    {},
  );
};

const handleGlobalSearch = () => {
  if (globalSearch) {
    const value = globalSearch.value.toLowerCase();
    if (value.length > 0) {
      const result = filteredFoods.value?.filter((item) =>
        item?.name?.toLowerCase()?.includes(value),
      );
      stoppedListFoodsFalse.value = result;
    } else {
      stoppedListFoodsFalse.value = [...filteredFoods.value];
    }
  }
};

const collapseAll = () => {
  expandedRows.value = null;
};

const confirmRemoveStopList = async () => {
  const status = await store.dispatch("sendFoodToStopList", {
    foodName: selectedFoodList?.value,
    status: false,
  });
  if (status === 200) {
    toast.add({
      severity: "success",
      detail: "Видимость еды обновлена!",
      summary: "Успешно",
    });
    openStopListModal.value = false;
    store.dispatch("getAllCategoryNames");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};

const getStoppedFoods = async () => {
  try {
    const response = await http("admin/get-all-foods-stoplist-true");
    if (response.status === 200) {
      const result = response.data?.map((item: CategoryWithFoods) => ({
        id: item.Category.id,
        name: item.Category.name,
        foods: item.Foods,
      }));

      stoppedListFoodsFalse.value = result
        ?.filter((item: CategoryWithFoodsUpdated) => item?.foods !== null)
        ?.map((item: CategoryWithFoodsUpdated) => item?.foods)
        ?.flat();

      console.log("stoppedListFoodsFalse", stoppedListFoodsFalse);
      filteredFoods.value = stoppedListFoodsFalse.value;
      console.log("filteredFoods", filteredFoods.value);
      categories.value = response.data?.map(
        (item: CategoryWithFoods) => item?.Category,
      );
      console.log("categories", categories);
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await store.dispatch("getAllCategoryNames");
  getStoppedFoods();
});
</script>

<style scoped>
.checkbox-hide {
  display: flex;
  gap: 5px;
}
</style>
