<template>
  <div class="section">
    Отмененные доставки самовывоз
    <Card v-if="!orders?.length">
      <template #content>Нет данных</template>
    </Card>

    <div v-else class="card-list">
      <Order v-for="order in orders" :key="order?.orderNumber":order="order" from="cancelled-pickup" />
    </div>
    <!-- <ul v-else class="card-list">
      <li v-for="order in orders" :key="order?.orderNumber">
        <Order :order="order" from="cancelled-pickup" />
      </li>
    </ul> -->
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

const noOrder = ref("");
const orders = ref<AwaitingOrder[]>([]);
const currentPage = ref(1);
const totalItems = ref(1);

const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchOrders();
  window.scrollTo(0, 0);
};
const fetchOrders = async () => {
  try {
    const response = (await http.get(
      `admin/get-all-cancel-pickup-orders?page=${currentPage?.value}`,
    )) as any;
    console.log("response cancelled pickup", response);

    if (response.status == 200) {
      orders.value = response.data?.pickUpOrderResponse;
      totalItems.value = response.data?.totalItems;
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped></style>
