<template>
    <Card>
        <template #title>User Name: {{ order?.userName }}</template>
        <template #content>
            <p class="m-0 order-info">
                <span>Price :{{ order?.price }}</span>
                <span>User phone :{{ order?.userPhone }}</span>
            <div class="order-info">Address :{{ order?.address }}
                <span>Entrance:{{ order.entrance }}</span>
                <span>Floor:{{ order?.floor }}</span>
                <span>House number:{{ order?.houseNumber }}</span>
                <span>Intercom:{{ order?.intercom }}</span>
                <span>KvOffice:{{ order?.kvOffice }}</span>


            </div>
            <span>Payment method:{{ order?.paymentMethod }}</span>
            <span>Requested time:{{ order?.timeRequest }}</span>
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