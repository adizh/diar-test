<template>
  <div>
    <span class="p-text-secondary block mb-5">Создать заказ (самовывоз)</span>

    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Комментарий</label>
      <InputText
        id="comment"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="orderValues.comment"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Кол-во еды</label>
      <InputNumber
        id="comment"
        class="flex-auto"
        autocomplete="off"
        v-model="orderValues.dishesCount"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Еда</label>
      <Dropdown
        :options="updatedFoods"
        placeholder="Выбрать еду"
        class="w-full md:w-14rem"
        id="category"
        filter
        optionLabel="name"
        v-model.trim="orderValues.foods"
        @change="selectFood"
      />
      <div class="selected-food" v-if="selectedFoods?.length">
        <div
          v-for="food in selectedFoods"
          :key="food?.value?.id"
          class="each-food"
        >
          <div class="flex align-items-center">
            {{ food?.value?.name }}
            <Button
              label="X"
              severity="danger"
              small
              @click="removeFood(food.value)"
            />
          </div>

          <div class="controls">
            <Button label="-" @click="decreaseCount(food.value)" />
            <span>{{ food?.value?.quantity }}</span>
            <Button label="+" @click="increaseCount(food.value)" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Цена</label>
      <InputNumber
        id="comment"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="orderValues.price"
      />
    </div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Имя</label>
      <InputText
        id="comment"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="orderValues.userName"
      />
    </div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Приготовить для </label>
      <InputText
        id="comment"
        class="flex-auto"
        autocomplete="off"
        v-model.trim="orderValues.prepareFor"
      />
    </div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="comment" class="font-semibold">Номер телефона</label>
      <InputMask
        id="phone"
        v-model.trim="orderValues.userPhone"
        mask="+996 (999) 99-99-99"
        placeholder="+996 (700) 11-11-11"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Отменить"
        severity="secondary"
        @click="$emit('closeModal')"
      ></Button>
      <Button
        type="button"
        label="Добавить"
        @click="createPickupOrder"
      ></Button>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import http from "@/http";
import { OrderFood, Food } from "@/types/Food";
import { useToast } from "primevue/usetoast";
import Order from "@/components/Order.vue";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();
const toast = useToast();
const orderValues = ref({
  comment: "",
  dishesCount: 0,
  foods: {} as OrderFood,
  prepareFor: "",
  price: 0,
  userName: "",
  userPhone: "",
});
const selectedFoods = ref([] as { value: Food }[]);
const emit = defineEmits(["closeModal"]);

const removeFood = (food: Food) => {
  const index = selectedFoods.value.findIndex(
    (item: { value: Food }) => item.value.id === food.id,
  );
  console.log("index", index);
  if (index !== -1) {
    selectedFoods.value.splice(index, 1);
  }
};
const increaseCount = (food: Food) => {
  food.quantity++;
};
const decreaseCount = (food: Food) => {
  if (food.quantity > 1) {
    food.quantity--;
  }
};
const selectFood = (event: any) => {
  console.log(event);
  console.log(event);
  const isExist = selectedFoods.value.findIndex(
    (item: any) => item.value.id === event.value.id,
  );
  if (isExist === -1) {
    selectedFoods.value.push(event);
  }
  setTimeout(() => {
    orderValues.value.foods = { name: "", price: 0, quantity: 0 };
  }, 500);
};

const updatedFoods = computed(() => {
  return store.getters.getFood.map((food: Food) => {
    return { ...food, quantity: 1 };
  });
});

const createPickupOrder = async () => {
  console.log("orderValues", orderValues);
  const foods = selectedFoods.value.map((item: { value: Food }) => {
    return {
      name: item?.value?.name,
      price: item?.value?.price,
      quantity: item?.value?.quantity,
    };
  });

  console.log("foods", foods);
  if (
    orderValues.value.comment?.length &&
    orderValues.value.prepareFor?.length &&
    orderValues.value.userName?.length &&
    orderValues.value.userPhone?.length &&
    foods?.length > 0 &&
    orderValues?.value?.dishesCount > 0 &&
    orderValues?.value?.price > 0
  ) {
    try {
      const body = {
        comment: orderValues?.value?.comment,
        dishesCount: orderValues?.value?.dishesCount,
        foods: foods,
        prepareFor: orderValues?.value?.prepareFor,
        price: orderValues?.value.price,
        userName: orderValues?.value?.userName,
        userPhone: orderValues?.value?.userPhone,
      };
      const response = await http.post(
        "pickup-orders/create-pickup-order",
        body,
      );
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Заказ на самовывоз создан!",
        });
        setTimeout(() => {
          emit("closeModal");
          //window.location.reload()
        }, 700);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Заполните все поля!",
    });
  }
};
onMounted(() => {
  store.dispatch("fetchAllFood");
});
</script>

<style scoped>
.selected-food {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.each-food {
  display: flex;
  justify-content: space-between;
}
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}
.controls button:hover {
  cursor: pointer;
}
</style>
