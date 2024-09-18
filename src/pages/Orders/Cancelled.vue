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
const orderNumber = ref("");
const phone = ref("");
const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchAwaitingOrders();
  window.scrollTo(0, 0);
};
type Param = {
  orderNumber?: string;
  page: number;
  phone?: string;
};

const fetchAwaitingOrders = async () => {

  let params: Param = {
    page: currentPage?.value,
  };

  if (orderNumber?.value !== 'null' && orderNumber.value.length>0) {
    params.orderNumber = orderNumber?.value;
  }else{
    params.orderNumber=''
  }

  if (phone?.value) {
    params.phone = phone?.value;
  }

  try {
    const response = await http({
      method: "get",
      url: "admin/get-all-cancel-orders",
      params: params,
    });

    console.log("response cancelled orders", response);
    if (response.status == 200) {
      awaitingOrders.value = response.data.orderResponse;
      filteredOrders.value = response.data.orderResponse;
      totalItems.value = response.data?.totalItems;
    }
  } 

  catch (err) {
    console.log(err);
  }
};

const handlePhone = (event: string) => {
  orderNumber.value = "";
  phone.value = `+996 ${event}`;
  if (!event?.length) {
    phone.value = "";

    console.log("phone  ", phone);
  }

currentPage.value=1
  fetchAwaitingOrders();
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);
  phone.value = "";
  orderNumber.value = value;
  currentPage.value=1


  fetchAwaitingOrders();
};

const changeOption = () => {
  awaitingOrders.value = filteredOrders?.value;

  orderNumber.value = "";
  phone.value = "";
  fetchAwaitingOrders();
};

onMounted(() => {
  fetchAwaitingOrders();
});
</script>

<style scoped></style>
