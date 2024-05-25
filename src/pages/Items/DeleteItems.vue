<template>
    <div class="section">

        <Card class='w-25rem'>
            <template #content>

                <div class="card flex align-items-center w-full">
                    <label for="category" class="font-semibold w-full">Выбрать категорию</label>
                    <Dropdown v-model="selectedCategory" :options="store.getters.categoriesName" optionLabel="name"
                        placeholder="Выбрать категорию" class="w-full md:w-14rem" id="category" />

                </div>
                <div class="flex justify-content-end mt-2" v-if="selectedCategory.name">
                    <Button @click="confirm2()" label="Удалить" severity="danger" outlined></Button>
                </div>
            </template>

        </Card>



        <Card class='w-25rem'>
            <template #content>
                <div class="card flex align-items-center w-full">
                    <label for="category" class="font-semibold w-full">Выбрать еду</label>
                    <Dropdown v-model="selectedFood" :options="store.getters.allFoodsNames" placeholder="Выбрать еду"
                        class="w-full md:w-14rem" id="category" />

                </div>
                <div class="flex justify-content-end mt-2" v-if="selectedFood">
                    <Button @click="confirmFood" label="Удалить" severity="danger" outlined></Button>
                </div>
            </template>

        </Card>

        <Toast />

        <Dialog v-model:visible="isFoodDeleteOpen" modal header="Удалить еду" :style="{ width: '25rem' }">
            <ConfirmButtons :descrText="`Вы действительно хотите удалить  + ${selectedFood}`"
            confirmText="Удалить" declineText='Отменить' @closeModal="isFoodDeleteOpen=false" @confirmAction="deleteFood"
            />
        </Dialog>

        <Dialog v-model:visible="isCategoryDeleteOpen" modal header="Удалить категорию" :style="{ width: '25rem' }">
            <ConfirmButtons :descrText="`Вы действительно хотите удалить  + ${selectedCategory?.name}`"
            confirmText="Удалить" declineText='Отменить' @closeModal="isCategoryDeleteOpen=false" @confirmAction="deleteCategory"
            />
        </Dialog>

 
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { Category } from '@/types/Category';
import http, { BaseUrl } from '@/http';
import axios from 'axios';
import ConfirmButtons from '@/components/UI/ConfirmButtons.vue';
const selectedCategory = ref({} as Category)
const store = useStore();
const confirm = useConfirm();
const toast = useToast();
const isFoodDeleteOpen=ref(false)
const isCategoryDeleteOpen=ref(false)


const selectedFood = ref('');

const deleteFood = async () => {
    try {
        const response = await http({
            method: 'delete',
            url: `admin/delete-food`,
            data: { name: selectedFood.value }
        });
        console.log('response', response);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Успешно', detail: 'Удалено', life: 3000 });
            isFoodDeleteOpen.value=false
        }
    } catch (err: any) {
        console.log(err);
        toast.add({ severity: 'error', summary: 'Ошибка при удалении', detail: err.response.statusText, life: 3000 });
    }
}
const confirmFood = () => {
    isFoodDeleteOpen.value=true;
}
const confirm2 = () => {
    isCategoryDeleteOpen.value=true
    // confirm.require({
    //     message: 'Вы действительно хотите удалить ' + selectedCategory.value.name,
    //     header: 'Danger Zone',
    //     icon: 'pi pi-info-circle',
    //     rejectLabel: 'Отмена',
    //     acceptLabel: 'Удалить',
    //     rejectClass: 'p-button-secondary p-button-outlined',
    //     acceptClass: 'p-button-danger',
    //     accept: () => {
    //         deleteCategory()
    //         //  toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });

    //     },
    //     reject: () => {
    //         toast.add({ severity: 'error', summary: 'Отклонено', detail: 'Вы отклонили', life: 3000 });
    //     }
    // });
};

const deleteCategory = async () => {
    try {
        const response = await http({
            method: 'delete',
            data: { name: selectedCategory.value.name },
            url: 'admin/delete-category'
        })
        if (response.status === 200) {
            toast.add({ severity: 'info', summary: 'Успешно', detail: 'Категория удалена' });
            isCategoryDeleteOpen.value=false
        }

    } catch (err: any) {
        console.log(err);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: err.response.statusText });
    }
}
onMounted(() => {
    store.dispatch('getAllCategoryNames')
})

</script>

<style scoped lang="scss">
@import '../../assets/mixins.scss';

.section {
    @include flex(row, space-around, start)
}
</style>