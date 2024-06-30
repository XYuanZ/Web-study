<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about/info">About</router-link>
    </div>
    <button class="nav btn" @click="$store.commit('add')">
      {{ $store.state.count }}
    </button>
    <button class="nav btn" @click="$store.dispatch('add')">
      {{ $store.state.count }}
    </button>
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

.btn {
  width: 100px;
  margin-left: 10px;
}
</style>