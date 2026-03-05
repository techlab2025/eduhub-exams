import "./assets/styles/main.min.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import router from "./router";
// import "./style.css";
import App from "./App.vue";

import { createI18n } from "vue-i18n";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
});

createApp(App)
  .use(PrimeVue)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount("#app");
