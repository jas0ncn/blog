<template>
  <div id="app">
    <transition name="fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
@import './assets/less/_reset.less';
@import './assets/less/common.less';
@import './assets/less/animations.less';
</style>
