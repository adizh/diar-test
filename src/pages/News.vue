<template>
    <div class='section'>
<div class="mb-5">
    Новости
</div>

<Button type="button" label="Добавить новость" @click='isModalVisible=true'></Button>
    </div>



    <div class="card flex justify-content-center">
        <Dialog v-model:visible="isModalVisible" modal header="Создать новость" :style="{ width: '25rem' }">
            <!-- <span class="p-text-secondary block mb-5">{{ cancelHeader }}</span> -->


            <div class="flex flex-column gap-3 mb-5">
                <label for="name" class="font-semibold">Название</label>
                <InputText id="name" class="flex-auto" autocomplete="off" v-model.trim="newsName" />
            </div>
            <div class="flex flex-column gap-3 mb-5">
                <label for="info" class="font-semibold">Описание</label>
                <InputText id="info" class="flex-auto" autocomplete="off" v-model.trim="newsInfo" />
            </div>
            <div class="flex  align-items-center gap-3 mb-5">
                <label for="Weight" class="font-semibold">Фотография новости</label>
                <input type="file" @change="($event: any) => onUpload($event)" id="uploadImage" />
        
            </div>

            <Button type="button" label="Создать" @click='createNews'></Button>
        </Dialog>
    </div>
    <Toast/>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import {News} from '@/types/News'
import http from '@/http';
import { useToast } from 'primevue/usetoast';
const news=ref([] as News[])
const isModalVisible =ref(false)
const uploadFile = ref();
const newsName=ref('')
const newsInfo=ref('')
const toast=useToast()
const fetchNews=async()=>{
    try{
const response =await http('admin/get-all-news');
if(response.status===200){
    console.log('response get all news',response)
}
    }
    catch(err){
        console.log(err)
    }
}


const onUpload = async (event: any) => {
    uploadFile.value = event.target.files[0];
}
onMounted(() => {
    fetchNews()
})

const createNews =async()=>{
    if(newsName.value?.length && newsInfo.value?.length && uploadFile.value){
        try {
        const formData = new FormData();
        formData.append('file', uploadFile.value);
        formData.append('name', newsName.value);
        formData.append('description', newsInfo.value);
        const response = await http.post('admin/create-news', formData);
        console.log('response create news', response);
        if (response.status === 200) {
            toast.add({ severity: 'success', summary: 'Успешно', detail: 'Новость добавлена!' })
        }
    } catch (err) {
        console.log(err)
    }finally{
        isModalVisible.value=false
    }
    }else{
        toast.add({ severity: 'error', summary:'Ошибка', detail:'Заполните все поля!' });
    }
}
</script>

<style scoped>

</style>