<script setup>
const props = defineProps(['device','deviceinfo'])
console.log(props.device);
console.log(props.deviceinfo);
</script>

<template>
    <div class="widget" id="deviceinfo">
        <div class="col col1">
            <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>micro:bit icon</title><path d="M6.857 5.143A6.865 6.865 0 000 12a6.864 6.864 0 006.857 6.857h10.287A6.863 6.863 0 0024 12c0-3.781-3.075-6.857-6.856-6.857zm0 2.744h10.287A4.117 4.117 0 0121.257 12a4.119 4.119 0 01-4.113 4.116H6.857A4.12 4.12 0 012.743 12a4.118 4.118 0 014.114-4.113zm10.168 2.729a1.385 1.385 0 10.003 2.77 1.385 1.385 0 00-.003-2.77zm-10.166 0a1.385 1.385 0 10-.003 2.771 1.385 1.385 0 00.003-2.77Z"/></svg>
            <h2>{{ props.device.name }}</h2>
        </div>
        <div class="col col2">
            <table>
                <tr id="mcbid">
                    <th>ID:</th>
                    <td>{{ props.device.id }}</td>
                </tr>
                <tr id="mcbmodel">
                    <th>Model:</th>
                    <td>{{ props.deviceinfo.modelNumber }}</td>
                </tr>
                <tr id="mcbrfw">
                    <th>Revize FW:</th>
                    <td>{{ props.deviceinfo.firmwareRevision == 'unknown' ? 'neznámý' : props.deviceinfo.firmwareRevision  }}</td>
                </tr>
            </table>
        </div>
        <div class="widgetname">DeviceInfo</div>
    </div>
</template>

<style scoped lang="scss">
    svg {
        width: 131px;
        height: 72px;
        fill: #fff;
    }
    #deviceinfo {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .col {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: space-evenly;
            padding: 0 .8rem;
            &.col1 {
                align-items: center;
            }
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
    }
</style>