<template>
  <div class="card mt-5">
    <div class="menu-operation flex justify-content-end gap-2 w-full pr-3">
      <AddItems />
      <DeleteItems />
    </div>

    <DataTable
      v-model:expandedRows="expandedRows"
      v-model:filters="filtersСategory"
      filterDisplay="row"
      :value="store.getters.getCategoriesWithFoods"
      dataKey="id"
    >

      <template #header>
        <div class="flex justify-content-between mb-3">
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

      <Column expander style="width: 1rem" />
      <Column field="name" header="Категория">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="w-30rem p-column-filter"
            placeholder="Поиск по категориям"
          />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="pt-0 pb-3 pl-3 pr-3">
          <DataTable
            :value="slotProps?.data?.foods"
            v-model:filters="filters"
            filterDisplay="row"
            style="margin-right: -20px"
          >
            <template #header>
            <div style="text-align:left">
              <MultiSelect :modelValue="selectedColumns" :options="foodTogglCol" optionLabel="header" @update:modelValue="onToggle"
                  display="chip" placeholder="Выбрать столбцы" />
          </div>
          </template>
            <Column
              field="name"
              header="Название"
              style="width: 18rem"
              class="flex nameSearch"
            >
              <template #filter="{ filterModel, filterCallback }">
                <InputText
                  v-model="filterModel.value"
                  type="text"
                  @input="filterCallback()"
                  class="w-full p-column-filter"
                  placeholder="Поиск по имени"
                />
              </template>

              <template #body="slotProps">
                <div class="flex align-items-center gap-1 w-100">
                <p>
                  {{ slotProps.data.name }}
                </p>
                <div>
                  <img
                  v-tooltip.top="'Изменить'"
                  :src="`${imgUrl(slotProps.data.URLPhoto)}`"
                  :alt="slotProps.data.URLPhoto"
                  class="w-6rem border-round"
                  @click="updateFoodImage(slotProps.data?.name)"
                />

                </div>

                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    style="display: none"
                    accept="image/*"
                  />
                </div>
              </template>
            </Column>
            <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index"></Column>
            <!-- <Column field="price" header="Цена"></Column>
            <Column field="weight" header="Вес"></Column>
            <Column field="iDCTMax" header="iDCTMax"></Column>
            <Column field="containerName" header="Контейнер"></Column>
            <Column field="containerCount" header="Кол-во конт"></Column> -->
            <Column>
              <template #body="slotProps">
                <Button
                  severity="danger"
                  label="Поставить на СТОП-ЛИСТ"
                  @click="sendToStopList(slotProps.data.name)"
                />
              </template>
            </Column>

            <Column>
              <template #body="slotProps">
                <Button
                  :icon="
                    !slotProps.data?.isFeatured
                      ? 'pi pi-star'
                      : 'pi pi-star-fill'
                  "
                  severity="warning"
                  v-tooltip.top="
                    !slotProps.data?.isFeatured
                      ? 'Добавить в популярное'
                      : 'Убрать из популярного'
                  "
                  @click="
                    addToPopular(slotProps.data.name, slotProps.data.isFeatured)
                  "
                />
              </template>
            </Column>

            <Column class="buttons-cell">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  severity="success"
                  v-tooltip.top="'Редактировать'"
                  @click="
                    editItem(
                      slotProps.data?.name,
                      slotProps.data?.containerName,
                    )
                  "
                />
              </template>
            </Column>

            <Column class="buttons-cell)">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  v-tooltip.top="'Удалить'"
                  @click="openDeleteModal(slotProps.data?.name)"
                />
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
      <EditFood
        :editItemName="editItemValues.name"
        :editItenContainer="editItemValues.container"
        @closeModal="isEditOpen = false"
      />
    </Dialog>

    <Dialog v-model:visible="isDeleteModalOpen" modal header="Удаление еды">
      <ConfirmButtons
        confirmText="Удалить"
        declineText="Отменить"
        :descrText="`Вы действительно хотите удалить ${deleteItem}`"
        @confirmAction="confirmDeleteFood"
        @closeModal="isDeleteModalOpen = false"
      />
    </Dialog>

    <Dialog v-model:visible="openPopularModal" modal header="Статус еды">
      <ConfirmButtons
        confirmText="Потвердить"
        declineText="Отменить"
        :descrText="`Вы действительно хотите ${itemSelectedPopuler.isFeatured ? 'убрать из популярного' : 'добавить в популярное'} ${itemSelectedPopuler?.name}`"
        @confirmAction="confirmFoodStatus"
        @closeModal="openPopularModal = false"
      />
    </Dialog>

    <Dialog modal header="СТОП-ЛИСТ" v-model:visible="openStopListModal">
      <ConfirmButtons
        confirmText="Потвердить"
        declineText="Отменить"
        :descrText="`Вы действительно хотите отправить на СТОП-ЛИСТ ${selectedItemForStopList}`"
        @confirmAction="confirmSendStopList"
        @closeModal="openStopListModal = false"
      />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useStore } from "vuex";
