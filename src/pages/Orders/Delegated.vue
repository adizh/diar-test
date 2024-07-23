vbas3
<template>
  <div class="section">
    <div class="flex justify-content-between">
      <p class="mb-3">Переданные курьеру</p>
      <PhoneCodeFilters
        @handlePhone="handlePhone"
        @handleOrderNumber="handleOrderNumber"
        @changeOption="changeOption"
      />
    </div>
    <Card v-if="!orders?.length">
      <template #content>Нет данных</template>
    </Card>

    <div v-else class="card-list">
      <Order
        v-for="order in orders"
        :key="order?.orderNumber"
        :order="order"
        type="delegated"
        from="delegated"

      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import http from "@/http";
import { AwaitingOrder } from "@/types/Order";
import { onMounted } from "vue";
import Order from "@/components/Order.vue";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";
import { useStore } from "vuex";

const noOrder = ref("");
const orders = ref<AwaitingOrder[]>([]);
const filteredOrders = ref<AwaitingOrder[]>([]);

const fetchOrders = async () => {
  try {
    const response = (await http.get("admin/get-all-delegated-orders")) as any;
    console.log("response", response);
    if (response.status === 204) {
      noOrder.value = response.statusText;
    } else if (response.status == 200) {
      orders.value = response.data.orders;
      filteredOrders.value = response.data.orders;
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
  const results = filteredOrders?.value?.filter((item) => {
    const normalizedUserPhone = normalizePhone(item?.userPhone);
    return normalizedUserPhone.includes(normalizedInput);
  });

  if (event?.length > 0) {
    orders.value = results;
  } else {
    orders.value = filteredOrders?.value;
  }
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);
  const results = filteredOrders?.value?.filter((item) =>
    String(item?.orderNumber)?.includes(value),
  );

  if (value && value?.length > 0) {
    orders.value = results;
  }
  if (value === "null") {
    orders.value = filteredOrders.value;
  }
};
const changeOption = () => {
  orders.value = filteredOrders?.value;
};

onMounted(() => {
  fetchOrders();

});
</script>

<style scoped></style>
