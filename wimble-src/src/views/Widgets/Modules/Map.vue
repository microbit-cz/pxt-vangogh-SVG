
<script setup lang="ts">
import { main } from '@/converter'
import { reactive, ref } from 'vue'


function showPathPrompt() {
    let newSVG = prompt("Zadejte nový Path")
    lines = []
    angles = []
    if (newSVG) input = main(newSVG)
    calc()
}

const { service } = defineProps(['service'])
    interface angle {
        val: string,
        left: number,
        top: number,
        i:any
    }
    interface line {
        pendown: string
        width: number,
        rotate: string,
        left: number,
        top: number,
        i:any
    }
    let lines: line[] = reactive([])
    let angles: angle[] = reactive([])
    let input: any[] = []
    function calc() {
        let anglesum = 0
        input.forEach(x => {
            if(x[0] == 2) {
                anglesum += x[1]
            }
            if(x[0] == 3) {
                anglesum -= x[1]
            }
        })
        console.log(anglesum)
        let coords: number[] = [0,0]
        let angle: number= 0
        let pendown: boolean = false
        for (const x in input) {
            const cmd = input[x]
            switch (cmd[0]) {
                case 5: 
                    pendown = false
                    break;
                case 4: 
                    pendown = true
                    break;
                case 3: 
                    angle = (angle + parseFloat(cmd[1])) % 360
                    angles.push({
                        val: "R" + Math.round(cmd[1]*10)/10,
                        left: coords[0],
                        top: coords[1],
                        i: x
                    }) 
                    break;
                case 2: 
                    angle = (angle - cmd[1]) % 360
                    angles.push({
                        val: "L" + Math.round(cmd[1]*10)/10,
                        left: coords[0],
                        top: coords[1],
                        i:x
                    })   
                    break;
                case 1: 
                    lines.push({
                        pendown: pendown ? "pendown" : "penup",
                        rotate: 90 - angle + "deg",
                        width: cmd[1],
                        left: coords[0],
                        top: coords[1],
                        i:x
                    }) 
                    let radAngle = angle * Math.PI/180
                    coords[0] += Math.sin(radAngle) * cmd[1]
                    coords[1] += Math.cos(radAngle) * cmd[1]
                    
                    break;
            }
        }
        console.log(lines)
        console.log(angles)
    }
    calc()
    const drawState = reactive({
        h: 0,
        clr: 'rgb(206, 12, 12)',
        txt: 'Waiting for upload'
    })
    let itCnt = 0
    function sendout () {
        let textOut = "["
        input.forEach(x => textOut += `[${x[0]}, ${x[1]}],`)
        textOut += "[4,0]]"
        if (service) {
            let sendText = "%" + textOut + "%"
            console.log(sendText);
            drawState.txt = "Uploading"
            itCnt = Math.ceil(sendText.length/14)
            for (let i = 0; i < sendText.length; i+=14) {
                console.log(sendText.slice(i, i+14) + "$");
                service.sendText(sendText.slice(i, i+14) + "$")
            }
            
        }
        navigator.clipboard.writeText(textOut);
        output.value = textOut
        alert(textOut)
    }
    service.addEventListener('receiveText',(e:CustomEvent)=>{
        const { detail } = e
        if (detail == "%rsta") {drawState.txt = "Uploading"; drawState.clr = 'rgb(206, 12, 12)';drawState.h=0}
        else if (detail.startsWith("%rp")) {let x = (parseInt(detail.slice(3))/itCnt)*100; drawState.txt = `Uploading ${Math.round(x)}%`; drawState.h = x}
        else if (detail == "%rend") {drawState.txt = "Uploaded";drawState.h=100}
        else if (detail == "%dsta") {drawState.txt = "Drawing"; drawState.clr = 'rgb(31, 129, 7)';drawState.h=0}
        else if (detail.startsWith("%dr")) {let x = (parseInt(detail.slice(3))/(input.length+2))*100; drawState.txt = `Drawing ${Math.round(x)}%`; drawState.h = x;document.querySelector(`div[data-index="${detail.slice(3)-1}"]`)?.classList.remove("dactive"); document.querySelector(`div[data-index="${detail.slice(3)}"]`)?.classList.add("dactive")}
        else if (detail == "%dend") {drawState.txt = "Finished";drawState.h=100}
    })
    const zoom = ref(1)
    const output = ref("")
