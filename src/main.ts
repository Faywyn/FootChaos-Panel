import { createApp, ref } from 'vue'
import router from './router'

import App from './App.vue'
import type { AnyObject } from 'node_modules/chart.js/dist/types/basic'
import axios from 'axios'
import { API_PORT } from './config'
import type { apiCalls, valueof } from './dev/types'

const app = createApp(App)
app.use(router)
app.mount('#app')


class ApiManager {
  private apiCalls: apiCalls = {
    "/training": {
      method: "GET",
      refreshRate: 10000,
      lastCall: 0,
    },
    "/training/list": {
      method: "GET",
      refreshRate: 30000,
      lastCall: 0,
    },
    "/training/create": {
      method: "POST",

    },
    "/training/start": {
      method: "POST",
    },
    "/training/end": {
      method: "POST"
    }
  }

  constructor() { }

  call<T>(name: keyof apiCalls, params: AnyObject, force: boolean): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const call = this.apiCalls[name];
      const pReq = Object.keys(params).map(x => `${x}=${params[x]}`).join(`&`)
      const req = `http://localhost:${API_PORT}${name}?${pReq}`

      if (call.method === "POST") {
        axios.post(req)
          .then(e => resolve(e.data as T))
          .catch(e => reject(e))
        return;
      }

      if (force || call.lastCall + call.refreshRate < Date.now() || call.data == undefined) {
        axios.get(req)
          .then(e => {
            // @ts-ignore
            this.apiCalls[name].data = e.data;
            // @ts-ignore
            this.apiCalls[name].lastCall = Date.now();
            resolve(e.data as T)
          })
          .catch(e => reject(e))
        return
      }

      resolve(call.data as T)
    })
  }
}

export const apiManager = new ApiManager();
