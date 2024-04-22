<template>
    <div>
        <Button label="Send order to kitchen" severity="info" @click="sendOrder" />
        <Button label="Send pick-up order to kitchen" severity="info" @click="sendPickup" />
    </div>



    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isModalVisible" modal :header="header" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">{{ header }}</span>


            <div class="flex flex-column gap-3 mb-5">
                <label for="email" class="font-semibold">Order number</label>
                <InputNumber id="email" class="flex-auto" autocomplete="off" v-model.trim="orderNumber" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click='isModalVisible = false'></Button>
                <Button type="button" label="Add" @click="submitOrder"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import http from '@/http';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const isModalVisible = ref(false);
const header = ref('')
const orderNumber = ref(0)

const sendOrder = () => {
    isModalVisible.value = true
    header.value = 'Send order'
}
const sendPickup = () => {
    isModalVisible.value = true
    header.value = 'Send pick-up order'
}
const toast = useToast()
const sendRequest = async (type: string) => {
    if (orderNumber.value) {
        try {
            const response = await http.post(`admin/${type}`, { orderNumber: orderNumber.value });
            console.log('response', response)
            if (response.status === 200) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully added the order' });
            }
        } catch (err: any) {
            console.log(err)
            toast.add({ severity: 'error', summary: 'Error adding the order', detail: err.response.data.message });
        } finally {
            isModalVisible.value = false;
            orderNumber.value = 0
        }
    }
}

const submitOrder = () => {
    if (header.value === 'Send order') {
        sendRequest('send-to-kitchen')
    } else {
        sendRequest('send-to-kitchen-pickup-order')
    }
}

</script>

<style scoped></style>