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
      isDrag: false
    }
  ]
}

const gImgs = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  url: `imgs/${i + 1}.jpg`
}))

function getEvPos(ev) {
  const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
  let pos
  if (TOUCH_EVS.includes(ev.type)) {
    ev.preventDefault()
    const touch = ev.changedTouches[0]
    const rect = gElCanvas.getBoundingClientRect()
    pos = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  } else {
    pos = {
      x: ev.offsetX,
      y: ev.offsetY,
    }
  }
  return pos
}

function getLineClickedIdx(pos) {
  for (let i = 0; i < gMeme.lines.length; i++) {
    const line = gMeme.lines[i]
    if (!line.pos || !line.txt) continue
    gCtx.font = `${line.size}px Impact`
    gCtx.textAlign = 'center'
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size + 10
    const xStart = line.pos.x - textWidth / 2
    const xEnd = line.pos.x + textWidth / 2
    const yStart = line.pos.y - textHeight / 2
    const yEnd = line.pos.y + textHeight / 2
    if (pos.x >= xStart && pos.x <= xEnd && pos.y >= yStart && pos.y <= yEnd) {
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
