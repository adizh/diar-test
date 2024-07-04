<template>
  <div class="section">
    <div class="section-header">
      <div class="flex flex-row gap-5 align-items-center">
        <span> Курьеры </span>
        <Button label="Создать курьера" @click="visible = true" />
      </div>
    </div>
    <Card v-if="!store.getters.getCouriers?.length">
      <template #content>
        {{ noContent }}
      </template>
    </Card>

    <ul v-else class="card-list">
      <li v-for="item in store.getters.getCouriers" :key="item.id">
        <CourierItem :item="item" />
      </li>
    </ul>

    <div class="card flex justify-content-center">
      <Dialog
        v-model:visible="visible"
        modal
        header="Создать курьера"
        :style="{ width: '25rem' }"
      >
        <span class="p-text-secondary block mb-5">Информация о курьере.</span>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="username" class="font-semibold w-6rem">ФИО</label>
          <InputText
            id="username"
            class="flex-auto"
            autocomplete="off"
            v-model.trim="username"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="email" class="font-semibold w-6rem">Почта</label>
          <InputText
            id="email"
            class="flex-auto"
            autocomplete="off"
            v-model.trim="email"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="phone" class="font-semibold w-6rem">Номер телефона</label>
          <InputMask
            id="phone"
            v-model="phone"
            mask="+996 (999) 99-99-99"
            placeholder="+996 (700) 11-11-11"
          />
        </div>
        <div class="flex align-items-center gap-2 mb-5">
          <label for="password" class="font-semibold w-6rem">Пароль</label>
          <Password
            id="password"
            class="flex-auto"
            autocomplete="off"
            v-model="password"
          />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Отменить"
            severity="secondary"
            @click="visible = false"
          ></Button>
          <Button type="button" label="Создать" @click="createCourier"></Button>
        </div>
      </Dialog>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const visible = ref(false);
const isDeleteOpen = ref(true);
import http from "@/http";
import { Courier } from "@/types/Courier";
import CourierItem from "@/components/Courier.vue";
import { useToast } from "primevue/usetoast";
import { useStore } from "vuex";
const AllCouriers = ref<Courier[]>([]);
const noContent = ref("");
const email = ref("");
const username = ref("");
const phone = ref("");
const store = useStore();
const password = ref("");
const toast = useToast();
const createCourier = async () => {
  if (
    email?.value.length > 0 &&
    username.value?.length > 0 &&
    phone.value?.length > 0 &&
    password.value?.length > 0
  ) {
    const body = {
      email: email.value,
      password: password.value,
      phone: phone.value,
      userName: username.value,
    };
    try {
      const response = await http.post("admin/create-courier", body);
      console.log(response.status, "response create a courier");
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Курьер создан",
          detail: "Курьер создан!",
        });
        visible.value = false;
      }
    } catch (err: any) {
      console.log(err.response.data.message);
      toast.add({
        severity: "error",
        summary: "Неправильные данные",
        detail: err?.response?.data?.message || "Error occurred!",
      });
    } finally {
      store.dispatch("fetchAllCouriers");
    }
  } else {
    return;
  }
};

onMounted(() => {
  store.dispatch("fetchAllCouriers");
});
</script>

<style scoped lang="scss">
@import "@/assets/mixins.scss";

input {
  width: 50% !important;
  max-width: 100% !important;
}

:deep(input.p-inputtext.p-component.p-password-input) {
  width: 95% !important;
  margin-left: 22px !important;
}

:deep(.p-inputmask) {
  width: 70% !important;
}
</style>
