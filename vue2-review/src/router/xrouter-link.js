export default {
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
};