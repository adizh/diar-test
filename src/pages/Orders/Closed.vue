vbas3
<template>
  <div class="section">
    <div class="flex justify-content-between">
      <p class="mb-3">Доставленные</p>
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
        from="closed"
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

const noOrder = ref("");
const orders = ref<AwaitingOrder[]>([]);
const filteredOrders = ref<AwaitingOrder[]>([]);

const totalPages = ref(0);
const totalItems = ref(0);
const currentPage = ref(1);
const orderNumber=ref('')
const phone=ref('')

const changePage = (event: { page: number }) => {
  currentPage.value = event?.page + 1;
  fetchOrders();
  window.scrollTo(0, 0);
};
type Params={
  orderNumber?:string,
  page:number,
  phone?:string

}
const fetchOrders = async () => {
  try {


let params:Params={
        page:currentPage?.value
}
if(orderNumber?.value){
  params.orderNumber=orderNumber?.value
}
if( phone?.value){
  params.phone=phone?.value
}
  const response = await http({
      method:'get',
      url:"admin/get-all-closed-orders",
      params:params
    })
    
    console.log("response closed order", response);
    if (response.status == 200) {
      orders.value = response.data?.orderResponse;
      filteredOrders.value = response.data?.orderResponse;
      totalPages.value = response.data?.totalPages;
      totalItems.value = response.data?.totalItems;
    }
  } catch (err) {
    console.log(err);
  }
};

const normalizePhone = (phone: string) => {
  return phone.replace(/[^\d]/g, "");
};

const handlePhone = (event: string) => {
//+996 (999) 98-85-37
  phone.value =`+996 ${event}`
  console.log('handle hpeoin event',event)
  console.log('handle hpeoin phone',phone)
  fetchOrders()
  // const normalizedInput = normalizePhone(event);
  // const results = filteredOrders?.value?.filter((item) => {
  //   const normalizedUserPhone = normalizePhone(item?.userPhone);
  //   return normalizedUserPhone.includes(normalizedInput);
  // });

  // if (event?.length > 0) {
  //   orders.value = results;
  // } else {
  //   orders.value = filteredOrders?.value;
  // }
};

const handleOrderNumber = (event: any) => {
  const value = String(event?.value);
  orderNumber.value = value;
  fetchOrders()
  console.log(' handleOrderNumber,value',value)

};
const changeOption = () => {
  orders.value = filteredOrders?.value;
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped></style>
