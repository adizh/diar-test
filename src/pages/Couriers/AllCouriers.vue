<template>
  <div class="section">
    <div class="section-header">
      <div class="flex justify-content-between align-items-center mb-5">
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
        :style="{ width: '30rem' }"
      >
        <span class="p-text-secondary block mb-5">Информация о курьере.</span>
        <div class="flex flex-column gap-3 mb-3">
          <label for="username" class="font-semibold w-6rem">ФИО</label>
          <InputText
            id="username"
            class="flex-auto"
            autocomplete="off"
            v-model.trim="username"
          />
        </div>
        <div class="flex flex-column gap-3 mb-5">
          <label for="email" class="font-semibold w-6rem">Почта</label>
          <InputText
            id="email"
            class="flex-auto"
            autocomplete="off"
            v-model.trim="email"
          />
        </div>
        <div class="flex flex-column gap-3 mb-5">
          <label for="phone" class="font-semibold">Номер телефона</label>
          <InputMask
            id="phone"
            v-model="phone"
            mask="+996 (999) 99-99-99"
            placeholder="+996 (700) 11-11-11"
          />
        </div>
        <div class="flex flex-column gap-2 mb-5 password-block">
          <label for="password" class="font-semibold w-6rem">Пароль</label>
          <InputText
            id="password"
            class="flex-auto"
            autocomplete="off"
            v-model="password"

            :type="isPasswordOpen ? 'text' : 'password'"
          />

          <span
          class="pi pi-eye password-eye"
          @click="isPasswordOpen = false"
          v-if="isPasswordOpen"
        ></span>
        <span
          class="pi pi-eye-slash password-eye"
          @click="isPasswordOpen = true"
          v-else
        ></span>
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
const isPasswordOpen =ref(false)
const createCourier = async () => {
  if (
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
      console.log( "response create a courier",response);
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
  max-width: 100% !important;
  width: 100%;
}

:deep(input.p-inputtext.p-component.p-password-input) {
  width: 100% !important;

}

:deep(.p-inputmask) {
  width: 100% !important;
}

.password-block {
  position: relative;
}

.password-eye {
  position: absolute;
  top: 60%;
  right: 10px;

  background: white;
}
</style>
