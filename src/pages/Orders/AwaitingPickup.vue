<template>
  <div class="section">
    Доставки в ожидании на самовывоз

    <Button label="Создать заказ" @click="isOrderOpen = true" />

    <Card v-if="!store.getters.getAwaitingPickupOrders?.length">
      <template #content>Нет данных</template>
    </Card>


    <div v-else class="card-list">
      <Order v-for="order in store.getters.getAwaitingPickupOrders"
      :key="order?.orderNumber" :order="order" from="awaiting-pickup" />

    </div>
    <!-- <ul v-else class="card-list">
      <li
        v-for="order in store.getters.getAwaitingPickupOrders"
        :key="order?.orderNumber"
      >
        <Order :order="order" from="awaiting-pickup" />
      </li>
    </ul> -->
  </div>

  <Dialog
    v-model:visible="isOrderOpen"
    modal
    header="Создать заказ"
    :style="{ width: '25rem' }"
  >
    <OrdersCreate />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { onMounted } from "vue";
import Order from "@/components/Order.vue";
import OrdersCreate from "@/components/Orders/Create.vue";
import { useStore } from "vuex";
const noOrder = ref("");

const isOrderOpen = ref(false);
const store = useStore();

onMounted(() => {
  store.dispatch("fetchAwaitingPickup");
});
</script>

<style scoped></style>
