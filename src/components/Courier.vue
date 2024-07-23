<template>
  <Card>
    <template #title>
      <div class="flex flex-column align-items-end gap-3">
        <div>
          <Button
            icon="pi pi-file-edit"
            severity="info"
            class="mr-2"
            @click.capture="isEditOpen = true"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            class="mr-2"
            @click="openDelete"
          />
          <Button
            icon="pi pi-history"
            severity="success"
            v-tooltip.top="'Посмотреть доставки'"
            @click="() => router.push({ path: `/courier/${item?.id}` })"
          />
        </div>
        <span> Имя курьера: {{ item?.username }} </span>
      </div>
    </template>
    <template #content>
      <p class="m-0 flex flex-column g-3">
        <span>Почта :{{ item?.email }}</span>
        <span class="mt-2">Номер телефона :{{ item?.phone }}</span>
      </p>
    </template>
  </Card>

  <Dialog v-model:visible="isDeleteOpen" modal header="Удаление курьера">
    <ConfirmButtons
      confirmText="Удалить"
      declineText="Отменить"
      :descrText="`Вы действительно хотите удалить курьера ${item?.username}`"
      @confirmAction="confirmDelete"
      @closeModal="isDeleteOpen = false"
    />
  </Dialog>

  <Dialog v-model:visible="isEditOpen" style="width:30rem" modal header="Редактирование курьера">
    <EditCourier :item="item" @closeModal="isEditOpen = false" />
  </Dialog>
</template>

<script setup lang="ts">
import { Courier } from "@/types/Courier";
import { ref, onMounted } from "vue";
import ConfirmButtons from "../components/UI/ConfirmButtons.vue";
import http from "@/http";
import { useToast } from "primevue/usetoast";
import EditCourier from "../components/Courier/Edit.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps<{
  item: Courier;
}>();

const toast = useToast();
const isDeleteOpen = ref(false);
const isEditOpen = ref(false);
const store = useStore();
const openDelete = () => {
  isDeleteOpen.value = true;
};

const confirmDelete = async () => {
  try {
    const response = await http.post("admin/change-active-in-courier", {
      courierId: props?.item?.id,
      status: false,
    });

    if (response.status === 200) {
      toast.add({
        severity: "success",
        detail: "Курьер удален",
        summary: "Успешно",
      });
      store.dispatch("fetchAllCouriers");
      setTimeout(() => {
        isDeleteOpen.value = false;
      }, 700);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped></style>
