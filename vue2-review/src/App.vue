<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about/info">About</router-link>
    </div>
    <p @click="$store.commit('add')">
      default count： {{ this.$store.state.count }}
    </p>
    <p @click="$store.dispatch('add')">
      async count： {{ this.$store.state.count }}
    </p>
    <p @click="$store.dispatch('add')">
      double count：{{ this.$store.getters.doubleCount }}
    </p>
    <!-- 存放页面内容容器 -->
    <router-view />
  </div>
</template>
<script>
export default {}
</script>
<style>
.nav {
  text-align: center;
  font-size: 40px;
}
</style>