<template>
  <div class="section">
    <div class="mb-5">
      <div class="flex justify-content-between">
        <p>Доставки на кухне</p>

        <PhoneCodeFilters
          @handlePhone="handlePhone"
          @handleOrderNumber="handleOrderNumber"
          @changeOption="changeOption"
        />
      </div>

      <div class="card-list" v-if="kitchedOrders?.length > 0">
        <Order
          v-for="order in kitchedOrders"
          :key="order?.orderNumber"
          :order="order"
          from="kitchen"
        />
      </div>

      <Card v-else>
        <template #content>Нет данных</template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import http from "@/http";
import { AwaitingOrder } from "@/types/Order";
import Order from "@/components/Order.vue";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";
const kitchedOrders = ref([] as AwaitingOrder[]);
const filterOrders = ref([] as AwaitingOrder[]);

const fetchKitchenOrder = async () => {
  try {
    const response = await http("admin/get-all-cooked-orders");
    console.log("response");
    if (response.status === 200) {
      kitchedOrders.value = response.data.orders;
      filterOrders.value = response.data.orders;
    }
  } catch (err) {
    console.log(err);
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
    kitchedOrders.value = results;
  } else {
    kitchedOrders.value = filterOrders?.value;
  }
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);

  const results = filterOrders?.value?.filter((item) =>
    String(item?.orderNumber)?.includes(value),
  );

  if (value && value?.length > 0) {
    kitchedOrders.value = results;
  }
  if (value === "null") {
    kitchedOrders.value = filterOrders.value;
  }
};
const changeOption = () => {
  kitchedOrders.value = filterOrders?.value;
};

onMounted(() => {
  fetchKitchenOrder();
});
</script>

<style scoped></style>
