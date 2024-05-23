<template>
    <div class="section">
        <div class="mb-5">
            <p>Заказы на кухне (самовывоз)</p>
        <div class="card-list">
            <Order v-for="order in store.getters.getCookedPickupOrders" :key="order?.orderNumber" :order="order" from="kitchen-pickup"/>
        </div>
        
        </div>
            </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import Order from '@/components/Order.vue';

const store=useStore()


onMounted(()=>{
    store.dispatch('fetchCookedPickUp')
});


</script>

<style scoped>

</style>