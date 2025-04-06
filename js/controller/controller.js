'use strict'

const CLOUD_NAME = 'dd2cikhwd'
const UPLOAD_PRESET = 'CanvasUpload'

function onImgSelect(imgId) {
  const img = gImgs.find(img => img.id === imgId)
  gCurrImg = new Image()
  gCurrImg.src = img.url
  gCurrImg.onload = () => {
    resizeCanvasToImage()
    gMeme.selectedImgId = imgId
    gMeme.selectedLineIdx = 0
    gMeme.lines = [
      {
        txt: '',
        size: 30,
        color: 'white',
        align: 'center',
        pos: { x: gElCanvas.width / 2, y: 50 },
        isDrag: false,
        rotate: 0,
        dragOffset: null
      }
    ]
    showEditor()
    renderMeme()
    hideGallery()
  }
}

function hideGallery() {
  document.querySelector('.gallery').classList.add('hidden')
}

function onBackToGallery() {
  document.querySelector('.gallery-section').classList.remove('hidden')
  document.querySelector('.editor-section').classList.add('hidden')
  document.querySelector('.gallery').classList.remove('hidden')
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
  const canvasCenterX = gElCanvas.width / 2
  const y = 100 + gMeme.lines.length * 50

  const newLine = {
    txt: '',
    size: 30,
    color: 'white',
    align: 'center',
    pos: { x: canvasCenterX, y },
    isDrag: false,
    rotate: 0,
    dragOffset: null
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

function onRotateLine(diff) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  line.rotate = (line.rotate || 0) + diff
  renderMeme()
}


function onAddSticker(sticker) {
  const canvasCenterX = gElCanvas.width / 2
  const y = 100 + gMeme.lines.length * 50

  const newLine = {
    txt: sticker,
    size: 40,
    color: 'white',
    align: 'center',
    pos: { x: canvasCenterX, y },
    isDrag: false,
    rotate: 0,
    dragOffset: null
  }

  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  renderMeme()
}


function onSetAlign(align) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  line.align = align
  line.pos.x = align === 'left' ? 20 : align === 'right' ? gElCanvas.width - 20 : gElCanvas.width / 2
  renderMeme()
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
      isDrag: false,
      rotate: 0,
      dragOffset: null
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

function onPointerDown(ev) {
  const pos = getEvPos(ev)
  const clickedLineIdx = getLineClickedIdx(pos)
  if (clickedLineIdx === -1) return

  gMeme.selectedLineIdx = clickedLineIdx
  const line = gMeme.lines[clickedLineIdx]
  line.isDrag = true

  gMeme.dragOffset = {
    x: pos.x - line.pos.x,
    y: pos.y - line.pos.y
  }

  document.body.style.cursor = 'grabbing'
}

function onPointerMove(ev) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  if (!line || !line.isDrag || !gMeme.dragOffset) return

  const pos = getEvPos(ev)
  line.pos.x = pos.x - gMeme.dragOffset.x
  line.pos.y = pos.y - gMeme.dragOffset.y

  renderMeme()
}

function onPointerUp() {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  if (line) line.isDrag = false
  gMeme.dragOffset = null
  document.body.style.cursor = 'default'
}



function onDownloadCanvas(ev) {
  const dataUrl = gElCanvas.toDataURL()

  ev.href = dataUrl
  ev.download = 'My-Meme-Generate.jpg'
}

function onSaveMeme() {
  const selectedIdx = gMeme.selectedLineIdx
  
  gMeme.selectedLineIdx = -1
  renderMeme()

  const dataUrl = gElCanvas.toDataURL()
  const savedMemes = loadFromStorage(STORAGE_KEY) || []

  const memeToSave = {
    id: makeId(),
    imgUrl: dataUrl,
    previewUrl: dataUrl,
    createdAt: Date.now(),
    meme: structuredClone(gMeme),
    cloudUrl: null
  }

  uploadImg(dataUrl, (uploadedImgUrl) => {
    memeToSave.cloudUrl = uploadedImgUrl
    savedMemes.push(memeToSave)
    saveToStorage(STORAGE_KEY, savedMemes)
  })

  gMeme.selectedLineIdx = selectedIdx
  renderMeme()
}




function uploadImg(dataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('file', dataUrl)
  formData.append('upload_preset', UPLOAD_PRESET)

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  fetch(url, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      console.log('Uploaded to Cloudinary:', res.secure_url)
      if (onSuccess) onSuccess(res.secure_url)
    })
    .catch(err => {
      console.error('Upload error:', err)
      alert('Upload failed. Try again.')
    })
}



function onUploadToFB(encodedUrl) {
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedUrl}`
  window.open(fbUrl, '_blank')
}

function onFilterGallery(keyword) {
  const imgs = getImgs().filter(img =>
    img.keywords.some(word => word.toLowerCase().includes(keyword.toLowerCase()))
  )
  renderGallery(imgs)
}


function onClearFilter() {
  document.getElementById('filter-input').value = ''
  renderGallery(gImgs)
}

function onKeywordClick(keyword) {
  if (!gKeywordSearchCountMap[keyword]) gKeywordSearchCountMap[keyword] = 1
  else gKeywordSearchCountMap[keyword]++

  onFilterGallery(keyword)
  renderKeywordOptions()
}

function onUserUpload(ev) {
  const reader = new FileReader()

  reader.onload = function (event) {
    const imgUrl = event.target.result
    gCurrImg = new Image()
    gCurrImg.src = imgUrl

    gCurrImg.onload = () => {
      resizeCanvasToImage()
      gMeme.selectedImgId = null
      gMeme.selectedLineIdx = 0
      gMeme.lines = [
        {
          txt: '',
          size: 30,
          color: 'white',
          align: 'center',
          pos: { x: gElCanvas.width / 2, y: 50 },
          isDrag: false,
          rotate: 0,
          dragOffset: null
        }
      ]
      showEditor()
      renderMeme()
    }
  }

  const file = ev.target.files[0]
  if (file) reader.readAsDataURL(file)
}
