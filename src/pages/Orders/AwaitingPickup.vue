<template>
  <div class="section">
    <div class="mb-3 filter-header">
      <div class="flex flex-column gap-3 align-items-start">
        Доставки в ожидании на самовывоз
        <Button label="Создать заказ" @click="isOrderOpen = true" />
      </div>
      <div>
        <PhoneCodeFilters
          @handlePhone="handlePhone"
          @handleOrderNumber="handleOrderNumber"
          @changeOption="changeOption"
        />
      </div>
    </div>
    <Card v-if="!store.getters.getAwaitingPickupOrders">

      <template #content>Нет данных</template>
    </Card>

    <div v-else class="card-list">
      <Order
        v-for="order in store.getters.getAwaitingPickupOrders"
        :key="order?.orderNumber"
        :order="order"
        from="awaiting-pickup"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="isOrderOpen"
    modal
    header="Создать заказ"
    :style="{ width: '35rem' }"
  >
    <OrdersCreate />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";
import { onMounted } from "vue";
import Order from "@/components/Order.vue";
import OrdersCreate from "@/components/Orders/Create.vue";
import { useStore } from "vuex";
const noOrder = ref("");
const isOrderOpen = ref(false);
let intervalId: any = null;
const store = useStore();

const handlePhone = (event: string) => {
  store.dispatch("filterAwaitingPickupOrderPhone", event);
};

const handleOrderNumber = (event: any) => {
  store.dispatch("filterAwaitingPickupOrderNumber", event?.value);
};

const changeOption = () => {
  store.dispatch("resetAwaitingPickup");
};

onMounted(() => {
  store.dispatch("fetchAwaitingPickup");
});

intervalId = setInterval(() => {
 store.dispatch("fetchAwaitingPickup");
}, 5000);

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped></style>
