// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./components/App.vue";
import Presentation from "./components/Presentation.vue";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    { path: "/", component: Presentation },
    { path: "/app", component: App }
  ]
});

const BaseVue = Vue.extend({ router });

new Vue({
  router,
  el: "#app",
  components: { Presentation, App },
  template: `<router-view/>`
});

Array.prototype.forEach.call(document.querySelectorAll(".app"), node => {
  new BaseVue({
    el: node
  });
});
