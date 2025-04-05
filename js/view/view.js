'use strict'

let gKeywordSearchCountMap = {}

function renderGallery(imgs = gImgs) {
  const strHTMLs = imgs.map(img => `
    <img src="${img.url}" onclick="onImgSelect(${img.id})" />
  `)
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function renderKeywordOptions() {
  const elDatalist = document.getElementById('keywords')

  const allKeywords = gImgs.flatMap(img => img.keywords)
  const uniqueKeywords = [...new Set(allKeywords)]

  elDatalist.innerHTML = uniqueKeywords.map(keyword => `
    <option value="${keyword}">
  `).join('')

  uniqueKeywords.forEach(keyword => {
    if (!gKeywordSearchCountMap[keyword]) gKeywordSearchCountMap[keyword] = 1
  })

  renderKeywordsCloud()
}


function renderKeywordsCloud() {
  const elKeywords = document.getElementById('keywords-container')

  const keywordCountMap = {}

  gImgs.forEach(img => {
    img.keywords.forEach(keyword => {
      if (!keywordCountMap[keyword]) keywordCountMap[keyword] = 1
      else keywordCountMap[keyword]++
    })
  })

  const maxCount = Math.max(...Object.values(keywordCountMap))

  elKeywords.innerHTML = Object.entries(keywordCountMap).map(([keyword, count]) => {
    const minFontSize = 14
    const maxFontSize = 36
    const fontSize = minFontSize + (count / maxCount) * (maxFontSize - minFontSize)

    return `<span style="font-size:${fontSize}px" onclick="onKeywordClick('${keyword}')">${keyword}</span>`
  }).join(' ')
}

function showEditor() {
  document.querySelector('.gallery-section').classList.add('hidden')
  document.querySelector('.editor-section').classList.remove('hidden')
}

function renderStickers() {
  const elStickerList = document.querySelector('.sticker-list')
  elStickerList.innerHTML = gStickers.map(sticker => `
    <button class="sticker-btn" onclick="onAddSticker('${sticker}')">${sticker}</button>
  `).join('')
}
