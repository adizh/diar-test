vbas3
<template>
  <div class="section">
    Переданные курьеру
    <Card v-if="!orders?.length">
      <template #content>Нет данных</template>
    </Card>

    <div v-else class="card-list">
      <Order v-for="order in orders" :key="order?.orderNumber" :order="order" type="delegated" from="delegated" />
    </div>

    <!-- <ul v-else class="card-list">
      <li v-for="order in orders" :key="order?.orderNumber" class="card-list">
        <Order :order="order" type="delegated" from="delegated" />
      </li>
    </ul> -->
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

const fetchOrders = async () => {
  try {
    const response = (await http.get("admin/get-all-delegated-orders")) as any;
    console.log("response", response);
    if (response.status === 204) {
      noOrder.value = response.statusText;
    } else if (response.status == 200) {
      orders.value = response.data.orders;
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
