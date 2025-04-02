'use strict'

var gElCanvas
var gCtx
var gCurrImg
var gLastPos = null

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

function initCanvas() {
  gElCanvas = document.getElementById('meme-canvas')
  gCtx = gElCanvas.getContext('2d')
  renderGallery()
  
  gElCanvas.addEventListener('click', onCanvasClick)

  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mouseup', onUp)

  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchend', onUp)

  document.getElementById('txt-line').value = ''
  document.querySelector("input[type='color']").value = '#ffffff'

  renderMeme()
}

function renderGallery() {
  const elGallery = document.querySelector('.gallery')
  elGallery.innerHTML = gImgs.map(img => `<img src="${img.url}" onclick="onImgSelect(${img.id})" />`).join('')
}

function onImgSelect(imgId) {
  const img = gImgs.find(img => img.id === imgId)
  gCurrImg = new Image()
  gCurrImg.src = img.url
  gCurrImg.onload = () => {
    gElCanvas.width = gCurrImg.naturalWidth
    gElCanvas.height = gCurrImg.naturalHeight

    gMeme.selectedImgId = imgId
    gMeme.selectedLineIdx = 0
    gMeme.lines = [
      {
        txt: '',
        size: 30,
        color: 'white',
        align: 'center',
        pos: { x: gElCanvas.width / 2, y: 50 },
        isDrag: false
      }
    ]

    showEditor()
    renderMeme()
  }
}

function showEditor() {
  document.querySelector('.gallery-section').classList.add('hidden')
  document.querySelector('.editor-section').classList.remove('hidden')
}

function onBackToGallery() {
  document.querySelector('.gallery-section').classList.remove('hidden')
  document.querySelector('.editor-section').classList.add('hidden')
}

function resizeCanvasToDisplaySize() {
    const rect = gElCanvas.getBoundingClientRect()
    const { width, height } = rect
  
    if (gElCanvas.width !== width || gElCanvas.height !== height) {
      gElCanvas.width = width
      gElCanvas.height = height
    }
  }
  

function renderMeme() {
    resizeCanvasToDisplaySize()
    const { width, height } = gElCanvas
    gCtx.clearRect(0, 0, width, height)
    gCtx.drawImage(gCurrImg, 0, 0, width, height)

    gMeme.lines.forEach((line, idx) => {
    const fit = fitTextToCanvas(line.txt, line.size, width * 0.9)
    line.size = fit.size

    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.textAlign = line.align
    gCtx.textBaseline = 'middle'

    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
  })

  const currLine = gMeme.lines[gMeme.selectedLineIdx]
  document.getElementById('txt-line').value = currLine.txt
}

function onSetLineTxt(txt) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  line.txt = txt
  renderMeme()
}

function onChangeFontSize(diff) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  line.size += diff
  renderMeme()
}

function onSetColor(color) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.color = color
    renderMeme()
}
  
function onAddLine() {
    const y = 100 + gMeme.lines.length * 50
    const newLine = {
      txt: '',
      size: 30,
      color: 'white',
      align: 'center',
      pos: { x: gElCanvas.width / 2, y },
      isDrag: false
    }
  
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    renderMeme()
  
    document.getElementById('txt-line').value = ''
    document.querySelector("input[type='color']").value = '#ffffff'
  }
  

function onSwitchLine() {
  gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
  renderMeme()
}

function onSetAlign(align) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  line.align = align
  line.pos.x = align === 'left' ? 20 : align === 'right' ? gElCanvas.width - 20 : gElCanvas.width / 2
  renderMeme()
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
  

function onDown(ev) {
  const pos = getEvPos(ev)
  const clickedLineIdx = getLineClickedIdx(pos)
  if (clickedLineIdx === -1) return

  gMeme.selectedLineIdx = clickedLineIdx
  gMeme.lines[clickedLineIdx].isDrag = true
  gLastPos = pos
  document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  if (!line.isDrag) return

  const pos = getEvPos(ev)
  const dx = pos.x - gLastPos.x
  const dy = pos.y - gLastPos.y

  line.pos.x += dx
  line.pos.y += dy
  gLastPos = pos
  renderMeme()
}

function onUp() {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  if (line) line.isDrag = false
  document.body.style.cursor = 'default'
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

function onDeleteLine() {
  if (!gMeme.lines.length) return

  gMeme.lines.splice(gMeme.selectedLineIdx, 1)
  if (!gMeme.lines.length) {
    gMeme.lines.push({
      txt: '',
      size: 30,
      color: 'white',
      align: 'center',
      pos: { x: gElCanvas.width / 2, y: 50 },
      isDrag: false
    })
    gMeme.selectedLineIdx = 0
  } else {
    gMeme.selectedLineIdx %= gMeme.lines.length
  }
  renderMeme()
}

function onCanvasClick(ev) {
    const pos = getEvPos(ev)
    const clickedLineIdx = getLineClickedIdx(pos)
    if (clickedLineIdx === -1) return
  
    gMeme.selectedLineIdx = clickedLineIdx
    renderMeme()
  
    const line = gMeme.lines[clickedLineIdx]
    document.getElementById('txt-line').value = line.txt
    document.querySelector("input[type='color']").value = line.color
  }
  