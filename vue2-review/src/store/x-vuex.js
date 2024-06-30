let Vue;

class Store {
    constructor(options) {
        // 保留选项
        this._mutaions = options.mutations || {};
        this._actions = options.actions || {};

        // 做响应式状态state属性
        // Vue初始化的时候，会对data做响应式处理
        // 同时它还会做代理，data中响应式属性会被代理到Vue实例上
        this._vm = new Vue({
            data: {
                // 加上两个$$是为了防止和vue的内部属性冲突，同时就不会代理
                $$state: options.state,
            }
        });

        // 绑定上下文
        this.commit = this.commit.bind(this);
        this.dispatch = this.dispatch.bind(this);
    }

    // 给用户暴漏接口
    get state() {
        return this._vm._data.$$state;
    }

    set state(v) {
        console.warn('Please use replaceState to reset state.');
    }

    commit(type, payload) {
        const entry = this._mutaions[type];
        if (!entry) {
            console.log('unknow mutation entry.');
        }
        entry(this.state, payload);
    }

    dispatch(type, payload) {
        const entry = this._actions[type];
        if (!entry) {
            console.log('unknow mutation entry.');
        }
        entry(this, payload);
    }
}

function install(_Vue) {
    Vue = _Vue;
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        },
    });
}

export default { Store, install };