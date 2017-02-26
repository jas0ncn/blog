<template>
  <div class="page tags">
    <Vheader></Vheader>
    <div class="flex row j-center tags-container">
      <router-link
        tag="div"
        class="tag"
        :to="{ path: `/tags/${tag}` }"
        v-for="tag in tags"
        :class="tag.replace('.', '-')"
        >{{ tag }}</router-link>
    </div>
    <div class="flex column a-center j-center footer">
      <a href="https://github.com/jas0ncn/blog" target="_blank">
        <img src="/static/images/github.svg">
      </a>
      <p class="copyright">Copyright © 2017 Jason's Blog - 粤ICP备 14094574 号</p>
    </div>
  </div>
</template>

<script>
import Vheader from '../../components/header'

const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  name: 'tags',
  data: () => ({
    tags: deepClone(Object.keys(window.__RES__.tags))
  }),
  components: {
    Vheader
  },
  mounted () {
    this.$emit('finish', 'success')
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
