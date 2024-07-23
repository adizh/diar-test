<template>
  <!-- <div>
    <Button
      label="Скрыть еду"
      severity="secondary"
      rounded
      @click="isModalVisibleFood = !isModalVisibleFood"
    />
    <Dialog
      v-model:visible="isModalVisibleFood"
      modal
      header="Скрыть еду"
      :style="{ width: '35rem' }"
      
    >
      <div class="card flex gap-3 mb-5 flex-column">
        <Dropdown
          v-model="selectedCategory"
          :options="categories"
          filter
          optionLabel="name"
          placeholder="Выберите категорию"
          @change="selectCategory"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex align-items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Dropdown>

        <MultiSelect
          display="chip"
          v-model="selectedFoodFalse"
          v-if="isFoodOpen"
          :options="selectedFoods?.Foods"
          filter
          optionLabel="name"
          placeholder="Выберите еду"
          :maxSelectedLabels="3"
          :selectionLimit="3"
          @change="handleFoodFalse"
        />
      

        <div v-if="showCheck" class="checkbox-hide">
          <Checkbox v-model="checked" :binary="true" id="hide-food" />
          <label for="hide-food" class="ml-1"> Скрыть </label>
        </div>
        <Button
          v-if="showCheck"
          label="Изменить"
          severity="info"
          class="mt-5"
          @click="hideFood"
        />
      </div>
    </Dialog>
  </div> -->

  <div class="w-6">
    <h3>Отправить на СТОП-ЛИСТ</h3>

    <DataTable
      v-model:expandedRows="expandedRows"
      v-model:filters="filtersСategory"

      filterDisplay="row"

      :value="stoppedListFoodsFalse"

      dataKey="id"
    >
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
      <Column expander style="width: 1rem" />
      <Column field="name" header="Категория">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="categoryFilter"
            type="text"
            @input="filterCategory"
            class="w-20rem p-column-filter"
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
            <Column field="name" header="Название" class="flex nameSearch">
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
                <div
                  class="flex align-items-center gap-5 justify-content-between"
                >
                  <span>
                    {{ slotProps.data.name }}
                  </span>
                  <Button
                    icon="pi pi-arrow-right"
                    severity="info"
                    v-tooltip.top="'Отправить на СТОП-ЛИСТ'"
                    @click="sendToStopList(slotProps.data.name)"
                  ></Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>

    <Dialog modal header="СТОП-ЛИСТ" v-model:visible="openStopListModal">
      <ConfirmButtons
        confirmText="Потвердить"
        declineText="Отменить"
        :descrText="`Вы действительно хотите отправить на СТОП-ЛИСТ ${selectedItemStopList}`"
        @confirmAction="confirmSendStopList"
        @closeModal="openStopListModal = false"
      />
    </Dialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import http from "@/http";
import { useToast } from "primevue/usetoast";
import ConfirmButtons from "@/components/UI/ConfirmButtons.vue";
import { ref, onMounted } from "vue";
import {
  Category,
  CategoryWithFoods,
  CategoryWithFoodsUpdated,
} from "@/types/Category";
import { useStore } from "vuex";
import { Food } from "@/types/Food";
const isModalVisibleFood = ref(false);
const store = useStore();
const showCheck = ref(false);
const globalSearch = ref("");
import { FilterMatchMode } from "primevue/api";
const expandedRows = ref();
const checked = ref(false);
const selectedCategory = ref();
const toast = useToast();
const selectedFoodFalse = ref();
const selectedFoods = ref({} as CategoryWithFoods);
const categories = ref([] as Category[]);
const isFoodOpen = ref(false);
const stoppedListFoodsFalse = ref([] as CategoryWithFoodsUpdated[]);
const filteredFoods = ref([] as CategoryWithFoodsUpdated[]);
const openStopListModal = ref(false);
const selectedItemStopList = ref("");
const selectCategory = (event: any) => {
  console.log("event", event);
  isFoodOpen.value = true;
  if (selectedFoodFalse?.value) {
    selectedFoodFalse.value = null;
    showCheck.value = false;
  }

};
const categoryFilter =ref('')

const confirmSendStopList = async () => {
  const status = await store.dispatch("sendFoodToStopList", {
    foodName: selectedItemStopList?.value,
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
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};
const sendToStopList = (foodName: string) => {
  openStopListModal.value = true;
  selectedItemStopList.value = foodName;
};


const filterCategory=()=>{
  const search = categoryFilter?.value?.trim()?.toLowerCase()
  if (search.length > 0) {

        const result = filteredFoods?.value?.filter((item: CategoryWithFoodsUpdated) => 
          item.name?.toLowerCase().includes(search)
        );
       stoppedListFoodsFalse.value = result;
      } else {
        stoppedListFoodsFalse.value = filteredFoods?.value
      }

}

const handleGlobalSearch = () => {
  if (globalSearch) {
    const value = globalSearch.value?.trim()?.toLowerCase();
    if (value.length > 0) {
      const result = filteredFoods.value
        .map((item) => {
          const filteredFoods = item.foods.filter((foodItem) => {
            const foodName = foodItem.name.toLowerCase();
            return (
              item.name.toLowerCase().includes(value) ||
              foodName.includes(value)
            );
          });

          return {
            ...item,
            foods: filteredFoods,
          };
        })
        .filter((category) => category.foods.length > 0);

      stoppedListFoodsFalse.value = result;
    } else {
      stoppedListFoodsFalse.value = [...filteredFoods.value];
    }
  }
};

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const filtersСategory = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const handleFoodFalse = (event: any) => {
  showCheck.value = true;
};

const getStoppedFoods = async () => {
  try {
    const response = await http("admin/get-all-foods-stoplist-false");
    if (response.status === 200) {
      stoppedListFoodsFalse.value = response.data?.map(
        (item: CategoryWithFoods) => ({
          id: item.Category.id,
          name: item.Category.name,
          foods: item.Foods,
        }),
      );
      filteredFoods.value = stoppedListFoodsFalse.value;
      console.log("stopped list false response", stoppedListFoodsFalse);
      categories.value = response.data?.map(
        (item: CategoryWithFoods) => item?.Category,
      );
      console.log("categories", categories);
    }
  } catch (err) {
    console.log(err);
  }
};

const expandAll = () => {
  expandedRows.value = stoppedListFoodsFalse.value?.reduce(
    (acc: any, p: any) => (acc[p.id] = true) && acc,
    {},
  );
};

const collapseAll = () => {
  expandedRows.value = null;
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
