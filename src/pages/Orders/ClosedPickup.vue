vbas3
<template>
  <div class="section">
    <div class="flex justify-content-between">
      <p class="mb-3">Самовывоз доставленных заказов</p>

      <PhoneCodeFilters
        @changeOption="changeOption"
        @handlePhone="handlePhone"
        @handleOrderNumber="handleOrderNumber"
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
        from="closed-pickup"
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
const orderNumber = ref("");
const phone = ref("");
const orders = ref<AwaitingOrder[]>([]);
const filteredOrders = ref<AwaitingOrder[]>([]);
const currentPage = ref(1);
const totalItems = ref(0);

const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchOrders();
  window.scrollTo(0, 0);
};
type Param = {
  orderNumber?: string;
  page: number;
  phone?: string;
};
const fetchOrders = async () => {
  try {
    let params: Param = {
      page: currentPage?.value,
    };
    if (
      orderNumber?.value.length &&
      orderNumber?.value !== 'null' 
    ) {
      params.orderNumber = orderNumber?.value;
    }else{
      params.orderNumber=''
    }
    if (phone?.value) {
      params.phone = phone.value || "";
    }

    const response = await http({
      method: "get",
      url: "admin/get-all-closed-pickup-orders",
      params: params,
    });
    console.log("response closed pickup", response);
    if (response.status == 200) {
      orders.value = response.data?.pickUpOrderResponse;
      filteredOrders.value = response.data?.pickUpOrderResponse;
      totalItems.value = response.data?.totalItems;
    }
  } catch (err) {
    console.log(err);
  }
};

const handlePhone = (event: string) => {
  orderNumber.value = "";
  phone.value = `+996 ${event}`;
  fetchOrders();
};

const handleOrderNumber = (event: any) => {
  phone.value = "";
  const value = String(event?.value);

  orderNumber.value = value;
  fetchOrders();
};

const changeOption = () => {
  orders.value = filteredOrders?.value;
  orderNumber.value = "";
  phone.value = "";
  fetchOrders();
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped></style>
