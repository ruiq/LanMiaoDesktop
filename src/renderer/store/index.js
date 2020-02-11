import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'
import carPlugin from './plugins/car'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    modules,
    plugins: [
        carPlugin,
        // createPersistedState(), // 需要统一，上面的todoPlugin没有括号，所以用变量
        createPersistedState,// 将state持久化到ls的插件
        createSharedMutations// 在各个windows间共享mutations的插件
    ],
    strict: process.env.NODE_ENV !== 'production'
})
