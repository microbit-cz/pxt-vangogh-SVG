
<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useStore } from '../stores/main'
import { requestMicrobit, getServices } from 'microbit-web-bluetooth'
import router from '../router';

let devices = ref([])

const animateCanvas = () => {
    let c = document.createElement('canvas');
    document.body.appendChild(c);
    let style = c.style;
    style.width = '100%';
    style.position = 'absolute';
    style.zIndex = -1;
    style.top = 0;
    style.left = 0;
    let ctx = c.getContext('2d');
    let x0, y0, w, h, dw;

    function init() {
        w = window.innerWidth;
        h = window.innerHeight;
        c.width = w;
        c.height = h;
        let offset = h > 380 ? 100 : 65;
        offset = h > 800 ? 116 : offset;
        x0 = w / 2;
        y0 = h - offset;
        dw = Math.max(w, h, 1000) / 13;
        drawCircles();
    }
    window.onresize = init;

    function drawCircle(radius) {
        ctx.beginPath();
        let color = Math.round(1 * (160 - radius / Math.max(w, h)));
        ctx.strokeStyle = 'rgba(' + color + ',' + color + ',255,0.1)';
        ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = 2;
    }

    let step = 0;

    function drawCircles() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < 9; i++) {
            drawCircle(dw * i + step % dw);
        }
        step += 1;
    }

    let loading = true;

    function animate() {
        if (loading || step % dw < dw - 5) {
            requestAnimationFrame(function() {
                drawCircles();
                animate();
            });
        }
    }
    window.animateBackground = function(l) {
        loading = l;
        animate();
    };
    init();
    animate();
};

onMounted(async () => {
    animateCanvas()
    if (!navigator.bluetooth) {
        return useStore().status = {
            icon: "×",
            mode: "disconnected",
            text: "Bohužel, váš prohlížeč nepodporuje Bluetooth"
        }
    }
    devices.value = [...await navigator.bluetooth.getDevices()]
})

const addDevice = async function () {

    const device = await requestMicrobit(window.navigator.bluetooth)
    console.log(device);
    devices.value.push(device)

    useStore().connection.device = device
    console.log(await useStore().connection.device);
    if (await useStore().connection.device) {
        useStore().status = {
            icon: "✓",
            mode: "connected",
            text: "Úspěšně připojeno : " + device.name
        }
        router.push('/device')
    } else {
        useStore().status = {
            icon: "×",
            mode: "disconnected",
            text: "Připojení k zařízení se nepodařilo."
        }
        return
    }
}

</script>

<template>
    <div class="devices" @click="addDevice">
        <div class="devicelist">
            <div class="adddevicetext" v-if="devices.length < 1">
                Kliknutím přidejte nové zařízení.
            </div>
            <div class="device" v-for="device in devices" :key="'mcb:'+device.id" :id="'mcb:'+device.id">
                <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>micro:bit icon</title><path d="M6.857 5.143A6.865 6.865 0 000 12a6.864 6.864 0 006.857 6.857h10.287A6.863 6.863 0 0024 12c0-3.781-3.075-6.857-6.856-6.857zm0 2.744h10.287A4.117 4.117 0 0121.257 12a4.119 4.119 0 01-4.113 4.116H6.857A4.12 4.12 0 012.743 12a4.118 4.118 0 014.114-4.113zm10.168 2.729a1.385 1.385 0 10.003 2.77 1.385 1.385 0 00-.003-2.77zm-10.166 0a1.385 1.385 0 10-.003 2.771 1.385 1.385 0 00.003-2.77Z"/></svg>
                <h3>{{device.name}}</h3>
                <p>{{device.id}}</p>
            </div>
        </div>
        <div class="connector">
            <svg id="blicon" height="40" width="73" viewBox="0 0 482 878" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43 239L246.891 439L439 626.5L255 806V439V72L439 251.5L43 639" stroke="#0A69CF" stroke-width="60" stroke-linecap="square"/>
            </svg>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .devices {
        cursor: pointer;
        width: 100vw;
        height: 100vh;
    }
    .devicelist {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .adddevicetext {
            color: #0a69cf;
            font-size: 1.4rem;
        }
        .device {
            background: #0a69cf;
            border: 2px solid #0b396b;
            color: #fff;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            border-radius: 50%;
            aspect-ratio: 1/1;
            svg {
                fill: #fff;
                width: 73px;
                height: 40px;
            }
            h3 {
                margin: 0 .4rem .4rem .4rem;
            }
            p {
                margin: 0;
                font-size: .55rem;
                padding: .2rem;
            }
        }
    }
    .connector {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 166px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        #blicon {
            height: 100px;
            width: 100px;
            fill: #121212;
        }
    }
</style>