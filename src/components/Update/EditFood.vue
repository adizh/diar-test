<template>
  <div>
    <div class="card flex gap-3 mb-5 flex-column">
      <div class="flex gap-3 mb-5 flex-column">
        <label for="category" class="font-semibold w-full"
          >Старое название еды</label
        >

        <InputText
          id="name"
          disabled="true"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="allFoodName"
        />
      </div>
    </div>

    <div class="flex gap-3 mb-5 flex-column">
      <label for="name" class="font-semibold">Новое название</label>
      <InputText
        id="name"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="newFoodName"
      />
    </div>

    <div class="flex gap-3 mb-5 flex-column">
      <label for="price" class="font-semibold">Новая цена</label>
      <InputNumber
        id="price"
        class="flex-auto"
        autocomplete="off"
        v-model="foodPrice"
      />
    </div>
    <div class="flex gap-3 mb-5 flex-column">
      <label for="price" class="font-semibold">Новый вес</label>
      <InputText
        id="price"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="foodWeight"
      />
    </div>

    <div class="flex gap-3 mb-5 flex-column">
      <label for="price" class="font-semibold">Новый контейнер</label>
      <Dropdown
        filter
        v-model="selectedContainerName"
        :options="store.getters.allContainers"
        optionLabel="name"
        :placeholder="selectedContainerName?.name || 'Выбрать контейнер'"
        class="w-full md:w-14rem"
        id="category"
      />
    </div>

    <div class="flex gap-3 mb-5 flex-column">
      <label for="Weight" class="font-semibold">Новое кол-во контейнера</label>
      <InputNumber
        id="Weight"
        class="flex-auto"
        autocomplete="off"
        v-model="newContainerCount"
      />
    </div>

    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Отменить"
        severity="secondary"
        @click="$emit('closeModal')"
      ></Button>
      <Button type="button" label="Обновить" @click="updateFood"></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Container } from "@/types/Container";
import { useStore } from "vuex";
const store = useStore();
import http from "@/http";
import { useToast } from "primevue/usetoast";
const props = defineProps({
  editItemName: {
    type: String,
  },
  editItenContainer: {
    type: String,
  },
});

const emit = defineEmits(["closeModal"]);

const allFoodName = ref(props.editItemName);
const newFoodName = ref("");
const foodPrice = ref(0);
const foodWeight = ref("");

const selectedContainerName = ref({ name: "" } as { name: string });
const newContainerName = ref("");
const newContainerCount = ref(0);
const toast = useToast();
const updateFood = async () => {
  if (newFoodName.value?.length) {
    try {
      const body = {
        newContainerCount: newContainerCount.value,
        newContainerName: selectedContainerName.value?.name,
        newName: newFoodName.value,
        newPrice: foodPrice.value,
        newWeight: foodWeight.value,
        oldName: allFoodName?.value,
      };
      const response = await http.put("admin/update-food", body);
      console.log("response", response);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Еда обновлена",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      emit("closeModal");
      store.dispatch("getAllCategoryNames");
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Заполните поле для нового имени!",
    });
  }
};

const getFoodByName = async (foodName: string) => {
  try {
    const response = await http.post("foods/get-food-by-name", {
      foodName: foodName,
    });
    console.log("get food name response", response);
    if (response.status === 200) {
      foodPrice.value = response.data.price;
      foodWeight.value = response.data.weight;
      newContainerName.value = response.data.containerName;
      newContainerCount.value = response.data.containerCount;
      selectedContainerName.value = { name: response.data.containerName };
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await store.dispatch("fetchAllContainers");
  selectedContainerName.value = store.getters.allContainers?.find(
    (item: Container) => item.name === props?.editItenContainer,
  );

  if (props?.editItemName) {
    getFoodByName(props?.editItemName);
  }
});
</script>

<style scoped></style>
