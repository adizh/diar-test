<template>
  <form @submit.prevent="adminLogin">
    <div class="flex flex-column gap-2 email">
      <label for="username">Телефон</label>
      <InputMask
      id="phone"
      v-model.trim="email"
      mask="+996 (999) 99-99-99"
      placeholder="+996 (700) 11-11-11"
    />
    
    </div>

    <div class="flex flex-column gap-2">
      <label for="password">Пароль</label>
      <Password v-model="password" toggleMask id="password" />
    </div>
    <Button label="Отправить" type="submit" />
  </form>
</template>

<script setup lang="ts">
import axios, { AxiosInstance } from "axios";
import { ref, inject } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import http, { BaseUrl } from "@/http";
import { useRouter } from "vue-router";
const router = useRouter();

const email = ref("");
const password = ref("");

const adminLogin = async () => {
  if (!email.value?.length && !password.value?.length) {
    return;
  } else {
    try {
      const body = {
        email: email.value,
        password: password.value,
      };
      const response = await axios.post(`${BaseUrl}/auth/sign-in`, body);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("role", response.data.role);
        router.push("/");
        window.location.reload();
      }
      console.log("response", response);
    } catch (err) {
      console.log(err, "error login");
    }
  }

  // "email": "diar.restoran@mail.ru",
  // "password": "diarrestoran666"
};
</script>

<style scoped lang="scss">
@import "@/assets/mixins.scss";

form {
  @include flex(column, center, center);
  @include centerBlock();
  height: 100vh;
  width: 50%;
}

.email {
  width: 47%;
}
</style>
