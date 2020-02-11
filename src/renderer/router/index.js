import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: require('@/views/Login/Login').default
        },
        {
            path: '/',
            name: 'home',
            redirect: '/home',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'home',
                // component: require('@/views/Home/Home').default
                component: require('@/views/Home/components/Car/car').default
            }]
        },
        {
            path: '/car',
            name: 'car',
            redirect: '/car/detail',
            component: require('@/components/Layout/Layout').default,
            children: [{
                name: 'car/detail',
                path: '/car/detail',
                component: require('@/views/Car/CarDetail').default
            }]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})