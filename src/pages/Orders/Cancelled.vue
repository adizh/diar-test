<template>
  <div class="section">
    <div class="flex justify-content-between">
      <p class="mb-3">Отмененные доставки</p>

      <PhoneCodeFilters
        @changeOption="changeOption"
        @handlePhone="handlePhone"
        @handleOrderNumber="handleOrderNumber"
      />
    </div>

    <Card v-if="!awaitingOrders?.length">
      <template #content>Нет данных</template>
    </Card>

    <div v-else class="card-list">
      <Order
        v-for="order in awaitingOrders"
        :key="order?.orderNumber"
        :order="order"
        from="cancelled"
      />
    </div>

    <Paginator
      :rows="10"
      :totalRecords="totalItems"
      @page="changePage"
    ></Paginator>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import http from "@/http";
import { AwaitingOrder } from "@/types/Order";
import { onMounted } from "vue";
import Order from "@/components/Order.vue";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";

const noOrder = ref("");
const awaitingOrders = ref<AwaitingOrder[]>([]);
const filteredOrders = ref<AwaitingOrder[]>([]);

const currentPage = ref(1);
const totalItems = ref(1);

const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchAwaitingOrders();
  window.scrollTo(0, 0);
};

const fetchAwaitingOrders = async () => {
  try {
    const response = (await http.get(
      `admin/get-all-cancel-orders?page=${currentPage?.value}`,
    )) as any;
    console.log("response cancelled orders", response);
    if (response.status == 200) {
      awaitingOrders.value = response.data.orderResponse;
      filteredOrders.value = response.data.orderResponse;
      totalItems.value = response.data?.totalItems;
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
    awaitingOrders.value = results;
  } else {
    awaitingOrders.value = filteredOrders?.value;
  }
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);
  const results = filteredOrders?.value?.filter((item) =>
    String(item?.orderNumber)?.includes(value),
  );

  if (value && value?.length > 0) {
    awaitingOrders.value = results;
  }
  if (value === "null") {
    awaitingOrders.value = filteredOrders.value;
  }
};

const changeOption = () => {
  awaitingOrders.value = filteredOrders?.value;
};

onMounted(() => {
  fetchAwaitingOrders();
});
</script>

<style scoped></style>
