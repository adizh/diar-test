<template>
    <div class="section">
        <div class="section-header">Добавить</div>
        <div class="add-items-block">
            <Button label="Добавить категорию" @click='openCategoryModal' />
            <Button label="Добавить контейнер" @click='openContainerModal' />
            <Button label="Добавить еду" @click="openFood" />
            <AddFoodsOrder />
            <SendToKitchen />
        </div>
    </div>


    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isModalVisible" modal header="Добавить категорию" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Добавить категорию</span>

            <div class="flex flex-column gap-3 mb-5">
                <label for="email" class="font-semibold">Название категории</label>
                <InputText id="email" class="flex-auto" autocomplete="off" v-model.trim="categoryName" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Отменить" severity="secondary" @click='isModalVisible = false'></Button>
                <Button type="button" label="Добавить" @click='addNewCategory'></Button>
            </div>
        </Dialog>
    </div>
    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isModalContainer" modal header="Добавить контейнер" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Добавить контейнер</span>

            <div class="flex flex-column gap-3 mb-5">
                <label for="email" class="font-semibold">Название контейнера</label>
                <InputText id="email" class="flex-auto" autocomplete="off" v-model.trim="containerName" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="price" class="font-semibold">Цена</label>
                <InputNumber id="price" class="flex-auto" autocomplete="off" v-model="containerPrice" />
            </div>

            <div class="flex flex-column gap-3 mb-5">
                <label for="idt" class="font-semibold">iDCTMax</label>
                <InputNumber id="idt" class="flex-auto" autocomplete="off" v-model="containeriDCTMax" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Отменить" severity="secondary" @click='isModalContainer = false'></Button>
                <Button type="button" label="Добавить" @click='addContainer'></Button>
            </div>
        </Dialog>
    </div>


    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isModalVisibleFood" modal header="Добавить еду" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Добавить еду</span>
            <div class="flex  align-items-center gap-3 mb-5">
                <label for="name" class="font-semibold">Название еды</label>
                <InputText id="name" class="flex-auto" autocomplete="off" v-model.trim="foodName" />
            </div>

            <div class="card flex gap-3 mb-5 align-items-center">
                <label for="category" class="font-semibold w-full">Название категории</label>
                <Dropdown v-model="selectedCategory" :options="store.getters.categoriesName" optionLabel="name"
                    placeholder="Выбрать категорию" class="w-full md:w-14rem" id="category" />
            </div>


            <div class="card flex gap-3 mb-5 align-items-center">
                <label for="category" class="font-semibold w-full">Название контейнера</label>
                <Dropdown v-model="selectedContainerName" :options="store.getters.allContainers" optionLabel="name"
                    placeholder="Выбрать контейнер" class="w-full md:w-14rem" id="category" />
            </div>

            <div class="flex  align-items-center gap-3 mb-5">
                <label for="iDCTMax" class="font-semibold">iDCTMax</label>
                <InputText id="iDCTMax" class="flex-auto" autocomplete="off" v-model="foodiDCTMax" />
            </div>
            <div class="flex  align-items-center gap-3 mb-5">
                <label for="containerCount" class="font-semibold">Кол-во контейнеров</label>
                <InputText id="containerCount" class="flex-auto" autocomplete="off" v-model="foodContainerCount" />
            </div>
            <div class="flex  align-items-center gap-3 mb-5">
                <label for="price" class="font-semibold">Цена</label>
                <InputText id="price" class="flex-auto" autocomplete="off" v-model.trim="foodPrice" />
            </div>


            <div class="flex  align-items-center gap-3 mb-5">
                <label for="Weight" class="font-semibold">Вес</label>
                <InputText id="Weight" class="flex-auto" autocomplete="off" v-model.trim="foodWeight" />
            </div>



            <div class="flex  align-items-center gap-3 mb-5">
                <label for="Weight" class="font-semibold">Файл</label>
                <input type="file" @change="($event: any) => onUpload($event)" id="uploadImage" />
                <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000"
                    @select="($event: any) => onUpload($event)" /> -->

            </div>


            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Отменить" severity="secondary" @click='isModalVisibleFood = false'></Button>
                <Button type="button" label="Добавить еду" @click='addFood'></Button>
            </div>

        </Dialog>
    </div>
    <Toast />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import http from '@/http';
