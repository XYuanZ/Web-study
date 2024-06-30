import Link from './xrouter-link';
import View from './xrouter-view';

let Vue;

// 实现一个VueRouter类,是一个插件
class VueRouter {
    constructor(options) {
        this.$options = options;

        // 缓存path和route映射关系
        // this.routeMap = {};
        // this.$options.routes.forEach(route => {
        //     this.routeMap[route.path] = route;
        // });

        // 1.保存当前hash到current
        // current必须是响应式的数据
        // const current = window.location.hash.slice(1) || '/';
        // Vue.util.defineReactive(this, 'current', current);

        this.current = window.location.hash.slice(1) || '/';
        Vue.util.defineReactive(this, 'matched', []);
        // match方法可以递归遍历路由表，获取匹配关系数组
        this.match();


        // 2.监听hash变化
        window.addEventListener('hashchange', () => {
            // 3.更新current(获取#后面的部分)
            this.onHashChange();
        });
    }
    match(routes) {
        routes = routes || this.$options.routes;
        for (const route of routes) {
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route);
                return;
            }

            // /about/info
            if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
                this.matched.push(route);
                if (route.children) {
                    this.match(route.children);
                }
                return;
            }
        }
    }

    onHashChange() {
        this.current = window.location.hash.slice(1);
        this.matched = [];
        this.match();
        console.log("matched", this.matched);
    }
}

// 安装插件，插件要实现install方法，会在use被调用时执行
// 参数1：_Vue，就是Vue构造函数
VueRouter.install = function (_Vue) {
    // 保存vue实例
    Vue = _Vue;

    // 使用全局混入Vue.mixin(), 将router实例挂载过程延迟到Vue实例构建之后
    Vue.mixin({
        beforeCreate() {
            // 判断当前实例中是否有router属性，如果有则挂载到Vue实例上
            if (this.$options.router) {
                // 将路由对象挂载到Vue实例的$route属性上
                Vue.prototype.$router = this.$options.router;
            }
        },
    });

    // 实现两个全局组件route-view和route-link
    Vue.component('router-view', View);
    Vue.component('router-link', Link);
}
export default VueRouter;