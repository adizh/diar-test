<template>
  <div class="section">
    <div class="mb-3 filter-header">
      <div class="flex flex-column gap-3">
        Доставки в ожидании
        <Button label="Создать заказ" @click="openCreateOrderModal" />
      </div>

      <div>
        <PhoneCodeFilters
          @handlePhone="handlePhone"
          @handleOrderNumber="handleOrderNumber"
          @changeOption="changeOption"
        />
      </div>
    </div>
    <Card v-if="!awaitingOrders?.length">
      <template #content>Нет данных</template>
    </Card>

    <div class="card-list" v-else>
      <Order
        v-for="order in awaitingOrders"
        :key="order?.orderNumber"
        :order="order"
        from="awaiting"
      />
    </div>
  </div>

  <div class="card flex justify-content-center">
    <Dialog
      v-model:visible="isCreateModal"
      modal
      header="Создать заказ"
      :style="{ width: '35rem' }"
    >
      <span class="p-text-secondary block mb-5">Создать заказ</span>
      <div class="flex flex-column gap-3 mb-5">
        <label for="address" class="font-semibold">Адрес</label>
        <InputText
          id="address"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.address"
        />
      </div>
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
        <label for="comment" class="font-semibold">Вход</label>
        <InputText
          id="comment"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.entrance"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="comment" class="font-semibold">Этаж</label>
        <InputText
          id="comment"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.floor"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="comment" class="font-semibold">Еда</label>
        <Dropdown
          :options="updatedFoods"
          placeholder="Выбрать еду"
          class="w-full md:w-14rem"
          id="category"
          optionLabel="name"
          filter
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
        <label for="comment" class="font-semibold">Номер квартиры</label>
        <InputText
          id="comment"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.houseNumber"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="comment" class="font-semibold">Внутренняя связь</label>
        <InputText
          id="comment"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.intercom"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="comment" class="font-semibold">Квартира/Офис</label>
        <InputText
          id="comment"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.kvOffice"
        />
      </div>
      <div class="flex flex-column gap-3 mb-5">
        <label for="comment" class="font-semibold">Метод оплаты</label>
        <InputText
          id="comment"
          class="flex-auto"
          autocomplete="off"
          v-model.trim="orderValues.paymentMethod"
        />
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
        <label for="comment" class="font-semibold">Номер телефона</label>
        <!-- <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.userPhone" /> -->

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
          @click="isCreateModal = false"
        ></Button>
        <Button type="button" label="Добавить" @click="createOrder"></Button>
      </div>
    </Dialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import http from "@/http";
import { AwaitingOrder } from "@/types/Order";
import { OrderFood, Food } from "@/types/Food";
import { onMounted } from "vue";
import Order from "@/components/Order.vue";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";
import { useRouter } from "vue-router";
const noOrder = ref("");
const toast = useToast();
const awaitingOrders = ref<AwaitingOrder[]>([]);
const filterOrders = ref<AwaitingOrder[]>([]);
const isCreateModal = ref(false);
const selectedFoods = ref([] as { value: Food }[]);
const store = useStore();

const orderValues = ref({
  address: ref(""),
  comment: ref(""),
  dishesCount: ref(0),
  entrance: ref(""),
  floor: ref(""),
  foods: ref({} as OrderFood),
  houseNumber: ref(""),
  intercom: ref(""),
  kvOffice: ref(""),
  paymentMethod: ref(""),
  price: ref(0),
  userName: ref(""),
  userPhone: ref(""),
  sdacha: ref(0),
});

const updatedFoods = computed(() => {
  return store.getters.getFood.map((food: Food) => {
    return { ...food, quantity: 1 };
  });
});

const removeFood = (food: Food) => {
  const index = selectedFoods.value.findIndex(
    (item: { value: Food }) => item.value.id === food.id,
  );
  console.log("index", index);
  if (index !== -1) {
    selectedFoods.value.splice(index, 1);
  }
};

const normalizePhone = (phone: string) => {
  return phone.replace(/[^\d]/g, "");
};

const handlePhone = (event: string) => {
  const normalizedInput = normalizePhone(event);

  const results = filterOrders?.value?.filter((item) => {
    const normalizedUserPhone = normalizePhone(item?.userPhone);
    return normalizedUserPhone.includes(normalizedInput);
  });

  if (event?.length > 0) {
    awaitingOrders.value = results;
  } else {
    awaitingOrders.value = filterOrders?.value;
  }
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);
  const results = filterOrders?.value?.filter((item) =>
    String(item?.orderNumber)?.includes(value),
  );
  if (results && results?.length > 0) {
    awaitingOrders.value = results;
  } else {
    awaitingOrders.value = filterOrders?.value;
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
const openCreateOrderModal = () => {
  isCreateModal.value = true;
};
const fetchAwaitingOrders = async () => {
  try {
    const response = (await http.get("admin/get-all-awaiting-orders")) as any;
    console.log("response", response);
    if (response.status === 204) {
      console.log("response status is 204");
      noOrder.value = response.statusText;
      console.log("no order", noOrder);
    } else if (response.status == 200) {
      awaitingOrders.value = response.data.orders;
      filterOrders.value = response.data.orders;
    }
  } catch (err) {
    console.log(err);
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

const changeOption = () => {
  awaitingOrders.value = filterOrders?.value;
};
const createOrder = async () => {
  const foods = selectedFoods.value.map((item: { value: Food }) => {
    return {
      name: item?.value?.name,
      price: item?.value?.price,
      quantity: item?.value?.quantity,
    };
  });
  console.log("foods", foods);
  const body = {
    address: orderValues.value.address,
    comment: orderValues.value.comment,
    dishesCount: orderValues.value.dishesCount,
    entrance: orderValues.value.entrance,
    floor: orderValues.value.floor,
    foods: foods,
    houseNumber: orderValues.value.houseNumber,
    intercom: orderValues.value.intercom,
    kvOffice: orderValues.value.kvOffice,
    paymentMethod: orderValues.value.paymentMethod,
    price: orderValues.value.price,
    userName: orderValues.value.userName,
    userPhone: orderValues.value.userPhone,
    sdacha: 343,
  };

  const areFieldsFilled = Object.entries(orderValues.value)
    .filter(([key]) => {
      return key !== "foods";
    })
    .every(([item, value]) => {
      return value;
    });
  if (!areFieldsFilled) {
    try {
      const response = await http.post("orders/create-order", body);
      console.log("response create order", response);
      if (response.status === 200) {
        isCreateModal.value = false;
        fetchAwaitingOrders();
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Заказ создан!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("all fields are required");
  }
};

onMounted(() => {
  fetchAwaitingOrders();
  store.dispatch("fetchAllFood");
});
let intervalId: any = null;

intervalId = setInterval(() => {
  fetchAwaitingOrders();
}, 5000);

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
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
