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

    gCtx.save()
    gCtx.translate(line.pos.x, line.pos.y)
    gCtx.rotate((line.rotate || 0) * Math.PI / 180)

    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.textAlign = line.align
    gCtx.textBaseline = 'middle'
    gCtx.fillText(line.txt, 0, 0)
    gCtx.strokeText(line.txt, 0, 0)

    gCtx.restore()
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
