<template>
  <div id="app">
    <!-- 路由匹配到的组件渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
};
</script>

<style lang="less" >
html,
body,
h3,
p {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: #1067d1;
  cursor: pointer;
}
</style>
