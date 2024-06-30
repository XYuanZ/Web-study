import Vue from 'vue'
// vue官方的vue-router插件
// import VueRouter from 'vue-router'
// 自己实现的x-router插件
import VueRouter from './x-router.js'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        children: [
            {
                path: 'info',
                component: () => import('@/views/Info.vue'),
            }
        ]
    },
]

const router = new VueRouter({
    routes
})

export default router