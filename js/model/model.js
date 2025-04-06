'use strict'

var gMeme = {
  selectedImgId: null,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Your meme text',
      size: 30,
      color: 'white',
      align: 'center',
      pos: { x: 100, y: 50 },
      isDrag: false,
      rotate: 0
    }
  ]
}

const gImgs = [
  { id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat', 'animal'] },
  { id: 2, url: 'imgs/2.jpg', keywords: ['cute', 'dog', 'animal'] },
  { id: 3, url: 'imgs/3.jpg', keywords: ['baby', 'happy', 'smile'] },
  { id: 4, url: 'imgs/4.jpg', keywords: ['trump', 'politics', 'funny'] },
  { id: 5, url: 'imgs/5.jpg', keywords: ['obama', 'smile', 'politics'] },
  { id: 6, url: 'imgs/6.jpg', keywords: ['kiss', 'love', 'romantic'] },
  { id: 7, url: 'imgs/7.jpg', keywords: ['baby', 'surprised', 'cute'] },
  { id: 8, url: 'imgs/8.jpg', keywords: ['clown', 'creepy', 'funny'] },
  { id: 9, url: 'imgs/9.jpg', keywords: ['laugh', 'happy', 'man'] },
  { id: 10, url: 'imgs/10.jpg', keywords: ['obama', 'laugh', 'speech'] },
  { id: 11, url: 'imgs/11.jpg', keywords: ['sports', 'basketball', 'angry'] },
  { id: 12, url: 'imgs/12.jpg', keywords: ['haim', 'tv', 'angry'] },
  { id: 13, url: 'imgs/13.jpg', keywords: ['cheers', 'movie', 'toast'] },
  { id: 14, url: 'imgs/14.jpg', keywords: ['matrix', 'morpheus', 'movie'] },
  { id: 15, url: 'imgs/15.jpg', keywords: ['funny', 'kid', 'laugh'] },
  { id: 16, url: 'imgs/16.jpg', keywords: ['dog', 'sunglasses', 'cool'] },
  { id: 17, url: 'imgs/17.jpg', keywords: ['putin', 'politics', 'serious'] },
  { id: 18, url: 'imgs/18.jpg', keywords: ['toy story', 'buzz', 'everywhere'] },
  { id: 19, url: 'imgs/19.jpg', keywords: ['politics', 'angry', 'man'] },
  { id: 20, url: 'imgs/20.jpg', keywords: ['happy', 'smile', 'woman'] },
  { id: 21, url: 'imgs/21.jpg', keywords: ['tv', 'israel', 'celebrity'] },
  { id: 22, url: 'imgs/22.jpg', keywords: ['tv', 'meme', 'guy'] },
  { id: 23, url: 'imgs/23.jpg', keywords: ['baby', 'crying', 'sad'] },
  { id: 24, url: 'imgs/24.jpg', keywords: ['monkey', 'funny', 'animal'] },
  { id: 25, url: 'imgs/25.jpg', keywords: ['kid', 'funny', 'fail'] }
]

const gStickers = ['😜', '😍', '😂', '🔥', '🤔', '😎', '💩', '😡', '💀', '👑']


function getImgs() {
  return gImgs
}


function getEvPos(ev) {
  let pos = { x: ev.offsetX, y: ev.offsetY }

  if (ev.type.startsWith('touch')) {
    ev = ev.changedTouches[0]
    const rect = ev.target.getBoundingClientRect()
    pos = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    }
  }

  return pos
}


function getLineClickedIdx(pos) {
  for (let i = 0; i < gMeme.lines.length; i++) {
    const line = gMeme.lines[i]
    const metrics = gCtx.measureText(line.txt)

    const height = line.size
    const width = metrics.width

    let xStart
    if (line.align === 'left') xStart = line.pos.x
    else if (line.align === 'center') xStart = line.pos.x - width / 2
    else if (line.align === 'right') xStart = line.pos.x - width

    const yStart = line.pos.y - height / 2
    const xEnd = xStart + width
    const yEnd = yStart + height

    if (
      pos.x >= xStart &&
      pos.x <= xEnd &&
      pos.y >= yStart &&
      pos.y <= yEnd
    ) {
      return i
    }
  }
  return -1
}


function fitTextToCanvas(txt, fontSize, maxWidth) {
  gCtx.font = `${fontSize}px Impact`
  let metrics = gCtx.measureText(txt)
  while (metrics.width > maxWidth && fontSize > 10) {
    fontSize--
    gCtx.font = `${fontSize}px Impact`
    metrics = gCtx.measureText(txt)
  }
  return { size: fontSize, width: metrics.width }
}
