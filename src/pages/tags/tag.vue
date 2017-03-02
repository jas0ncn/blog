<template>
  <div class="page flex column index">
    <Vheader></Vheader>
    <div class="flex column list">
      <router-link
        class="flex row a-center item"
        tag="div"
        v-for="(article, idx) in list"
        :key="idx"
        :to="{ name: 'Article', params: { name: contents[article].name }}"
      >
        <div class="article-left-part">
          <h2 class="article-title">{{ contents[article].title }}</h2>
          <p class="article-desc">{{ contents[article].desc }}</p>
          <p class="flex row a-center article-release-time">
            <img class="date-icon" src="/static/images/dateicon.svg">
            <span class="date-string">{{ contents[article].date }}</span>
            <router-link
              tag="span"
              class="tag"
              v-for="(tag, i) in contents[article].tags"
              :key="i"
              v-if="i <= 8"
              :class="tag.replace('.', '-')"
              :to="`/tags/${tag}`"
            >
              {{ tag }}
            </router-link>
          </p>
        </div>
        <div class="article-cover" v-if="contents[article].cover !== ''">
          <img class="cover-image" :src="contents[article].cover">
        </div>
      </router-link>
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

const capacity = 5

export default {
  name: 'index',
  data: () => ({
    page: 1,
    // inject global contents
    list: [],
    contents: deepClone(window.__RES__.contents)
  }),
  components: {
    Vheader
  },
  beforeMount () {
    this.loadPage()
    document.title = `Jason's Blog`
    window.onscroll = () => {
      if (document.documentElement.clientHeight + document.body.scrollTop === document.body.scrollHeight) this.loadPage()
    }
  },
  mounted () {
    this.$emit('finish', 'success')
  },
  methods: {
    loadPage () {
      const maxPage = Math.ceil(window.__RES__.tags[this.$route.params.name].length / capacity)
      if (this.page > maxPage) return

      const firstPage = deepClone(
          window.__RES__.tags[this.$route.params.name]
        ).slice(
          (this.page - 1) * capacity, this.page * capacity
        )
      this.list.push(...firstPage)

      this.page++
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index/index.less';
</style>
