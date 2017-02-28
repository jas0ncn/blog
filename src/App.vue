<template>
  <div id="app">
    <loading-bar
      :onErrorDone="errorDone"
      :onProgressDone="progressDone"
      :progress="progress"
      :error="error"/>
    <transition name="fade">
      <keep-alive>
        <router-view @finish="loaded"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import loadingBar from 'vue2-loading-bar'

export default {
  data: () => ({
    progress: 0,
    error: false,
    interval: null
  }),
  methods: {
    errorDone () {
      this.error = false
    },
    progressDone () {
      this.progress = 0
    },
    loaded (status) {
      clearInterval(this.interval)
      if (status === 'error') {
        this.error = true
      } else {
        this.progress = 100
      }
    }
  },
  components: {
    loadingBar
  },
  watch: {
    '$route' (to, from) {
      this.progress = 1
      this.interval = setInterval(() => {
        if (this.progress >= 80) clearInterval(this.interval)
        this.progress += 3
      }, 200)
    }
  }
}
</script>

<style lang="less">
@import './assets/less/_reset.less';
@import './assets/less/common.less';
@import './assets/less/animations.less';
</style>

<style scoped>
@import './assets/less/loading-bar.css';
</style>