import EditFood from "@/components/Update/EditFood.vue";
import ConfirmButtons from "@/components/UI/ConfirmButtons.vue";
import { FilterMatchMode } from "primevue/api";
import DeleteItems from "@/components/Update/DeleteItems.vue";
import http from "@/http";
import AddItems from "@/components/Add/AddItems.vue";
import { CategoryWithFoodsUpdated } from "@/types/Category";
import { Food } from "@/types/Food";
const store = useStore();
const expandedRows = ref();
const selectedColumns = ref();
const foodsColumns = ref([] as Food[]);
const itemSelectedPopuler = ref({ name: "", isFeatured: false });
const openPopularModal = ref(false);
const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const filtersСategory = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const toast = useToast();
const isEditOpen = ref(false);
const foodUpdateName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const editItemValues = ref({
  name: "",
  container: "",
});
const globalSearch = ref("");
const isDeleteModalOpen = ref(false);
const deleteItem = ref("");
const openStopListModal = ref(false);
const selectedItemForStopList = ref("");

const editItem = (itemName: string, itemContainer: string) => {
  isEditOpen.value = true;
  editItemValues.value.name = itemName;
  editItemValues.value.container = itemContainer;
};
const imgUrl = (url: string) => {
  return url;
};

const handleGlobalSearch = () => {
  const value = globalSearch?.value?.toLocaleLowerCase();
  store.dispatch("filterCategoriesWithFoods", value);
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    console.log("Selected image file:", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", foodUpdateName.value);

    try {
      const response = await http.put("/admin/update-food-image", formData);

      console.log("response update food image", response);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Фотография обновлена",
          life: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Ошибка при загрузке фото",
        life: 3000,
      });
    }
  }
};

const foodTogglCol = ref([
  { header: "Цена",field:'price' },
  { header: "Вес" ,field:'weight' },
  { header: "iDCTMax",field:'iDCTMax'  },
  { header: "Контейнер",field:'containerName'  },
  { header: "Кол-во конт",field:'containerCount'  },
])

const onToggle = (val:any) => {
    selectedColumns.value = foodTogglCol.value.filter(col => val.includes(col));
};

onMounted(async () => {
  await store.dispatch("getAllCategoryNames");
  selectedColumns.value = foodTogglCol?.value
  foodsColumns.value = store.getters.getCategoriesWithFoods?.map(
    (item: CategoryWithFoodsUpdated) => {
      return item?.foods;
    },
  );

  console.log("foodsColumns", foodsColumns);
  console.log("selectedColumns", selectedColumns);

});

const openDeleteModal = (itemName: string) => {
  deleteItem.value = itemName;
  isDeleteModalOpen.value = true;
};

const confirmSendStopList = async () => {
  const status = await store.dispatch("sendFoodToStopList", {
    foodName: selectedItemForStopList.value,
    status: true,
  });
  if (status === 200) {
    toast.add({
      severity: "success",
      detail: "Видимость еды обновлена!",
      summary: "Успешно",
    });
    openStopListModal.value = false;
    store.dispatch("getAllCategoryNames");
  }
};

const sendToStopList = async (name: string) => {
  openStopListModal.value = true;
  selectedItemForStopList.value = name;
};

const confirmDeleteFood = async () => {
  console.log("delete fpod", deleteItem);
  const status = await store.dispatch("deleteFood", deleteItem?.value);
  if (status === 200) {
    toast.add({
      severity: "success",
      summary: "Успешно",
      detail: "Удалено",
      life: 3000,
    });
    store.dispatch("getAllCategoryNames");
    isDeleteModalOpen.value = false;
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Ошибка при удалении",
      life: 3000,
    });
  }
};

const expandAll = () => {
  expandedRows.value = store.getters.getCategoriesWithFoods.reduce(
    (acc: any, p: any) => (acc[p.id] = true) && acc,
    {},
  );
};

const collapseAll = () => {
  expandedRows.value = null;
};

const updateFoodImage = (foodName: string) => {
  foodUpdateName.value = foodName;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const confirmFoodStatus = async () => {
  const body = {
    changeTo: !itemSelectedPopuler.value.isFeatured,
    foodName: itemSelectedPopuler.value.name,
  };
  try {
    const response = await http.post("admin/change-is-featured", body);
    if (response.status === 200) {
      toast.add({
        severity: "success",
        detail: "Статус еды изменен!",
        summary: "Успешно",
      });
    }
  } catch (err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Произошла ошибка",
      life: 3000,
    });
  } finally {
    openPopularModal.value = false;
    store.dispatch("getAllCategoryNames");
  }
};

const addToPopular = (foodName: string, value: boolean) => {
  openPopularModal.value = true;
  itemSelectedPopuler.value.name = foodName;
  itemSelectedPopuler.value.isFeatured = value;
};

</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th.nameSearch),
:deep(.p-datatable .p-datatable-tbody > tr > td.nameSearch) {
  margin-top: 41px !important;
}

:deep(.p-datatable-table) {
  margin-left: -40p !important;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.5rem 0.8rem 0.5rem 0.3rem !important;
}
</style>
