import Vue from 'vue'
// import Vuex from 'vuex'
// 自己实现的x-vuex插件
import Vuex from './x-vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
    },
    mutations: {
        add(state) {
            state.count++;
        }
    },
    actions: {
        add({ commit }) {
            setTimeout(() => {
                commit('add');
            }, 2000);
        }
    },
    modules: {
    },
    getters: {
        doubleCount: state => {
            return state.count * 2;
        }
    },
})
