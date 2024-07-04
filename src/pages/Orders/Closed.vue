vbas3
<template>
  <div class="section">
    Доставленные
    <Card v-if="!orders?.length">
      <template #content>Нет данных</template>
    </Card>


    <div v-else class="card-list">
      <Order v-for="order in orders" :key="order?.orderNumber" :order="order" from="closed" />
    </div>
    <!-- <ul v-else class="card-list">
      <li v-for="order in orders" :key="order?.orderNumber">
        <Order :order="order" from="closed" />
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

const totalPages = ref(0);
const totalItems = ref(0);
const currentPage = ref(1);
const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchOrders();
  window.scrollTo(0, 0);
};
const fetchOrders = async () => {
  try {
    const response = (await http.get(
      `admin/get-all-closed-orders?page=${currentPage?.value}`,
    )) as any;
    console.log("response closed order", response);
    if (response.status == 200) {
      orders.value = response.data?.orderResponse;
      totalPages.value = response.data?.totalPages;
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
