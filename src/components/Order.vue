<template>
  <Card :class="{ open: isOpen, newOrder: orderTime }">
    <template #title>
      <div class="flex flex-row gap-3 align-items-start">
        <div class="flex flex-column mb-2">
          <p>№ {{ order?.orderNumber }}</p>

          <span
            ><span class="order-name">Тел</span> :{{ order?.userPhone }}</span
          >
        </div>
        <Button
          v-if="from === 'kitchen'"
          label="Назначить курьера"
          severity="success"
          raised
          @click="isDelegOpen = true"
        />
        <Dropdown
          v-model="selectedStatus"
          :options="computedStatus"
          optionLabel="name"
          placeholder="Выбрать статус"
          class="w-full md:w-14rem"
          @change="changeStatus"
        />

        <Button
          v-if="from === 'awaiting-pickup' || from === 'awaiting'"
          v-tooltip.top="'Добавить еду'"
          icon="pi pi-plus"
          severity="info"
          raised
          @click="isAddNewFoodOpen = true"
        />
        <Button
          v-if="from === 'awaiting' || from === 'awaiting-pickup'"
          icon="pi pi-pencil"
          severity="success"
          v-tooltip.top="'Редактировать'"
          @click="isEditOpen = true"
        />
      </div>
      <Button
        :label="isOpen ? 'Свернуть' : 'Показать'"
        severity="secondary"
        @click="isOpen = !isOpen"
      />
    </template>

    <template #content>
      <Transition name="slide-fade">
        <div v-if="isOpen">
          <div>
            Еда:
            <DataTable
              :value="order?.foods"
              :tableStyle="{ minWidth: '100%' }"
              class="mb-2"
            >
              <Column field="name" header="Название"></Column>
              <Column field="quantity" header="Кол-во"></Column>
              <Column field="price" header="Цена"></Column>
            </DataTable>
          </div>
          <div class="m-0 order-info flex flex-row justify-content-between">
            <p class="flex flex-column columns">
              <span
                ><span class="order-name">Цена</span>: {{ order?.price }}</span
              >
              <span
                ><span class="order-name">Сдача</span>:
                {{ order?.sdacha }}</span
              >
              <span class="long-info-status"
                ><span class="order-name">Статус</span>:
                <span>{{ order?.status }}</span></span
              >
              <span
                ><span class="order-name">Кол-во столовых приборов</span>:
                {{ order?.dishesCount }}</span
              >
              <span v-if="order.deliveryPrice"
                ><span class="order-name">Цена за доставку</span>:
                {{ order?.deliveryPrice }}</span
              >
              <span v-if="totalPrice"
              ><span class="order-name">Общая сумма</span>:
              {{ order?.price + order?.deliveryPrice }}</span
            >
            <span v-if="totalFoodsCount"
            ><span class="order-name">Общее кол-во блюд</span>:
            {{ totalFoodsCount }}</span
          >
            
              <span
                ><span class="order-name">Комментарий</span>:
                {{ order?.comment }}</span
              >
              <span
                ><span class="order-name">Имя</span>:
                {{ order?.userName }}</span
              >
            </p>
            <div class="columns">
              <div class="order-info" v-if="order.address">

                <span class="long-info">
                  <span class="order-name">Адрес:</span>
                  <span>{{ order?.address }}</span>
                </span>

                <span v-if="order.courierId && courier?.id"
                ><span class="order-name">Курьер</span>: {{courier?.userName}}
    </span
              >
                <span v-if="order.entrance"
                  ><span class="order-name">Вход</span>:
                  {{ order.entrance }}</span
                >
                <span v-if="order.floor"
                  ><span class="order-name">Этаж</span>:
                  {{ order?.floor }}</span
                >
                <span v-if="order.houseNumber"
                  ><span class="order-name">Номер квартиры</span>:
                  {{ order?.houseNumber }}</span
                >
                <span v-if="order.intercom"
                  ><span class="order-name">Внутренняя связь</span>:
                  {{ order?.intercom }}</span
                >
                <span v-if="order.kvOffice"
                  ><span class="order-name">Квартира/Офис</span>:
                  {{ order?.kvOffice }}</span
                >
              </div>
              <span v-if="order.paymentMethod"
                ><span class="order-name">Метод оплаты</span>:{{
                  order?.paymentMethod
                }}</span
              >
              <span
                ><span class="order-name">Запрошенное время</span>:{{
                  order?.timeRequest
                }}</span
              >
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </Card>

  <Dialog
    v-model:visible="isDelegOpen"
    modal
    header="Назначить курьера"
    :style="{ width: '30rem' }"
  >
    <div class="flex flex-column gap-5 align-items-center">
      <Dropdown
        v-model="selectedCourier"
        :options="store?.getters?.getCouriers"
        optionLabel="username"
        placeholder="Выбрать курьера"
        class="w-full md:w-14rem"
      />
      <Button
        label="Назначить"
        icon="pi pi-check"
        severity="info"
        @click="delegateOrder"
      />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="isCancelOpen"
    modal
    header="Отменить заказ"
    :style="{ width: '25rem' }"
  >
    <ConfirmButtons
      confirmText="Да"
      declineText="Нет"
      @close-modal="isCancelOpen = false"
      @confirm-action="cancelOrder"
      :descr-text="'Вы действительно хотите отменить заказ'"
    />
  </Dialog>

  <Dialog
    v-model:visible="isAddNewFoodOpen"
    modal
    header="Добавить еду"
    :style="{ width: '35rem' }"
  >
    <OrderAddFood :order="order" @closeModal="closeModal" :from="from" />
  </Dialog>
  <Dialog
    v-model:visible="isStatusOpen"
    modal
    header="Потверждение статуса"
    :style="{ width: '25rem' }"
  >
    <div>
      <p>
        Вы потверждаете данный статус <strong>{{ selectedStatus?.name }}</strong
        >?
      </p>
      <div class="flex flex-row justify-content-end gap-2">
        <Button label="Нет" severity="danger" @click="isStatusOpen = false" />
        <Button label="Да" severity="success" @click="confirmStatus" />
      </div>
    </div>
  </Dialog>

  <Dialog
    v-model:visible="isSelectCourier"
    modal
    header="Назначить курьера"
    :style="{ width: '30rem' }"
  >
    <div class="flex flex-column gap-5 align-items-center">
      <Dropdown
        v-model="selectedCourier"
        :options="store?.getters?.getCouriers"
        optionLabel="username"
        placeholder="Выбрать курьера"
        class="w-full md:w-14rem"
      />
      <Button
        label="Назначить"
        icon="pi pi-check"
        severity="info"
        @click="delegateOrder"
      />
    </div>
  </Dialog>

  <Dialog
  
    v-model:visible="isEditOpen"

    modal
    :header="`Редактировать заказ ${order?.orderNumber}`"
    :style="{ width: '45rem' }"
  >
    <EditOrder
      :order="order"
      @closeModal="isEditOpen = false"
      v-if="from === 'awaiting'"

    />
    <EditPickupOrder

      :order="order"
      @closeModal="isEditOpen = false"
      v-else-if="from === 'awaiting-pickup'"
    />
  </Dialog>

  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, onUnmounted } from "vue";
