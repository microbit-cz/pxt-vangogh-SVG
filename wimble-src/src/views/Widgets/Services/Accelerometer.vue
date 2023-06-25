<script setup>
import { ref } from 'vue'
const { service } = defineProps(['service'])

await service.setAccelerometerPeriod(80)
let accelerometerData = ref(await service.readAccelerometerData())

service.addEventListener('accelerometerdatachanged',(data) => {
    accelerometerData.value = data.detail
})

</script>

<template>
    <div class="widget" id="accelerometer">
        <div class="accelerometer">
            <div class="cord">X<div class="accelrange"><div class="accelval neg" :style="`transform: translateX(${((accelerometerData.x * 40) + 100).toString() + '%'});`"></div></div><div class="sep"></div><div class="accelrange"><div class="accelval pos" :style="`transform: translateX(${((accelerometerData.x * 40) - 100).toString() + '%'});`"></div></div></div>
            <div class="cord">Y<div class="accelrange"><div class="accelval neg" :style="`transform: translateX(${((accelerometerData.y * 40) + 100).toString() + '%'});`"></div></div><div class="sep"></div><div class="accelrange"><div class="accelval pos" :style="`transform: translateX(${((accelerometerData.y * 40) - 100).toString() + '%'});`"></div></div></div>
            <div class="cord">Z<div class="accelrange"><div class="accelval neg" :style="`transform: translateX(${((accelerometerData.z * 40) + 100).toString() + '%'});`"></div></div><div class="sep"></div><div class="accelrange"><div class="accelval pos" :style="`transform: translateX(${((accelerometerData.z * 40) - 100).toString() + '%'});`"></div></div></div>
        </div>
        <div class="widgetname">Accelerometer</div>
    </div>
</template>

<style scoped lang="scss">
    svg {
        width: 131px;
        height: 72px;
        fill: #fff;
    }
    #accelerometer {
        .cord {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 10rem;
        }
        .sep {
            display: block;
            width: 1px;
            height: 1rem;
            background-color: #fff;
        }
        .accelrange {
            position: relative;
            height: 1rem;
            width: 5rem;
            overflow: hidden;
            .accelval {
                position: absolute;
                width: 100%;
                height: 100%;
                &.pos {
                    background-color: rgb(19, 125, 231);
                }
                &.neg {
                    background-color: rgb(231, 19, 19);
                }
            }
        }
    }
</style>