</script>

<template>
    <div class="container">
        <div class="canvas">
            <div class="canvasinner" :style="'scale: ' + zoom*zoom/100">
                <div v-for="angled in angles" class="angledot" :style="'top: ' + (angled.top) + 'mm; left: ' + (angled.left) + 'mm;'" :data-index="angled.i"></div>
                <div v-for="angle in angles" class="angle" :style="'top: ' + (angle.top) + 'mm; left: ' + (angle.left) + 'mm;'">{{ angle.val }}°</div>
                <div v-for="line in lines" :class="'line ' + line.pendown" :style="'transform: rotate(' + line.rotate + '); width: ' + line.width + 'mm; top: ' + line.top + 'mm; left: ' + line.left + 'mm;'" :data-index="line.i"></div>
            </div>
            <div class="state">
                <div class="level" :style="`height: ${drawState.h}%; background-color: ${drawState.clr};`"></div>
                <div class="desc">{{ drawState.txt }}</div>
            </div>
        </div>
        <div class="tools">
            <button id="changesvg" @click="showPathPrompt">Nastavit PATH</button>
            <button id="sendsvg" @click="sendout">Odeslat</button>
            <input type="range" id="zoom" min="1" max="30" v-model="zoom">
            <input type="text" v-model="output" id="txtout">
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.tools {
    display: flex;
    flex-direction: column;
    align-items: start;
    button {
        margin: 0.3rem 0.6rem;
        padding: 0.6rem 1.2rem;
        background: transparent;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.2rem;
    }
    input {
        margin: 0.5rem;
        #trtout {
            opacity: 0;
        }
    }
}
    .canvas {
        overflow: hidden;
        width: 60vw;
        height: 60vh;
        position: relative;
        background: #fff;
        top: 0;
        left: 0;
        .state {
            position: absolute;
            right: 0;
            top: 0;
            width: 1.8rem;
            height: 100%;
            background-color: rgb(207, 218, 228);
            .desc {
                font-weight: 600;
                position: absolute;
                bottom: 0;
                left: 0;
                text-align: right;
                height: fit-content;
                width: max-content; 
                padding: 2px 6px;
                transform: translateX(-100%);
            }
            .level {
                position: absolute;
                top: 0;
                left: 0;
                height: 0;
                width: 100%;
                background: rgb(206, 12, 12);
                transition: all 0.2s ease; 
            }
        }
        .canvasinner {
            position: absolute;
            z-index: 100000;
            /*top: 20vh;
            left: 50%;*/
        }
        .line {
            z-index: 100;
            position: absolute;
            height: 5px;
            cursor: pointer;
            transform-origin: top left;
            border-radius: 50px;
            &.pendown {
                background: #000;
                &:hover {
                    background: rgb(206, 12, 12);
                }
            }
            &.penup {
                background: rgba(0, 0, 0, 0.15);
                &:hover {
                    background: rgb(206, 122, 12);
                }
            }
            &.dactive {
                background-color: rgb(43, 179, 9);
                z-index: 100000;
            }
        }
        .angle {
            z-index: 105;
            transform-origin: top left;
            position: absolute;
            color: rgb(12, 73, 206);
            display: block;
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid #fff;
            border-radius: 50px;
            cursor: pointer;
            &:hover {
                color: rgb(7, 38, 104);
                background: #fff;
            }
            &.dactive {
                background-color: rgb(43, 179, 9);
                z-index: 100000;
            }
        }
        .angledot {
            z-index: 110;
            position: absolute;
            background: rgb(12, 73, 206);
            cursor: pointer;
            display: block;
            width: 15px;
            height: 15px;
            margin: -7.5px 0 0 -7.5px;
            border-radius: 50px;
            &:hover {
                background: rgb(7, 38, 104);
            }
            &.dactive {
                background-color: rgb(31, 129, 7);
            }
        }
    }
</style>