import { AwaitingOrder } from "@/types/Order";
const props = defineProps<{
  order: AwaitingOrder;
  type?: string;
  from?: string;
}>();
import ConfirmButtons from "./UI/ConfirmButtons.vue";
import EditOrder from "@/components/Update/EditOrder.vue";
import EditPickupOrder from "@/components/Update/EditPickupOrder.vue";
let newOrderInverval: any = null;
const isAddNewFoodOpen = ref(false);
const isStatusOpen = ref(false);
import OrderAddFood from "@/components/Orders/AddNew.vue";
const store = useStore();
const isDelegOpen = ref(false);

const isSelectCourier = ref(false);
const selectedStatus = ref({} as Status);
const isCancelOpen = ref(false);
import { useStore } from "vuex";
import { Courier } from "@/types/Courier";
import http from "@/http";
import { useToast } from "primevue/usetoast";
const selectedCourier = ref({} as Courier);
const toast = useToast();
const isEditOpen = ref(false);
const orderTime = ref(false);
import { useOrderTimer } from "@/hooks/ordersTimer";

type Status = {
  name: string;
  code: string;
};
const isOpen = ref(false);
const statusOptions = ref([
  { name: "Отправить на кухню", code: "the order is being prepared" },
  { name: "Закончить заказ", code: "Finished" },
  { name: "Ожидаемый", code: "awaiting confirmation from the operator" },
  { name: "Отменить", code: "canceled order" },
  { name: "Доставленный", code: "order is being delivered" },
]);

const computedStatus = computed(() => {
  return props?.from?.includes("pickup")
    ? statusOptions?.value?.slice(0, 4)
    : statusOptions?.value;
});

