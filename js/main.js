function initCanvas() {
  gElCanvas = document.getElementById('meme-canvas')
  gCtx = gElCanvas.getContext('2d')


  gElCanvas.addEventListener('click', onCanvasClick)

  gElCanvas.addEventListener('pointerdown', onPointerDown)
  gElCanvas.addEventListener('pointermove', onPointerMove)
  gElCanvas.addEventListener('pointerup', onPointerUp)
  gElCanvas.addEventListener('pointerleave', onPointerUp)


  document.getElementById('txt-line').value = ''
  document.querySelector("input[type='color']").value = '#ffffff'

  renderGallery()
  renderKeywordOptions()
  renderStickers()
}

function initSavedCanvas() {
  gElCanvas = document.getElementById('meme-canvas')
  gCtx = gElCanvas.getContext('2d')

  gElCanvas.addEventListener('pointerdown', onPointerDown)
  gElCanvas.addEventListener('pointermove', onPointerMove)
  gElCanvas.addEventListener('pointerup', onPointerUp)
  gElCanvas.addEventListener('pointerleave', onPointerUp)


  document.getElementById('txt-line').value = ''
  document.querySelector("input[type='color']").value = '#ffffff'

  renderStickers()
}
