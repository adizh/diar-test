<template>
    <div class="section">
        <Button label="Update food" severity="secondary" rounded @click="isModalVisibleFood = !isModalVisibleFood" />
    </div>


    <div class="card flex justify-content-center ">
        <Dialog v-model:visible="isModalVisibleFood" modal header="Update food" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Update food</span>
            <div class="flex gap-3 mb-5 flex-column">
                <label for="name" class="font-semibold">New food name</label>
                <InputText id="name" class="flex-auto" autocomplete="off" v-model.trim="newFoodName" />
            </div>

            <div class="card flex gap-3 mb-5  flex-column">
                <label for="category" class="font-semibold w-full">Old food name name</label>
                <!-- <Dropdown v-model="allFoodName" :options="store.getters.categoriesName" optionLabel="name"
                    placeholder="Select a category" class="w-full md:w-14rem" id="category" /> -->
            </div>


            <div class="flex   gap-3 mb-5 flex-column">
                <label for="price" class="font-semibold">New Price</label>
                <InputText id="price" class="flex-auto" autocomplete="off" v-model.trim="foodPrice" />
            </div>


            <div class="flex  gap-3 mb-5 flex-column">
                <label for="Weight" class="font-semibold">New Weight</label>
                <InputText id="Weight" class="flex-auto" autocomplete="off" v-model.trim="foodWeight" />
            </div>




            <div class="flex justify-content-end gap-2">
                <!-- <Button type="button" label="Cancel" severity="secondary" @click='isModalVisibleFood = false'></Button>
                <Button type="button" label="Update" @click='updar'></Button> -->
            </div>

        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isModalVisibleFood = ref(false);
const allFoodName = ref('');
const newFoodName = ref('');
const foodPrice = ref('');
const foodWeight = ref('');
</script>

<style scoped></style>