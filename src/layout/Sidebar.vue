<template>
  <div class="sidebar">
    <PanelMenu :model="items" >
       <template #item="{ item }">
        <a v-ripple class="flex align-items-center px-3 py-2 cursor-pointer" @click="selecteRoute(item)"
        :class="{'active-route-item':selectedRoute === item?.label}"

        >
            <span :class="['ml-2','font-semibold' ]" >{{ item.label }}

              <Badge
              :value="`(${stopListCount})`"
              severity="danger"
              v-if="item?.label === 'СТОП-ЛИСТ'"
            ></Badge>
            </span>
        </a>
    </template>
    </PanelMenu>

  </div>

  <div class="card headerItems">
    <div class="main-items">
      <div class="each-link-menu" @click="(event) => toggle(event)">
        В ожидании <Badge :value="totalAwaitingCount" severity="danger"></Badge>
      </div>

      <div class="each-link-menu" @click="(event) => toggleKitchen(event)">
        На кухне <Badge :value="totalKitchenCount" severity="info"></Badge>
      </div>

      <div class="each-link-menu" @click="router.push('/delegated-orders')">
        Переданные курьеру
      </div>

      <div class="each-link-menu" @click="(event) => toggleClosed(event)">
        Доставленные
      </div>

      <div class="each-link-menu" @click="(event) => toggleСancel(event)">
        Отмененные
      </div>
    </div>

    <OverlayPanel ref="countOverlay" class="countOverlay">
      <div
        class="subitem-link"
        v-for="item in headerItems[0]?.items"
        :key="item?.count"
        @click="item?.command"
      >
        {{ item?.label }}
        <Badge
          :value="store.getters.stats.awatingOrdersCount"
          severity="danger"
          v-if="item?.label === 'Доставки'"
        ></Badge>

        <Badge
          :value="store.getters.stats.awatingOrdersPickupCount"
          severity="danger"
          v-if="item?.label === 'Самовывоз'"
        ></Badge>
      </div>
    </OverlayPanel>

    <OverlayPanel ref="countOverlayKitchen" class="countOverlay">
      <div
        class="subitem-link"
        v-for="item in headerItems[1]?.items"
        :key="item?.count"
        @click="item?.command"
      >
        {{ item?.label }}

        <Badge
          :value="store.getters.stats.kitchenOrdersCount"
          severity="info"
          v-if="item?.label === 'Доставки'"
        ></Badge>
        <Badge
          :value="store.getters.stats.kitchenOrdersPickupCount"
          severity="info"
          v-if="item?.label === 'Самовывоз'"
        ></Badge>
      </div>
    </OverlayPanel>

    <OverlayPanel ref="countOverlayClosed" class="countOverlay">
      <div
        class="subitem-link"
        v-for="item in headerItems[2]?.items"
        :key="item?.count"
        @click="item?.command"
      >
        {{ item?.label }}
      </div>
    </OverlayPanel>

    <OverlayPanel ref="countOverlayCancel" class="countOverlay">
      <div
        class="subitem-link"
        v-for="item in headerItems[3]?.items"
        :key="item?.count"
        @click="item?.command"
      >
        {{ item?.label }}
      </div>
    </OverlayPanel>
  </div>

  <div class="sidebar-left">
    <router-view></router-view>
  </div>

  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import PanelMenu from "primevue/panelmenu";

import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";

import { useStore } from "vuex";
import { CategoryWithFoods, CategoryWithFoodsUpdated } from "@/types/Category";
import http from "@/http";
const confirm = useConfirm();
const store = useStore();
const isMenuBarOpen = ref(false);
const countOverlay = ref();
let intervalId: any = null;
const countOverlayKitchen = ref();
const stopListCount =ref(0)
const countOverlayCancel = ref();
const countOverlayClosed = ref();
const selectedRoute=ref('')
intervalId = setInterval(() => {
store.dispatch('fetchAwaitingOrders')
store.dispatch('fetchAwaitingPickup')
}, 5000);

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

const selecteRoute =(item:any)=>{
item.command()
selectedRoute.value = item?.label
}

const toggle = (event: any) => {
  countOverlay.value.toggle(event);
};

const toggleKitchen = (event: any) => {
  countOverlayKitchen.value.toggle(event);
};

const toggleСancel = (event: any) => {
  countOverlayCancel.value.toggle(event);
};

const totalAwaitingCount = computed(() => {
  return (
    store.getters.stats.awatingOrdersCount +
    store.getters.stats.awatingOrdersPickupCount
  );
});