import { onMounted, ref } from 'vue';
import { Category } from '@/types/Category';
import AddFoodsOrder from '@/components/AddFoodsOrder.vue'
import SendToKitchen from '@/components/SendToKitchen.vue'
const isModalVisible = ref(false)
const isModalVisibleFood = ref(false)
const isModalContainer = ref(false)
const categoryName = ref('')
const selectedCategory = ref<{ name: string }>({} as { name: string });
const selectedContainerName = ref<{ name: string }>({} as { name: string });
const foodPrice = ref('')
const foodWeight = ref('')
const foodiDCTMax = ref('')
const foodContainerCount = ref('')
const foodName = ref('')
const containerName = ref('')
const uploadFile = ref()
const containerPrice = ref(0)
const containeriDCTMax = ref(0)

import { useStore } from 'vuex';
const store = useStore()
const toast = useToast();


const openCategoryModal = () => {
    isModalVisible.value = true;

}
const openFood = () => {
    isModalVisibleFood.value = true;
}

const openContainerModal = () => {
    isModalContainer.value = true
}

const addNewCategory = async () => {
    console.log('addnew category', categoryName)
    if (categoryName.value?.length > 0) {
        try {

            const response = await http.post('admin/add-category', { name: categoryName.value });
            console.log('response addNewCategory', response);
            if (response.status === 200) {
                toast.add({ severity: 'success', summary: 'Успешно добавлен', detail:'Добавить категорию', life: 3000 });
            }

        } catch (err) {
            console.log(err);
            toast.add({ detail: 'Ошибка', severity: 'error' })
        } finally {
            isModalVisible.value = false
        }
    }
}
const addContainer = async () => {
    if (containerName.value?.length > 0) {
        try {
            const response = await http.post('admin/create-container', {
                name: containerName.value,
                iDCTMax: containeriDCTMax.value,
                price: containerPrice.value
            });
            console.log('response addNewCategory', response);
            if (response.status === 200) {
                toast.add({ severity: 'success', summary: 'Успешно добавлен', detail: 'Добавить контейнер', life: 3000 });
            }

        } catch (err) {
            console.log(err);
            toast.add({ detail: 'Ошибка', severity: 'error' })
        } finally {
            isModalVisible.value = false
        }
    }
}

const onUpload = async (event: any) => {
    console.log('event onUpload', event)
    uploadFile.value = event.target.files[0];

    // console.log('fd', fd);
    // const response = await http.post('admin/add-food', {
    //     name: 'test',
    //     categoryName: 'TEST',
    //     price: 43,
    //     weight: 23,
    //     file: fd
    // });
    // console.log('response onUpload', response)
}

const addFood = async () => {
    //const uploadImage = document.getElementById('uploadImage');
    // let formData = new FormData(uploadFile.value);
    // formData.append('file', uploadImage)
    // if (foodName.value?.length > 0 && foodPrice.value?.length > 0 && selectedCategory.value?.length > 0 && foodWeight.value?.length && uploadFile.value) {
    try {
        const formData = new FormData();
        // Append the file to the FormData object
        formData.append('file', uploadFile.value);

        // Additional data fields
        formData.append('name', foodName.value);
        formData.append('categoryName', selectedCategory.value.name);
        formData.append('price', foodPrice.value);
        formData.append('weight', foodWeight.value);
        formData.append('iDCTMax', foodiDCTMax.value);
        formData.append('containerName', selectedContainerName.value.name);
        formData.append('containerCount', foodContainerCount.value);
        // const body = {
        //     name: foodName.value,
        //     categoryName: selectedCategory.value?.name,
        //     price: foodPrice.value,
        //     weight: foodWeight.value,
        //     file: formData
        // }
        //  console.log('body', body);

        const response = await http.post('admin/add-food', formData);
        console.log('response', response);
        if (response.status === 200) {
            toast.add({ severity: 'success', summary: 'Успешно', detail: 'Еда добавлена!' })
        }
    } catch (err) {
        console.log(err)
    }

}


onMounted(() => {
    store.dispatch('getAllCategoryNames')
    store.dispatch('fetchAllContainers')
})









</script>

<style scoped lang="scss">
input {
    width: 100% !important;
    max-width: 100% !important
}
</style>