const changeStatus = (event: any) => {
  console.log("event", event);
  selectedStatus.value = event?.value;
  isStatusOpen.value = true;
};


const totalPrice = computed(() => {
  if (props?.order?.foods) {
    return props.order?.foods?.reduce((total, item) => {
      return   total + (item?.quantity * item?.price || 0);
    }, 0) + props?.order?.deliveryPrice
  }
  return 0;
});

const totalFoodsCount =  computed(() => {
  if (props?.order?.foods) {
    return props.order?.foods?.reduce((total, item) => {
      return   total + (item?.quantity || 0);
    }, 0)
  }
  return 0;
});



const updateStatusPickup = async () => {
  try {
    const response = await http.put(
      "/pickup-orders/update-pickup-order-status",
      {
        orderNumber: props?.order?.orderNumber,
        status: selectedStatus?.value?.code,
      },
    );
    if (response.status === 200) {
      toast.add({
        severity: "success",
        detail: "Статус изменен",
        summary: "Успешно",
      });
      isStatusOpen.value = false;
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
    console.log("response updateStatusPickup", response);
  } catch (err) {
    console.log(err);
  }
};

const updateStatus = async () => {
  if (selectedStatus?.value?.name !== "Доставленный") {
    try {
      const response = await http.put("/orders/update-order-status", {
        orderNumber: props?.order?.orderNumber,
        status: selectedStatus?.value?.code,
      });
      if (response.status === 200) {
        toast.add({
          severity: "success",
          detail: "Статус изменен",
          summary: "Успешно",
        });
        isStatusOpen.value = false;
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }

      console.log("response updateStatus", response);
    } catch (err) {
      console.log(err);
    }
  }
};

const confirmStatus = () => {
  if (selectedStatus?.value?.name === "Доставленный") {
    isSelectCourier.value = true;
  }
  if (
    props?.from === "awaiting-pickup" ||
    props?.from === "kitchen-pickup" ||
    props?.from === "cancelled-pickup" ||
    props?.from === "closed-pickup"
  ) {
    updateStatusPickup();
  } else if (
    props?.from === "awaiting" ||
    props?.from === "kitchen" ||
    props?.from === "cancelled" ||
    props?.from === "closed" ||
    props?.from === "delegated"
  ) {
    updateStatus();
  }

  store.dispatch("fetchStats");
};

const delegateOrder = async () => {
  if (selectedCourier?.value?.id) {
    try {
      const body = {
        courierId: selectedCourier?.value?.id,
        orderNumber: props?.order?.orderNumber,
      };
      const response = await http.post("admin/delegation-to-courier", body);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Курьер назначен",
        });
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (err) {
      console.log(err);
    } finally {
      isDelegOpen.value = false;
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Выберите курьера",
    });
  }
};

const cancelOrder = async () => {
  const url =
    props?.from === "awaiting"
      ? "admin/cancel-order"
      : props?.from === "awaiting-pickup"
        ? "admin/cancel-pickup-order"
        : "";
  try {
    const response = await http.post(url, {
      orderNumber: props?.order?.orderNumber,
    });
    if (response.status === 200) {
      toast.add({
        severity: "success",
        detail: "Заказ отменен!",
        summary: "Успешно",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};

const closeModal = () => {
  isAddNewFoodOpen.value = false;
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};
const courier=ref({} as Courier)

onMounted(async () => {
  await store.dispatch("fetchAllCouriers");
  orderTime.value = useOrderTimer(props?.order?.timeRequest);

   courier.value= await store.dispatch('fetchCourierById',props?.order?.courierId)
  newOrderInverval = setInterval(() => {
    orderTime.value = useOrderTimer(props?.order?.timeRequest);
    if (!orderTime.value) {
      clearInterval(newOrderInverval);
    }
  }, 1000);
});
onUnmounted(() => {
  if (newOrderInverval) {
    clearInterval(newOrderInverval);
  }
});
</script>

<style scoped lang="scss">
@import "../assets/mixins.scss";
.order-info {
  @include flex(column, center, start);
}
.newOrder {
  box-shadow: 0 2px 12px #2dd6b1;
}
.order-name {
  opacity: 0.7;
}
.columns {
  gap: 10px;
  display: flex;
  flex-direction: column;
}

.long-info {
  max-width: 400px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-5%);
  opacity: 0;
}

.open {
  width: 95% !important;
}
</style>
