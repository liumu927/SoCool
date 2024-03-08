// 该文件是整个项目的入口文件

// 引入vue和app组件，app组件是所有组件的父组件
import Vue from "vue";
import Vuex from 'vuex'
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import store from "./store";
import axios from "axios";
// import { from } from 'core-js/core/array';

// 关闭vue的生产提示
Vue.config.productionTip = false;

// 挂载到原型上
Vue.prototype.$http = axios;

Vue.use(ElementUI);
Vue.use(Vuex);

router.beforeEach((to, from, next) => {
  const {
    meta: { role },
  } = to;
  if (role) {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    if (role === adminInfo.role) {
      next();
    } else {
      alert("您没有权限查看!");
    }
  } else {
    next();
  }
});

// 创建vue实例对象vm
new Vue({
  router,
  store, //将store挂载到vue实例中
  // render充当模板解析器
  render: (h) => h(App),
}).$mount("#app");

// .$mount('#app')===在{}中的 el:'#app'
