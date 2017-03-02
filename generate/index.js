const config = require('./config')
const fs = require('fs')
const path = require('path')
const marked = require('marked')
const moment = require('moment')
const crypto = require('crypto')
const fm = require('front-matter')

const articleRoot = path.join(__dirname, '..' + config.articleRoot)

// load highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    return require('highlight.js')
      .highlightAuto(code, [lang])
      .value
      .split('\n')
      .map(v => `<span class="line">${v}</span>`)
      .join('\n')
  }
})

/**
 * map articles folder to array
 * @param   [string]  d  folder
 * @returns [array] markdown files array
 */
const mapDir = d => {
  return fs.readdirSync(d)
    .filter(p => fs.statSync(path.join(d, p)).isFile())
    .filter(file => path.extname(file) === '.md')
    .map(p => ({
      name: path.basename(p, '.md'),
      path: path.join(d, p)
    }))
}

/**
 * get front matter
 * @param   [string]  s  markdown contents
 * @returns [object] like this:
 * {
 *   attributes: {
 *     title: 'Just hack\'n',
 *     description: 'Nothing to see here'
 *   },
 *   body: '\nThis is some text about some stuff that happened sometime ago',
 *   frontmatter: 'title: Just hack\'n\ndescription: Nothing to see here'
 * }
 */
const frontMatter = s => {
  return fm(s)
}

/**
 * generate contents of markdown
 * @param   [object] conf configs
 */
const genContent = conf => {
  const r = {
    contents: {},
    tags: {},
    contentsSortedByTime: []
  }
  const fileList = mapDir(articleRoot)

  fileList.forEach(p => {
    const { attributes, body } = frontMatter(fs.readFileSync(p.path, {
      encoding: 'utf-8'
    }))

    if ([attributes.title, attributes.date].some(v => !v)) {
      throw new Error(`Lose front matter in ${p.path}`)
    }

    const articleMeta = {
      title: attributes.title,
      desc: attributes.desc ? attributes.desc : '',
      cover: attributes.cover ? attributes.cover : '',
      author: attributes.author ? attributes.author : 'Jason',
      cc: attributes.cc ? attributes.cc : '署名-非商业性使用-禁止演绎 3.0 国际',
      mtime: moment(fs.statSync(p.path).mtime).format('YYYY-MM-DD HH:mm:ss'),
      date: moment(attributes.date).utcOffset(0).format('YYYY-MM-DD HH:mm:ss'),
      tags: attributes.tags,
      name: p.name,
      url: conf.assetsPublicPath + 'static/articles/' + p.name + '.md',
      hash: crypto.createHash('sha1').update(body).digest('hex')
    }

    r.contents[p.name] = articleMeta

    if (attributes.tags) {
      attributes.tags.forEach(v => {
        if (r.tags[v]) {
          r.tags[v].push(p.name)
        } else {
          r.tags[v] = [p.name]
        }
      })
    }

    // save markdown to dist
    if (!fs.existsSync(conf.assetsRoot + '/articles/')) {
      fs.mkdirSync(conf.assetsRoot + '/articles/')
    }

    fs.writeFileSync(
      conf.assetsRoot + '/articles/' + p.name + '.md',
      marked(body),
      {
        encoding: 'utf-8',
        flag: 'w'
      })
  })

  // sort contents
  r.contentsSortedByTime = Object.keys(r.contents)
  r.contentsSortedByTime.sort((now, next) => {
    if (moment(r.contents[now].date).isBefore(r.contents[next].date)) {
      return 1
    } else if (moment(r.contents[now].date).isAfter(r.contents[next].date)) {
      return -1
    } else {
      return 0
    }
  })

  // sort tags
  Object.keys(r.tags).forEach(v => {
    r.tags[v] = r.tags[v].sort((now, next) => {
      if (moment(r.contents[now].date).isBefore(r.contents[next].date)) {
        return 1
      } else if (moment(r.contents[now].date).isAfter(r.contents[next].date)) {
        return -1
      } else {
        return 0
      }
    })
  })

  // generate contents and output to dist
  fs.writeFileSync(
    conf.assetsRoot + '/js/_res_.js',
    `window.__RES__ = JSON.parse('${JSON.stringify(r)}')`,
    {
      encoding: 'utf-8',
      flag: 'w'
    })
}

module.exports = genContent
