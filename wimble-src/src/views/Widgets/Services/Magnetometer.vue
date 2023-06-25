<script setup>
import { computed, ref } from 'vue'
const { service } = defineProps(['service'])

console.log(service)

await service.setMagnetometerPeriod(80)
let magnetometerData = ref(await service.readMagnetometerData())
let magnetometerBearing = ref(await service.readMagnetometerBearing())
let magnetometerSide = computed(() => {
    let deg = magnetometerBearing.value
    if (deg >= 337.5 || deg < 22.5) {
        return "S";
    } else if (deg >= 22.5 && deg < 67.5) {
        return "SV";
    } else if (deg >= 67.5 && deg < 112.5) {
        return "V";
    } else if (deg >= 112.5 && deg < 157.5) {
        return "JV";
    } else if (deg >= 157.5 && deg < 202.5) {
        return "J";
    } else if (deg >= 202.5 && deg < 247.5) {
        return "JZ";
    } else if (deg >= 247.5 && deg < 292.5) {
        return "Z";
    } else {
        return "SZ";
    }
    
})

service.addEventListener('magnetometerdatachanged',(data) => {
    magnetometerData.value = data.detail
})
service.addEventListener('magnetometerbearingchanged',(data) => {
    console.log(data);
    magnetometerBearing.value = data.detail
})

</script>

<template>
    <div class="widget" id="magnetometer">
        <div class="magnetometer">
            <div class="cord">X<div class="accelrange"><div class="accelval neg" :style="`transform: translateX(${((magnetometerData.x / 400) + 100).toString() + '%'});`"></div></div><div class="sep"></div><div class="accelrange"><div class="accelval pos" :style="`transform: translateX(${((magnetometerData.x / 400) - 100).toString() + '%'});`"></div></div></div>
            <div class="cord">Y<div class="accelrange"><div class="accelval neg" :style="`transform: translateX(${((magnetometerData.y / 400) + 100).toString() + '%'});`"></div></div><div class="sep"></div><div class="accelrange"><div class="accelval pos" :style="`transform: translateX(${((magnetometerData.y / 400) - 100).toString() + '%'});`"></div></div></div>
            <div class="cord">Z<div class="accelrange"><div class="accelval neg" :style="`transform: translateX(${((magnetometerData.z / 400) + 100).toString() + '%'});`"></div></div><div class="sep"></div><div class="accelrange"><div class="accelval pos" :style="`transform: translateX(${((magnetometerData.z / 400) - 100).toString() + '%'});`"></div></div></div>
            <div class="cord" style="display: none;">Směr: {{magnetometerSide}} ({{ magnetometerBearing }}°)</div>
        </div>
        <div class="widgetname">Magnetometer</div>
    </div>
</template>

<style scoped lang="scss">
    svg {
        width: 131px;
        height: 72px;
        fill: #fff;
    }
    #magnetometer {
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