<script setup>
import { ref } from 'vue'
const { service } = defineProps(['service'])

let ledMatrix = ref(await service.readMatrixState())

setInterval(async () => {
    ledMatrix.value = await service.readMatrixState()
}, 1000)

const toggleLED = async (e) => {
    let coords = e.target.id.substring(3)
    let updatedMatrix = await service.readMatrixState()
    updatedMatrix[parseInt(coords[0])][parseInt(coords[1])] = !updatedMatrix[parseInt(coords[0])][parseInt(coords[1])]
    service.writeMatrixState(updatedMatrix)
    ledMatrix.value = updatedMatrix
}
</script>

<template>
    <div class="widget" id="led">
        <div class="ledmatrix">
            <table>
                <tr v-for="(ledRow, Rindex) in ledMatrix" :key="Rindex">
                    <td v-for="(led, Lindex) in ledRow" :key="Lindex" :id="'led'+Rindex+Lindex" :class="led ? 'on' : 'off'" @click="toggleLED"></td>
                </tr>
            </table>
        </div>
        <div class="widgetname">LED</div>
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