let Vue;

// 实现一个VueRouter类,是一个插件
class VueRouter {
    constructor(options) {
        this.$options = options;

        // 缓存path和route映射关系
        this.routeMap = {};
        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route;
        });

        // 1.保存当前hash到current
        // current必须是响应式的数据
        const current = window.location.hash.slice(1) || '/';
        Vue.util.defineReactive(this, 'current', current);

        // 2.监听hash变化
        window.addEventListener('hashchange', () => {
            // 3.更新current(获取#后面的部分)
            this.current = window.location.hash.slice(1);
        });
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
    Vue.component('router-view', {
        render(h) {
            // 根据current获取路由表中对应的组件并渲染它
            let component = null;

            // 方法一：遍历路由表，找到匹配的组件
            // const route = this.$router.$options.routes.find(route => {
            //     return route.path === this.$router.current;
            // });

            // 方法二：使用routeMap缓存路由表
            const route = this.$router.routeMap[this.$router.current];
            if (route) {
                component = route.component;
            }
            return h(component);
        },
    });

    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true,
            },
        },
        // <a href="#/abc">abc</a>
        // <router-link to="/abc">abc</router-link>
        render(h) {
            return h('a', {
                attrs: {
                    href: '#' + this.to,
                },
            }, [this.$slots.default]);
        }
    });
}
export default VueRouter;