<template>
 

<div>
  <h3>Снять с СТОП-ЛИСТА</h3>
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
    <template #body="slotProps">
<span >{{ slotProps.data.name }}</span>
    </template>
    <template #filter="{ filterModel, filterCallback }">
      <InputText
        v-model="filterModel.value"
        type="text"
        @input="filterCallback()"
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
        <Column
          field="name"
          header="Название"
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
            <div class="flex align-items-center gap-5">
              {{ slotProps.data.name }}
              <Button icon="pi pi-times" severity="danger" v-tooltip.top="'Снять с СТОП-ЛИСТА'"></Button>

           
            </div>
          </template>
        </Column>

         

       
        <template #empty> Нет данных. </template>
      </DataTable>
    </div>
  </template>
</DataTable>
</div>
</template>

<script setup lang="ts">
import http from "@/http";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import { Category, CategoryWithFoods,CategoryWithFoodsUpdated } from "@/types/Category";
import { useStore } from "vuex";
import { Food } from "@/types/Food";
const isModalVisibleFood = ref(false);
const store = useStore();
const showCheck = ref(false);
const globalSearch =ref('')
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

const selectCategory = (event: any) => {
  console.log("event", event);
  isFoodOpen.value = true;
  if (selectedFoodFalse?.value) {
    selectedFoodFalse.value = null;
    showCheck.value = false;
  }
  // const filteredFoods = stoppedListFoodsFalse?.value?.find(
  //   (item) => item?.Category?.id === event?.value?.id,
  // );
  // if (filteredFoods !== undefined && filteredFoods) {
  //   selectedFoods.value = filteredFoods;
  // }
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

const expandAll = () => {
  expandedRows.value = stoppedListFoodsFalse.value?.reduce(
    (acc: any, p: any) => (acc[p.id] = true) && acc,
    {},
  );
};

const handleGlobalSearch = () => {
  if (globalSearch && globalSearch?.value?.length > 0) {
    const value = globalSearch?.value?.toLocaleLowerCase();
   stoppedListFoodsFalse.value = filteredFoods.value
        ?.map((item) => {
          const filteredFoods = item.foods.filter((foodItem) => {
            const foodName = foodItem?.name?.toLowerCase();
            if (
              item?.name?.toLowerCase()?.includes(value) ||
              foodName?.includes(value.toLowerCase())
            ) {
              return true;
            }
            return false;
          });

          return {
            name: item.name,
            id: item.id,
            foods: filteredFoods,
          };
        })
        .filter((category) => category.foods.length > 0);
  }
};

const collapseAll = () => {
  expandedRows.value = null;
};

const hideFood = () => {
  const foodNames = selectedFoodFalse?.value?.map((item: Food) => item?.name);

  if (foodNames?.length > 0) {
    foodNames.forEach(async (name: string) => {
      const body = {
        foodName: name,
        status: !checked.value,
      };
      console.log("body", body);
      try {
        const response = await http.post("/admin/change-of-stop-list", body);
        console.log("hide food response", response);
        if (response.status === 200) {
          toast.add({
            severity: "success",
            detail: "Видимость еды обновлена!",
            summary: "Успешно",
          });
          isModalVisibleFood.value = false;
          showCheck.value = false;
          selectedFoodFalse.value = null;
          selectedCategory.value = null;
          setTimeout(() => {
            window.location.reload();
          }, 700);
        }
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Выберите блюдо!",
    });
  }
};

const getStoppedFoods = async () => {
  try {
    const response = await http("admin/get-all-foods-stoplist-true");
    if (response.status === 200) {
     const result = response.data?.map(
            (item: CategoryWithFoods) => ({
              id: item.Category.id,
              name: item.Category.name,
              foods: item.Foods,
            }),
          );

          stoppedListFoodsFalse.value = result?.filter((item:CategoryWithFoodsUpdated)=>item?.foods!==null)
          filteredFoods.value=stoppedListFoodsFalse.value
      console.log("stoppedListFoodsFalse", stoppedListFoodsFalse.value);
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
