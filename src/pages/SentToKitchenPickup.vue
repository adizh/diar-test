<template>
  <div class="section">
    <div class="mb-5">
    <div class="flex justify-content-between">
      <p>Доставки на кухне (самовывоз)</p>
      <PhoneCodeFilters @handle-order-number="handleOrderNumber" @handle-phone="handlePhone" @change-option="changeOption"/>
    </div>
      <div
        class="card-list"
        v-if="store.getters.getCookedPickupOrders?.length > 0"
      >
        <Order
          v-for="order in store.getters.getCookedPickupOrders"
          :key="order?.orderNumber"
          :order="order"
          from="kitchen-pickup"
        />
      </div>

      <Card v-else>
        <template #content>Нет данных</template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "vuex";
import Order from "@/components/Order.vue";
import PhoneCodeFilters from "@/components/UI/PhoneCodeFilters.vue";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchCookedPickUp");
});



const normalizePhone = (phone: string) => {
  return phone.replace(/[^\d]/g, "");
};


const handlePhone = (event: string) => {  
  const normalizedInput = normalizePhone(event);
  store.dispatch('filterKitchkenPickup',{filterType:'phone',value:normalizedInput})

};

const handleOrderNumber = (event: any) => {
  store.dispatch('filterKitchkenPickup',{filterType:'orderNumber',value:String(event.value)})
};
const changeOption = () => {
  store.dispatch('filterKitchkenPickup',{filterType:'',value:''})


};







</script>

<style scoped></style>
