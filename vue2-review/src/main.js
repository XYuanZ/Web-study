import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

new Vue({
    // 挂载到根实例上，是为了插件安装时可以注册实例
    router,
    store,
    render: h => h(App),
}).$mount('#app')

