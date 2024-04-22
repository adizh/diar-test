<template>
    <div class="section">
        Awaiting orders
        <Button label="Create order" @click="openCreateOrderModal" />
        <Card v-if="noOrder?.length">
            <template #content>{{
            noOrder }}</template>
        </Card>
        <ul v-else class="card-list">
            <li v-for="order in awaitingOrders" :key="order?.orderNumber">
                <Order :order="order" />
            </li>
        </ul>

    </div>


    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isCreateModal" modal header="Create order" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Creare order</span>
            <div class="flex flex-column gap-3 mb-5">

                <label for="address" class="font-semibold">Address</label>
                <InputText id="address" class="flex-auto" autocomplete="off" v-model.trim="orderValues.address" />
            </div>

            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">Comment</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.comment" />
            </div>

            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">dishesCount</label>
                <InputNumber id="comment" class="flex-auto" autocomplete="off" v-model="orderValues.dishesCount" />
            </div>

            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">entrance</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.entrance" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">floor</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.floor" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">foods</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.foods" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">houseNumber</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.houseNumber" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">intercom</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.intercom" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">kvOffice</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.kvOffice" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">paymentMethod</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.paymentMethod" />
            </div>

            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">price</label>
                <InputNumber id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.price" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">userName</label>
                <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.userName" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="comment" class="font-semibold">userPhone</label>
                <!-- <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.userPhone" /> -->

                <InputMask id="phone" v-model.trim="orderValues.userPhone" mask="+996 (999) 99-99-99"
                    placeholder="+996 (700) 11-11-11" />

            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click='isCreateModal = false'></Button>
                <Button type="button" label="Add" @click='createOrder'></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import http from '@/http';
import { AwaitingOrder } from '@/types/Order'
import { onMounted } from 'vue';
import Order from '@/components/Order.vue';
const noOrder = ref('');
const awaitingOrders = ref<AwaitingOrder[]>([])
const isCreateModal = ref(false)

const orderValues = ref({
    address: ref(''),
    comment: ref(''),
    dishesCount: ref(0),
    entrance: ref(''),
    floor: ref(''),
    foods: ref(''),
    houseNumber: ref(''),
    intercom: ref(''),
    kvOffice: ref(''),
    paymentMethod: ref(''),
    price: ref(0),
    userName: ref(''),
    userPhone: ref('')
})


const openCreateOrderModal = () => {
    isCreateModal.value = true
}
const fetchAwaitingOrders = async () => {
    try {
        const response = await http.get('admin/get-all-awaiting-orders') as any;
        console.log('response', response)

        if (response.status === 204) {
            console.log('response status is 204')
            noOrder.value = response.statusText;
            console.log('no order', noOrder)
        } else if (response.status == 200) {
            awaitingOrders.value = response.data.orders
        }

    } catch (err) {
        console.log(err)
    }
}


const createOrder = async () => {
    const body = {
        "address": orderValues.value.address,
        "comment": orderValues.value.comment,
        "dishesCount": orderValues.value.dishesCount,
        "entrance": orderValues.value.entrance,
        "floor": orderValues.value.floor,
        "foods": orderValues.value.foods,
        "houseNumber": orderValues.value.houseNumber,
        "intercom": orderValues.value.intercom,
        "kvOffice": orderValues.value.kvOffice,
        "paymentMethod": orderValues.value.paymentMethod,
        "price": orderValues.value.price,
        "userName": orderValues.value.userName,
        "userPhone": orderValues.value.userPhone
    }

    if (Object.values(orderValues.value).every((value) => value))
        try {
            const response = await http.post('orders/create-order',
                body
            )
            console.log('response create order', response);
            if (response.status === 200) {
                isCreateModal.value = false
            }
        } catch (err) {
            console.log(err)
        }
}



onMounted(() => {
    fetchAwaitingOrders();

})



</script>

<style scoped></style>
