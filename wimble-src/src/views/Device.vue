<script setup>
import DeviceInfo from './Widgets/Services/DeviceInfo.vue';
import LED from './Widgets/Services/LED.vue';
import Accelerometer from './Widgets/Services/Accelerometer.vue';
import Magnetometer from './Widgets/Services/Magnetometer.vue';
import UART from './Widgets/Services/UART.vue';
import Map from './Widgets/Modules/Map.vue';
import { useStore } from '../stores/main'
import { getServices } from 'microbit-web-bluetooth'
import router from '../router';

const connection = useStore().connection
console.log(connection);

document.onkeydown = (e) => { if(e.code == "Escape") router.push("/") }

async function tryServices (i=1) {
    console.log('conn retry ' + i);
    let services
    try {
        //await connection.device.gatt.connect()
        console.log(connection.device.gatt)
        services = await getServices(connection.device)
        
    } catch (e) {console.log(e)}
    if (services) return services
    if (i>3) return 0
    await new Promise(resolve => setTimeout(resolve, 200, (i+1)))
    return await tryServices(i+1) 
}

let services = await tryServices()
if (!services) {
    useStore().status = {
        icon: "×",
        mode: "disconnected",
        text: "Nepodařilo se připojit ke GATT Serveru zařízení."
    }
}


console.log(services);
const deviceService = services.deviceInformationService
let deviceInfo
if (deviceService) {
    deviceInfo = await deviceService.readDeviceInformation()
}
const ledService = services.ledService
const uartService = services.uartService
const accelerometerService = services.accelerometerService
const magnetometerService = services.magnetometerService 
console.log(magnetometerService);
</script>

<template>
    <div class="widgetlist">
        <DeviceInfo :deviceinfo="deviceInfo" :device="connection.device" v-if="deviceInfo"/>
        <LED :service="ledService" v-if="ledService"/>
        <Accelerometer :service="accelerometerService" v-if="accelerometerService"/>
        <Magnetometer :service="magnetometerService" v-if="magnetometerService"/>
        <UART :service="uartService" v-if="uartService"/>
        <Map :service="uartService" v-if="uartService"/>
    </div>
</template>

<style lang="scss">

.widgetlist {
    margin: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: start;
    gap: 2rem;
    .widget {
        background-color: #27262b;
        color: #fff;
        padding: 2rem 2rem;
        width: max-content;
        position: relative;
        .widgetname {
            display: block;
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: .6rem;
            color: rgba(255,255,255, 0.3);
            padding: 2px 4px;
        }
    }
}

</style>
