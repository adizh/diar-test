<template>
    <Card>
        <template #title>ФИО: {{ order?.userName }}</template>
        <template #content>
            <p class="m-0 order-info">
                <span>Цена :{{ order?.price }}</span>
                <span>Номер телефона :{{ order?.userPhone }}</span>
            <div class="order-info">Адрес :{{ order?.address }}
                <span>Вход:{{ order.entrance }}</span>
                <span>Этаж:{{ order?.floor }}</span>
                <span>Номер квартиры:{{ order?.houseNumber }}</span>
                <span>Внутренняя связь:{{ order?.intercom }}</span>
                <span>Квартира/Офис:{{ order?.kvOffice }}</span>


            </div>
            <span>Метод оплаты:{{ order?.paymentMethod }}</span>
            <span>Запрошенное время:{{ order?.timeRequest }}</span>
            </p>
        </template>

    </Card>


</template>

<script setup lang="ts">
import { AwaitingOrder } from '@/types/Order'


const props = defineProps<{
    order: AwaitingOrder

}>()
</script>

<style scoped lang="scss">
@import '../assets/mixins.scss';

.order-info {
    @include flex(column, center, start)
}
</style>