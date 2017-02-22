const config = require('./config')
const fs = require('fs')
const path = require('path')
const fm = require('front-matter')

const articleRoot = path.join(__dirname, '..' + config.articleRoot)

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
    contents: [],
    tags: {}
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
      date: attributes.date,
      name: p.name,
      url: conf.assetsPublicPath + 'static/articles/' + p.name + '.md'
    }

    r.contents.push(articleMeta)

    if (attributes.tags) {
      attributes.tags.forEach(v => {
        if (r.tags[v]) {
          r.tags[v].push(articleMeta)
        } else {
          r.tags[v] = [articleMeta]
        }
      })
    }

    // save markdown to dist
    if (!fs.existsSync(conf.assetsRoot + '/articles/')) {
      fs.mkdirSync(conf.assetsRoot + '/articles/')
    }

    fs.writeFileSync(
      conf.assetsRoot + '/articles/' + p.name + '.md',
      body,
      {
        encoding: 'utf-8',
        flag: 'w'
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
