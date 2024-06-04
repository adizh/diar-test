<template>
    <div>
        <!-- <Button label="Отправить заказ на кухню" severity="info" @click="sendOrder" />
        <Button label="Отправить заказ(самовывоз) на кухню" severity="info" @click="sendPickup" /> -->
    </div>



    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isModalVisible" modal :header="header" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">{{ header }}</span>


            <div class="flex flex-column gap-3 mb-5">
                <label for="email" class="font-semibold">Номер заказа</label>
                <InputNumber id="email" class="flex-auto" autocomplete="off" v-model.trim="orderNumber" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Отменить" severity="secondary" @click='isModalVisible = false'></Button>
                <Button type="button" label="Добавить" ></Button>
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
    header.value = 'Отравить заказ'
}
const sendPickup = () => {
    isModalVisible.value = true
    header.value = 'Отправить заказ(самовывоз)'
}
const toast = useToast()
const sendRequest = async (type: string) => {
    if (orderNumber.value) {
        try {
            const response = await http.post(`admin/${type}`, { orderNumber: orderNumber.value });
            console.log('response', response)
            if (response.status === 200) {
                toast.add({ severity: 'success', summary: 'Успешно', detail: 'Заказ отправлен' });
            }
        } catch (err: any) {
            console.log(err)
            toast.add({ severity: 'error', summary: 'Ошибка при отправлении заказа', detail: err.response.data.message });
        } finally {
            isModalVisible.value = false;
            orderNumber.value = 0
        }
    }
}


</script>

<style scoped></style>