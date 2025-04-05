'use strict'

const STORAGE_KEY = 'saved_memes'

var gElCanvas
var gCtx
var gCurrImg
var gLastPos = null

function renderMeme() {
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

function resizeCanvasToImage() {
  if (!gCurrImg) return
  const containerWidth = document.querySelector('.canvas-container')?.clientWidth || 400
  const imgAspectRatio = gCurrImg.naturalHeight / gCurrImg.naturalWidth
  gElCanvas.width = containerWidth
  gElCanvas.height = containerWidth * imgAspectRatio
}
