<template>
  <section>
    <div class="grid gap-3 justify-content-center mt-4 align-items-center">
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

      <div class="flex flex-column gap-3 mb-5 col-12">
        <label for="comment" class="font-semibold">Еда</label>
        <div class="selected-food" v-if="orderValues?.foods">
          <div
            v-for="food in orderValues?.foods"
            :key="food?.name"
            class="each-food mb-3"
          >
            <div class="flex align-items-center">
              {{ food?.name }}
              <Button
                label="X"
                severity="danger"
                small
                @click="removeOrderValues(food)"
              />
            </div>

            <div class="controls">
              <Button label="-" @click="decreaseOrderValues(food)" />
              <span>{{ food?.quantity }}</span>
              <Button label="+" @click="increaseOrderValues(food)" />
            </div>
          </div>
        </div>
        <Dropdown
          :options="updatedFoods"
          placeholder="Выбрать еду"
          class="w-full md:w-14rem"
          id="category"
          optionLabel="name"
          v-model.trim="newFoods"
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
        @click="updatePickupOrder"
      ></Button>
    </div>
  </section>
  <Toast />
</template>

<script setup lang="ts">
import http from "@/http";
import { OrderFood, Food } from "@/types/Food";
import { useToast } from "primevue/usetoast";
import { AwaitingOrder } from "@/types/Order";
import Order from "@/components/Order.vue";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();
const toast = useToast();
const orderValues = ref({
  comment: "",
  dishesCount: 0,
  foods: [] as OrderFood[],
  prepareFor: "",
  price: 0,
  userName: "",
  userPhone: "",
});
const props = defineProps<{
  order: AwaitingOrder;
}>();
const selectedFoods = ref([] as { value: Food }[]);
const emit = defineEmits(["closeModal"]);
const newFoods = ref({} as OrderFood);
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
};

const removeOrderValues = (food: OrderFood) => {
  const index = orderValues.value.foods?.findIndex(
    (item: OrderFood) => item.name === food.name,
  );
  console.log("index", index);
  if (index !== -1) {
    orderValues.value.foods.splice(index, 1);
  }
};
const increaseOrderValues = (food: OrderFood) => {
  food.quantity++;
};

const decreaseOrderValues = (food: OrderFood) => {
  if (food?.quantity > 1) {
    food.quantity--;
  }
};

const updatedFoods = computed(() => {
  return store.getters.getFood.map((food: Food) => {
    return { ...food, quantity: 1 };
  });
});

const updatePickupOrder = async () => {
  const foods = selectedFoods.value.map((item: { value: Food }) => {
    return {
      name: item?.value?.name,
      price: item?.value?.price,
      quantity: item?.value?.quantity,
    };
  });

  const orderFoods = orderValues?.value?.foods?.map((item: OrderFood) => {
    return { name: item?.name, price: item?.price, quantity: item?.quantity };
  });

  let totalFoods = [...foods, , ...orderFoods];
  totalFoods = totalFoods.filter((food) => {
    return food && food !== null;
  });
  console.log("totalFoods", totalFoods);
  if (
    orderValues.value.prepareFor?.length &&
    orderValues.value.userName?.length &&
    orderValues.value.userPhone?.length &&
    totalFoods?.length > 0 &&
    orderValues?.value?.dishesCount > 0 &&
    orderValues?.value?.price > 0
  ) {
    try {
      const body = {
        comment: orderValues?.value?.comment,
        dishesCount: orderValues?.value?.dishesCount,
        foods: totalFoods,
        prepareFor: orderValues?.value?.prepareFor,
        price: orderValues?.value.price,
        userName: orderValues?.value?.userName,
        userPhone: orderValues?.value?.userPhone,
        orderNumber: props?.order?.orderNumber,
      };
      const response = await http.put("admin/update-pickup-order", body);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Заказ успешно изменен!",
        });

        setTimeout(() => {
          emit("closeModal");
          window.location.reload();
        }, 1000);
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

  orderValues.value.comment = props?.order?.comment;
  orderValues.value.dishesCount = props?.order?.dishesCount;
  orderValues.value.foods = props?.order?.foods;
  orderValues.value.prepareFor = props?.order?.prepareFor as string;
  orderValues.value.price = props?.order?.price;
  orderValues.value.userName = props?.order?.userName;
  orderValues.value.userPhone = props?.order?.userPhone;
});
</script>

<style scoped>
.selected-food {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
