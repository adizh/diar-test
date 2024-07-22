<template>
  <div class="section">
    <div class="mb-5 filter-header">



        <p>Все заказы в ожидании</p>
        <div>
        <PhoneCodeFilters
                @handlePhone="handlePhone"
                @handleOrderNumber="handleOrderNumber"
                @changeOption="changeOption"
              />
          

      </div>
    </div>

  <main class="flex gap-2">

    <div class="flex flex-wrap">
        <Card v-if="!awaitingOrders?.length">
          <template #content>Нет данных</template>
        </Card>
  
        <div  v-else>
            <div class="flex gap-1 align-items-center mb-3">Заказы в ожидании 

<Badge :value="awaitingOrders?.length" severity="danger"></Badge>

            </div>
          <Order
            v-for="order in awaitingOrders"
            :key="order?.orderNumber"
            :order="order"
            from="awaiting"
          />
        </div>
      </div>
  
      <Divider layout="vertical" />
  
      <div class="flex flex-wrap">
        <Card v-if="!store.getters.getAwaitingPickupOrders.length">
          <template #content>Нет данных</template>
        </Card>
  
        <div v-else>
            <div class="flex gap-1 align-items-center mb-3">Заказы в ожидании (самовывоз)
                <Badge :value="store.getters.getAwaitingPickupOrders.length" severity="danger"></Badge>
            </div>
          <Order
          v-for="order in store.getters.getAwaitingPickupOrders"
            :key="order?.orderNumber"
            :order="order"
            from="awaiting-pickup"
          />
        </div>
      </div>
  </main>
  </div>
</template>

<script setup lang="ts">
import Order from "@/components/Order.vue";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";
import http from "@/http";
import { AwaitingOrder } from "@/types/Order";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
const awaitingOrders = ref<AwaitingOrder[]>([]);
const filterOrders = ref<AwaitingOrder[]>([]);
const store=useStore()
const noOrder = ref("");
const fetchAwaitingOrders = async () => {
  try {
    const response = (await http.get("admin/get-all-awaiting-orders")) as any;
    console.log("response", response);
    if (response.status === 204) {
      noOrder.value = response.statusText;
    } else if (response.status == 200) {
      awaitingOrders.value = response.data.orders;
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
    store.dispatch("filterAwaitingPickupOrderPhone", event);
  const normalizedInput = normalizePhone(event);
  const results = filterOrders?.value?.filter((item) => {
    const normalizedUserPhone = normalizePhone(item?.userPhone);
    return normalizedUserPhone.includes(normalizedInput);
  });

  if (event?.length > 0) {
    awaitingOrders.value = results;


  } else {
    awaitingOrders.value = filterOrders?.value;
  }
};

const changeOption = () => {
  awaitingOrders.value = filterOrders?.value;
  store.dispatch("resetAwaitingPickup");
};
const handleOrderNumber = (event: any) => {
    const value = String(event?.value);
  store.dispatch("filterAwaitingPickupOrderNumber", event?.value);

  const results = filterOrders?.value?.filter((item) =>
    String(item?.orderNumber)?.includes(value),
  );

  if (value && value?.length > 0) {
    awaitingOrders.value = results;
  }
  if (value === "null") {
    awaitingOrders.value = filterOrders.value;
  }
};
onMounted(() => {
  fetchAwaitingOrders();
  store.dispatch("fetchAwaitingPickup");
});
</script>

<style scoped></style>
