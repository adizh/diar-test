<template>
  <div>
    <div class="flex flex-column gap-3 mb-5">
      <label for="name" class="font-semibold">Имя курьера</label>
      <InputText
        id="name"
        class="flex-auto"
        autocomplete="off"
        v-model="forms.userName"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="email" class="font-semibold">Почта</label>
      <InputText
        id="email"
        class="flex-auto"
        autocomplete="off"
        v-model="forms.email"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="phone" class="font-semibold">Номер телефона</label>

      <InputMask
        id="phone"
        v-model.trim="forms.phone"
        mask="+996 (999) 99-99-99"
        placeholder="+996 (700) 11-11-11"
      />
    </div>

    <div class="flex flex-column gap-3 mb-5">
      <label for="password" class="font-semibold">Пароль</label>
      <InputText
        id="password"
        class="flex-auto"
        autocomplete="off"
        type="password"
        v-model="forms.password"
      />
    </div>

    <Button label="Отправить" severity="info" @click="editCourier" />
  </div>
</template>

<script setup lang="ts">
import http from "@/http";
import { Courier } from "@/types/Courier";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
const toast = useToast();
const props = defineProps<{
  item: Courier;
}>();
const forms = ref({
  userName: "",
  email: "",
  password: "",
  phone: "",
  id: "",
});
const emit = defineEmits(["closeModal"]);
const courier = ref({} as Courier);
const store = useStore();

const fetchCourierId = async () => {
  try {
    const response = await http(
      `admin/get-courier-by-id?courierId=${props?.item?.id}`,
    );

    if (response.status === 200) {
      courier.value = response.data;
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchCourierId();
  console.log("courier", courier);
  for (const key in courier.value) {
    if (key === "active" || key === "role") continue;
    forms.value[key as keyof typeof forms.value] = courier.value[
      key as keyof typeof courier.value
    ] as any;
  }
});

const editCourier = async () => {
  const isError = Object.values(forms.value)?.every(
    (value) => value?.trim()?.length > 0,
  );

  if (isError) {
    const body = {
      courierUUID: forms?.value?.id,
      email: forms.value?.email,
      password: forms?.value?.password,
      phone: forms?.value?.phone,
      username: forms?.value?.userName,
    };

    try {
      const response = await http.put("admin/update-courier", body);
      if (response.status === 200) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Курьер изменен!",
        });

        setTimeout(() => {
          emit("closeModal");
          store.dispatch("fetchAllCouriers");
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Заполните все поля!",
    });
  }
};
</script>

<style scoped></style>
