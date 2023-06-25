<script setup>
import { ref, unref } from 'vue'
const { service } = defineProps(['service'])

let inputText = ref('')

const sendText = async () => {
    let textToSend = unref(inputText)
    console.log(textToSend);
    service.sendText(textToSend + "$")
}

service.addEventListener('receive',console.log)
service.addEventListener('receiveText',console.log)
</script>

<template>
    <div class="widget" id="uart">
        <div class="uarttext">
            <input type="text" v-model="inputText" placeholder="Text na odeslání">
            <button type="submit" @click="sendText">Odeslat</button>
        </div>
        <div class="widgetname">UART</div>
    </div>
</template>

<style scoped lang="scss">
    svg {
        width: 131px;
        height: 72px;
        fill: #fff;
    }
    #led {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .col {
            padding: 0 .8rem;
            h2 {
                margin-bottom: 0;
            }
            table {
                th {
                    text-align: left;
                    font-weight: 600;
                    padding: .4rem .8rem .4rem 0;
                }
                #mcbid td {
                    font-size: .8rem;
                }
            }
        }
        .ledmatrix {
            table {
                border-collapse: separate;
            }
             td {
                width: 12px;
                height: 12px;
                padding: 4px;
                cursor: pointer;
                border: 2px solid transparent;
                &.on {
                    background-color: rgb(219, 21, 21);
                }
                background-color: rgb(48, 48, 48);
            }
        }
    }
</style>