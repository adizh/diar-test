<template>
    <div class='sidebar'>
        <PanelMenu :model="items" />
    </div>
    <div class="sidebar-left">
        <router-view></router-view>
    </div>

    <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PanelMenu from 'primevue/panelmenu';
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from 'vue-router';
const isSignOutOpen=ref(false)
const confirm = useConfirm();

const confirmLogout=()=>{
    localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('role');

              //  window.location.reload()
}

const openSignOutModal=()=>{
   // isSignOutOpen.value=true
   confirm.require({
        message: 'Вы действительно хотите выйти?',
        header: 'Выход',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Отмена',
        acceptLabel: 'Выход',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            confirmLogout()
          //  toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
          //  toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}
const router = useRouter()
const items = ref([
    {
        label: 'Заказы',

        items: [
            {
                label: 'Заказы в ожидании',

                command: () => {
                    router.push('/awaiting-orders')
                    // toast.add({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
                }
            },
            {
                label: 'Заказы(самовывоз) в ожидании',
                //   icon: 'pi pi-search',
                command: () => {
                    router.push('/awaiting-orders-pickup')
                    //  toast.add({ severity: 'warn', summary: 'Search Results', detail: 'No results found', life: 3000 });
                }
            },
            {
                label: 'Заказы на кухне',
                command: () => {
                    router.push('/sent-to-kitchen')
                    // toast.add({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
                }
            },
            {
                label: 'Заказы на кухне (самовывоз)',
                command: () => {
                    router.push('/sent-to-kitchen-pickup')
                    // toast.add({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
                }
            },
            {
                label: 'Отмененные',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/cancelled-orders')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },
            {
                label: 'Отмененные (самовывоз)',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/cancelled-orders-pickup')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },
            {
                label: 'Закрытые заказы',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/closed-orders')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },
            {
                label: 'Закрытые заказы(самовывоз)',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/closed-orders-pickup')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },
           
           

            {
                label: 'Делегированные заказы',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/delegated-orders')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            }

        ]
    },
    {
        label: 'Курьеры',

        items: [
            {
                label: 'Курьеры',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/all-couriers')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },

        ]
    },
    {
        label: 'Новости',

        items: [
            {
                label: 'Новости',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/news')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },

        ]
    },
    {
        label: 'Распродажа',

        items: [
            {
                label: 'Распродажи',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/sales')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },

        ]
    },
    {
        label: 'Добавить',
        icon: 'pi pi-plus',
        items: [
            {
                label: 'Добавить',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/add-items')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },
        ]
    },
    {
        label: 'Обновить',
      //  icon: 'pi pi-plus',
        items: [
            {
                label: 'Обновить',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/update-items')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },


        ]
    },

    {
        label: 'Удалить',
        icon: 'pi pi-trash',
        items: [
            {
                label: 'Удалить',
                //   icon: 'pi pi-print',
                command: () => {
                    router.push('/delete-items')
                    // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                }
            },

        ]
    },
    {
        label: 'Выйти из аккаунта',
        icon: 'pi pi-sign-out',
        command: () => {
            openSignOutModal()
           //  toast.add({ severity: 'info', summary: 'Signed out', detail: 'User logged out', life: 3000 });
        }
    }
]);
</script>

<style scoped lang=scss>
.sidebar-left {
    margin-left: 320px;
}

.sidebar {
    width: 300px;
    height: 100%;
    padding-right: 14px !important;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    padding: 3rem 0 2rem 1rem;
    border: 1px solid #999;
    border-radius: 5px;
    background: rgb(246, 246, 246);

}
</style>
