<template>
    <div>
        <Button label="Add food for order" @click="addFoodForOrder" />

        <Button label="Add food for pick-up orders" @click="addFoodForOrderPickup" />

        <Button label="Cancel order" @click="openCancelOrder" severity="warning" />

        <Button label="Cancel pick-up order" @click="openCancelOrderPickup" severity="warning" />


        <div class="card flex justify-content-center">
            <Dialog v-model:visible="isModalVisible" modal :header="header" :style="{ width: '25rem' }">
                <span class="p-text-secondary block mb-5">{{ header }}</span>

                <div class="flex flex-column gap-3 mb-5">
                    <label for="email" class="font-semibold">Food name</label>
                    <Dropdown v-model="selectedFoodName" :options="store.getters.allFoodsNames"
                        placeholder="Select a food" class="w-full md:w-14rem" id="category" />
                    <!-- <InputText id="email" class="flex-auto" autocomplete="off" v-model.trim="name" /> -->
                </div>

                <div class="flex flex-column gap-3 mb-5">
                    <label for="email" class="font-semibold">Order number </label>
                    <InputNumber id="email" class="flex-auto" autocomplete="off" v-model.trim="orderNumber" />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click='isModalVisible = false'></Button>
                    <Button type="button" label="Add" @click="submitFoodOrder"></Button>
                </div>
            </Dialog>
        </div>



        <div class="card flex justify-content-center">
            <Dialog v-model:visible="isModalVisibleCancel" modal :header="cancelHeader" :style="{ width: '25rem' }">
                <span class="p-text-secondary block mb-5">{{ cancelHeader }}</span>


                <div class="flex flex-column gap-3 mb-5">
                    <label for="email" class="font-semibold">Order number</label>
                    <InputNumber id="email" class="flex-auto" autocomplete="off" v-model.trim="orderNumberCancel" />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary"
                        @click='isModalVisibleCancel = false'></Button>
                    <Button type="button" label="Add" @click="addOrderCancel"></Button>
                </div>
            </Dialog>
        </div>
    </div>



    <Toast />

</template>

<script setup lang="ts">
import http from '@/http';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex'
const isModalVisible = ref(false)
const isModalVisibleCancel = ref(false)
const header = ref('')
const cancelHeader = ref('')
const selectedFoodName = ref('')
const name = ref('')
const orderNumber = ref(0)
const orderNumberCancel = ref(0)
const store = useStore()
const toast = useToast();

const sendReqFoorOrder = async (type: string) => {
    if (name.value?.length > 0 && orderNumber.value) {
        try {
            const body = {
                "newFoods": name.value,
                "orderNumber": orderNumber.value
            }
            const response = await http.post(`admin/${type}`, body);
            console.log('response add food for order', response)
        } catch (err: any) {
            console.log(err)
            toast.add({ severity: 'error', summary: 'Error adding the food', detail: err.response.data.message });


        } finally {
            isModalVisible.value = false;
            name.value = ''
            orderNumber.value = 0
        }
    }
}

const addFoodForOrder = async () => {
    isModalVisible.value = true;
    header.value = 'Add food for order';
    // sendReqFoorOrder('add-food-for-order')
}

const addFoodForOrderPickup = async () => {
    isModalVisible.value = true
    header.value = 'Add food for pick-up order';
    // sendReqFoorOrder('add-food-for-pickup-order')
}

const submitFoodOrder = () => {
    if (header.value === 'Add food for order') {
        sendReqFoorOrder('add-food-for-order')
    } else {
        sendReqFoorOrder('add-food-for-pickup-order')
    }
}


const openCancelOrder = () => {
    isModalVisibleCancel.value = true
    cancelHeader.value = 'Cancel order'
}

const openCancelOrderPickup = () => {
    isModalVisibleCancel.value = true
    cancelHeader.value = 'Cancel order pick-up'
}

const addOrderCancel = () => {
    if (cancelHeader.value === 'Cancel order') {
        cancelOrderSubmit('cancel-order')
    } else {
        cancelOrderSubmit('cancel-pickup-order')
    }
}
const cancelOrderSubmit = async (type: string) => {
    if (orderNumberCancel.value) {
        try {
            const response = await http.post(`admin/${type}`, { orderNumber: orderNumberCancel.value });
            console.log('response', response)
            if (response.status === 200) {
                toast.add({ severity: 'success', summary: 'Successfully cancelled', detail: response.data.message });

            }
        } catch (err: any) {
            console.log(err);
            toast.add({ severity: 'error', summary: 'Error adding the food', detail: err.response.data.message });
        } finally {
            isModalVisibleCancel.value = false
            orderNumberCancel.value = 0
        }
    }
}

onMounted(() => {
    console.log('allFoodsNames', store)
})
</script>

<style scoped></style>