const totalKitchenCount = computed(() => {
  return (
    store.getters.stats.kitchenOrdersCount +
    store.getters.stats.kitchenOrdersPickupCount
  );
});

const getStoppedFoods = async () => {
  try {
    const response = await http("admin/get-all-foods-stoplist-true");
    if (response.status === 200) {
      const result = response.data?.map((item: CategoryWithFoods) => ({
        id: item.Category.id,
        name: item.Category.name,
        foods: item.Foods,
      }));

      stopListCount.value = result?.filter(
        (item: CategoryWithFoodsUpdated) => item?.foods !== null,
      )?.length  

      console.log('stopListCount',stopListCount)
    }
  } catch (err) {
    console.log(err);
  }
};

const toggleClosed = (event: any) => {
  countOverlayClosed.value.toggle(event);
};

const confirmLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  window.location.reload();
};

const openSignOutModal = () => {
  confirm.require({
    message: "Вы действительно хотите выйти?",
    header: "Выход",
    icon: "pi pi-info-circle",
    rejectLabel: "Отмена",
    acceptLabel: "Выход",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: () => {
      confirmLogout();
    },
    reject: () => {},
  });
};

const router = useRouter();

const headerItems = ref([
  {
    label: `В ожидании`,
    items: [
      {
        label: "Доставки",
        count: 0,
        command: () => {
          router.push("/");
        },
      },
      {
        label: "Самовывоз",
        count: 0,
        command: () => {
          router.push("/awaiting-orders-pickup");
        },
      },
    ],
  },

  {
    label: "На кухне",
    items: [
      {
        label: "Доставки",
        count: 15,
        command: () => {
          router.push("/sent-to-kitchen");
        },
      },
      {
        label: "Самовывоз",
        command: () => {
          router.push("/sent-to-kitchen-pickup");
        },
      },
    ],
  },

  {
    label: "Доставленные",
    items: [
      {
        label: "Доставки",
        //   icon: 'pi pi-print',
        command: () => {
          router.push("/closed-orders");
          // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
        },
      },
      {
        label: "Самовывоз",
        //   icon: 'pi pi-print',
        command: () => {
          router.push("/closed-orders-pickup");
          // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
        },
      },
    ],
  },

  {
    label: "Отмененные",
    items: [
      {
        label: "Доставки",
        //   icon: 'pi pi-print',
        command: () => {
          router.push("/cancelled-orders");
          // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
        },
      },
      {
        label: "Самовывоз",
        //   icon: 'pi pi-print',
        command: () => {
          router.push("/cancelled-orders-pickup");
          // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
        },
      },
    ],
  },
  {
    label: "Делегированные",
    //   icon: 'pi pi-print',
    command: () => {
      router.push("/delegated-orders");
      // toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
    },
  },
]);


const items = ref([
  {
    label: "Меню",
    command: () => {
     router.push("/menu");
    },
  },

  {
    label: `СТОП-ЛИСТ`,
    command: () => {
      router.push("/update-items");
    },
  },
  {
    label: "Курьеры",
    command: () => {
      router.push("/all-couriers");
    },
  },
  {
    label: "Новости",
    command: () => {
      router.push("/news");
    },
  },
  {
    label: "Распродажа",
    command: () => {
      router.push("/sales");
    },
  },

  {
    label: "Выйти из аккаунта",
    icon: "pi pi-sign-out",
    command: () => {
      openSignOutModal();
    },
  },
]);

onMounted(async () => {
  await getStoppedFoods()
  await store.dispatch("fetchStats");
  store.dispatch("fetchAwaitingPickup");
  setTimeout(() => {
    isMenuBarOpen.value = true;
  }, 1000);

});
</script>

<style scoped lang="scss">
.sidebar-left {
  margin-left: 320px;
}
.headerItems {
  margin-left: 320px;
  margin-top: 30px;
}
.each-link-menu {
  padding: 1px 10px;
  border-radius: 5px;
}
.each-link-menu:hover {
  cursor: pointer;
  background: #f1f5f9;
}

.menubar-link {
  padding: 7px 3px;
}

.count-overlay {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-items {
  display: flex;
  justify-content: space-around;
}

.menubar-link:hover {
  cursor: pointer;
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

:deep(.p-menubar) {
  margin-left: 320px;
}

.subitem-link {
  padding: 4px 10px;
  border-radius: 5px;
}


.subitem-link:hover {
  cursor: pointer;
  background: #f1f5f9;
}

:deep(.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content){
  color:#334155 !important;
}

.active-route-item{
  opacity: .5 !important;

}

</style>
