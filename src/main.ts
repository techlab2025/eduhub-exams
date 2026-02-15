import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import router from "./router";
import "./style.css";
import App from "./App.vue";

createApp(App).use(PrimeVue).use(createPinia()).use(router).mount("#app");