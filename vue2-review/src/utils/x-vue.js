
class Vue {
    constructor(options) {
        // 1.响应式
        this.$options = options;
        this.$data = options.data;
        observer(this.$data);

        // 1.1代理
        proxy(this);

        // 2.编译
        new Compile(options.el, this);
    }
}

// 将$data中的属性代理到Vue实例上
function proxy(vm) {
    Object.keys(vm.$data).forEach((key) => {
        // 代理
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key];
            },
            set(newVal) {
                vm.$data[key] = newVal;
            }
        });
    });
}

function defineReactive(obj, key, val) {
    observer(val);
    // 创建Dep实例
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        get() {
            // 判断一下Dap.target是否存在，存在则说明当前是在watcher中调用,即收集依赖
            Dep.target && dep.addSub(Dep.target);
            console.log("get", val);
            return val;
        },
        set(newVal) {
            if (val === newVal) return;
            val = newVal;
            console.log("set", newVal);
            dep.notify();
            // 简单粗暴的更新所有watcher
            // watchers.forEach((watcher) => watcher.update());
        }
    });
}

function observer(data) {
    if (!data || typeof data !== 'object' || data === null) return;
    new Observer(data);
}

class Observer {
    constructor(data) {
        this.data = data;
        if (Array.isArray(data)) {
            // 如果是数组，则遍历数组中的每一项，将其转化为getter/setter
            this.org(data);
        } else {
            this.walk(data);
        }
    }
    // 遍历data对象，将每个属性都转化为getter/setter
    walk(obj) {
        if (!obj || typeof obj !== 'object') return;
        Object.keys(obj).forEach((key) => {
            defineReactive(obj, key, obj[key]);
        });
    }
    // 数组响应式处理
    org(data) {
        // 1. 替换数组原型中的7个方法
        const orginalProto = Array.prototype;
        // 备份一份，修改备份
        const arrProto = Object.create(orginalProto);
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method) => {
            arrProto[method] = function () {
                // 1. 调用原方法 ，并获取返回值
                const res = orginalProto[method].apply(this, arguments);
                // 2. 覆盖操作：通知视图更新
                console.log('数组发生变化');
                return res;
            };
        });

        data.__proto__ = arrProto;
        // 对数组内部元素执行响应化
        const keys = Object.keys(data);
        for (let i = 0; i < data.length; i++) {
            observer(data[i]);
        }
    }

}

class Compile {
    constructor(el, vm) {
        this.$vm = vm;

        // 遍历el中的所有子节点
        // 1.将模板编译成虚拟DOM
        this.$el = document.querySelector(el);
        this.compile(this.$el);
        // 2.将虚拟DOM渲染到页面中
        // this.render(vdom);
    }
    compile(el) {
        el.childNodes.forEach((node) => {
            if (node.nodeType === 1) {
                // 1.元素节点
                // 递归
                if (node.childNodes.length > 0) this.compile(node);
                this.compileElement(node);
            } else if (this.isInter(node)) {
                // 2.插值绑定文本节点{{xxx}}
                this.compileText(node);
            }
        });
    }

    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    isDir(name) {
        return name.startsWith('v-');
    }
    isEvent(name) {
        // return name.startsWith('@');
        return name.indexOf('@') === 0;
    }
    eventHandler(node, value, dir) {
        // methods: {onClick: 'onClick'}
        const fn = this.$vm.$options.methods && this.$vm.$options.methods[value];
        // 事件监听
        node.addEventListener(dir, fn.bind(this.$vm));
    }
    // upadate：给传入的node做初始化，并创建watcher负责其更新
    update(node, value, type) {
        // 1.初始化
        const fn = this[type + 'Updater'];
        fn && fn(node, this.$vm[value]);

        // 2.创建watcher实例
        new Watcher(this.$vm, value, (newValue) => {
            fn && fn(node, newValue);
        });
    }
    // 更新节点中的数据
    // 插值文本编译
    compileText(node) {
        this.update(node, RegExp.$1, 'text');
    }
    textUpdater(node, value) {
        node.textContent = value;
    }
    htmlUpdater(node, value) {
        node.innerHTML = value;
    }
    text(node, value) {
        this.update(node, value, 'text');
    }
    html(node, value) {
        this.update(node, value, 'html');
    }
    // v-model="xxx"
    model(node, value) {
        // update方法只完成赋值和更新
        this.update(node, value, 'model');
        // 事件监听
        node.addEventListener('input', e => {
            // 更新数据,新的值赋给数据
            this.$vm[value] = e.target.value;
        });
    }
    modelUpdater(node, value) {
        node.value = value;
    }
    // 编译元素节点
    compileElement(node) {
        // 获取节点的属性
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach((attr) => {
            const { name, value } = attr;
            if (this.isDir(name)) {
                // 指令
                // 获取指令执行函数并调用
                const dir = name.substring(2);
                this[dir] && this[dir](node, value);
            } else if (this.isEvent(name)) {
                // 事件 @click = "onClick"
                const dir = name.substring(1);
                // 事件监听
                this.eventHandler(node, value, dir);
            }
        });
    }
}
// const watchers = [];
// 监听器：负责页面中的一个依赖的更新
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm;
        this.key = key;
        this.updateFn = updateFn;

        // 获取一下key的值触发它的get方法，在那创建当前watcher实例和Dep实例之间的关系
        Dep.target = this;
        // 调用一次，收集依赖
        this.vm[this.key];
        Dep.target = null;
        // 收集依赖后，将watcher实例添加到watchers中,简单粗暴
        // watchers.push(this);
    }
    update() {
        this.updateFn.call(this.vm, this.vm[this.key]);
    }
}

// 订阅者：负责收集依赖
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}