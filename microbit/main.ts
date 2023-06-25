function drawTurtle(cmds: number[][]) {
    bluetooth.uartWriteString("%dsta")
    for (let i = 0; i < cmds.length; i++) {
        bluetooth.uartWriteString("%dr"+i)
        console.log(cmds[i])
        if (cmds[i][0] == 1) {
            //forwards
            vanGogh.fd(cmds[i][1])
        } else if (cmds[i][0] == 2) {
            //left
            vanGogh.re(cmds[i][1], false)
        } else if (cmds[i][0] == 3) {
            //right
            vanGogh.re(cmds[i][1], true)
        } else if (cmds[i][0] == 4) {
            vanGogh.penDown()
        } else if (cmds[i][0] == 5) {
            //penup
            vanGogh.penUp()
        }
    }
    bluetooth.uartWriteString("%dend")
}
bluetooth.startMagnetometerService()
bluetooth.startAccelerometerService()
bluetooth.startLEDService()
bluetooth.startUartService()
vanGogh.penUp()
vanGogh.penDown()
vanGogh.penUp()
let cmds: number[][] = [[3]]

let cmd:string = ""
let itCnt = 0
let readMode = false
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function() {
    let data: string = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    console.log(data)
    if (readMode) {
        itCnt++
        bluetooth.uartWriteString("%rp"+itCnt)
        control.inBackground(() => { music.playTone(Note.G5, 100);})
        cmd+=data
        if (data[data.length-1] == "%") {
            bluetooth.uartWriteString("%rend")
            control.inBackground(() => { music.playTone(Note.E3, 100); music.playTone(Note.C3, 100) })
            console.log(cmd)
            drawTurtle(JSON.parse(cmd.slice(1, -1)))
        }
    } else if (data[0] == "%") {
        bluetooth.uartWriteString("%rsta")
        itCnt = 1
        control.inBackground(() => {music.playTone(Note.C3, 100); music.playTone(Note.E3, 100)})
        cmd = data
        readMode = true
    } else {
        basic.showString(data)
    }
})
bluetooth.onBluetoothConnected(function() {
    music.playTone(Note.A4, 100)
})
bluetooth.onBluetoothDisconnected(function() {
    music.playTone(Note.C3, 100)
})

