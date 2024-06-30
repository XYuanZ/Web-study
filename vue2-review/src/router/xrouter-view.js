export default {
    render(h) {
        // 标记当前router-view深度
        this.$vnode.data.routerView = true;

        let depth = 0;
        let parent = this.$parent;
        while (parent) {
            const vnodeData = parent.$vnode && parent.$vnode.data;
            if (vnodeData) {
                if (vnodeData.routerView) {
                    depth++;
                }
            }

            parent = parent.$parent;
        }


        // 根据current获取路由表中对应的组件并渲染它

        // 方法一：遍历路由表，找到匹配的组件
        // let component = null;
        // const { $options, current } = this.$router;
        // const route = $options.routes.find(route => {
        //     return route.path === .current;
        // });
        // if (route) {
        //     component = route.component;
        // }

        // 方法二：使用routeMap缓存路由表
        // const { routeMap, current } = this.$router;
        // const component = routeMap[current].component || null;

        // 方法三：使用match
        let component = null;
        const route = this.$router.matched[depth] || null;
        if (route) {
            component = route.component;
        }
        return h(component);
    }
}