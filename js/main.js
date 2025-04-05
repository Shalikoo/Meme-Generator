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
}
