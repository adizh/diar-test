<template>
  <div class="section">
    <div class="flex justify-content-between">
      <p class="mb-3">Отмененные доставки самовывоз</p>

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
        from="cancelled-pickup"
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
type QueryType ={
  orderNumber?:string,
  phone?:string,
  page:number
}
const orderNumber=ref('');
const phone=ref('');

const orders = ref<AwaitingOrder[]>([]);
const filteredOrders = ref<AwaitingOrder[]>([]);
const currentPage = ref(1);
const totalItems = ref(1);

const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchOrders();
  window.scrollTo(0, 0);
};
const fetchOrders = async () => {
  try {
    let queries:QueryType={
      page:currentPage.value
    }

    if(orderNumber?.value){
      queries.orderNumber=orderNumber.value
    }
    if(phone?.value){
      queries.phone=phone.value
    }

    const response = await http({
      method:'get',
      params:queries,
      url:`admin/get-all-cancel-pickup-orders`
    })

    console.log("response cancelled pickup", response);

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
  phone.value = `+996 ${event}`;
  fetchOrders()
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);
  console.log('value',value)
  orderNumber.value = value;
  fetchOrders()
};

const changeOption = () => {
  orders.value = filteredOrders?.value;
  orderNumber.value=''
  phone.value=''
  fetchOrders()
};
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped></style>
