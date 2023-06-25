import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('main', () => {
  let status = {
    mode: "not-connected",
    icon: "!",
    text: "Připojte zařízení micro:bit pomocí bluetooth."
  }
  let connection = reactive({
    device: {},
    deviceInfo: {}
  })

  return { status, connection}
})
