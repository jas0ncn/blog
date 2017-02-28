<template>
  <div class="page article">
    <header
      class="flex header"
      :class="{ 'have-cover': !!article.cover }"
      :style="{
        'background-image': `url(${article.cover})`
      }">
      <div class="title">
        <h1>{{ article.title }}</h1>
        <p>发布于：{{ article.date }}</p>
      </div>
      <router-link :to="{ path: '/' }" tag="div" class="nav">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40">
          <path d="M774.327684 466.559277l-359.779797 0.322531L524.880994 358.559096c18.440678-18.022689 18.440678-47.248633 0-65.271322-18.446463-18.027028-48.343503-18.027028-66.789966-0.004339L273.231548 474.785989c-1.988701 1.411616-3.886282 2.982328-5.678282 4.733831-1.942418 1.899028-3.666441 3.92678-5.202441 6.04565-5.870644 7.694463-9.344723 17.237333-9.344723 27.575684 0 16.475119 8.835616 30.92104 22.124475 39.089898l182.960452 179.626667c18.446463 18.028475 48.343503 18.028475 66.789966 0 18.440678-18.022689 18.440678-47.248633 0-65.271322l-109.388655-107.395616 358.835345-0.316746c26.078734 0 47.225492-20.666576 47.225492-46.158102S800.406418 466.559277 774.327684 466.559277L774.327684 466.559277zM774.327684 466.559277" ></path>
          <path d="M512 92.564972c231.646734 0 419.435028 187.786847 419.435028 419.435028 0 231.646734-187.788294 419.435028-419.435028 419.435028-231.648181 0-419.435028-187.788294-419.435028-419.435028C92.564972 280.351819 280.351819 92.564972 512 92.564972M512 0c-69.079503 0-136.139932 13.550644-199.322757 40.274441-60.980068 25.792362-115.725017 62.696859-162.716203 109.688045-46.991186 46.991186-83.895684 101.736136-109.686599 162.716203C13.550644 375.860068 0 442.920497 0 512s13.550644 136.139932 40.274441 199.322757c25.792362 60.978621 62.696859 115.725017 109.686599 162.716203 46.991186 46.991186 101.737582 83.895684 162.716203 109.688045C375.860068 1010.450802 442.920497 1024 512 1024s136.139932-13.549198 199.322757-40.274441c60.978621-25.792362 115.725017-62.696859 162.716203-109.688045s83.895684-101.737582 109.688045-162.716203C1010.450802 648.139932 1024 581.079503 1024 512s-13.549198-136.139932-40.274441-199.322757c-25.792362-60.980068-62.696859-115.725017-109.688045-162.716203-46.991186-46.991186-101.737582-83.895684-162.716203-109.686599C648.139932 13.550644 581.079503 0 512 0L512 0z"></path>
        </svg>
      </router-link>
      <div class="mask"></div>
    </header>
    <div class="main-content" v-html="html"></div>
    <div class="flex column j-center cc">
      <p>文章名：{{ article.title }}</p>
      <p>作者：{{ article.author }}</p>
      <p>
        标签：<router-link
          class="tag"
          v-for="(tag, idx) in article.tags"
          :key="idx"
          :to="'/tags/' + tag">{{ tag }}</router-link>
      </p>
      <p>发布时间：{{ article.date }}</p>
      <p>最后编辑时间：{{ article.mtime }}</p>
      <p>版权声明：<a href="https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh" target="_blank">{{ article.cc }}</a></p>
      <p>原文链接：<a :href="window.location.href" target="_blank">{{ window.location.href }}</a></p>
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
import axios from 'axios'

const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  async beforeRouteEnter (to, from, next) {
    const article = deepClone(window.__RES__).contents[to.params.name]

    document.title = `${article.title} - Jason's Blog`

    try {
      // get cache
      const cache = window.localStorage.getItem(article.hash)
      if (cache) {
        return next(vm => {
          vm.$emit('finish', 'success')
          vm.$data.html = cache
          vm.$data.article = article

          // wait for animation
          setTimeout(() => {
            document.body.scrollTop = 0
          }, 500)
        })
      }

      // load file when don't have cache
      const res = await axios.get(article.url)
      const html = res.data

      // save to localStorage
      window.localStorage.setItem(article.hash, html)

      next(vm => {
        vm.$emit('finish', 'success')
        vm.$data.html = html
        vm.$data.article = article

        // wait for animation
        setTimeout(() => {
          document.body.scrollTop = 0
        }, 500)
      })
    } catch (e) {
      console.error(e)
      next(vm => {
        vm.$emit('finish', 'error')
        vm.$data.html = undefined
        vm.$data.article = undefined

        // wait for animation
        setTimeout(() => {
          document.body.scrollTop = 0
        }, 500)
      })
    }
  },
  data: () => ({
    html: '',
    article: {},
    window
  })
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>

<style lang="less">
@import '../../assets/less/markdown.less';
</style>
