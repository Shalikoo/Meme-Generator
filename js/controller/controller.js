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
        rotate: 0
      }
    ]
    showEditor()
    renderMeme()
  }
}

function onBackToGallery() {
  document.querySelector('.gallery-section').classList.remove('hidden')
  document.querySelector('.editor-section').classList.add('hidden')
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
    rotate: 0
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
    rotate: 0
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
      rotate: 0
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

function onDownloadCanvas(ev) {
  const dataUrl = gElCanvas.toDataURL()

  ev.href = dataUrl
  ev.download = 'My-Meme-Generate.jpg'
}

function onSaveMeme() {
  const savedMemes = loadFromStorage(STORAGE_KEY) || []

  const memeToSave = {
    id: makeId(),
    imgUrl: gCurrImg.src,
    previewUrl: gElCanvas.toDataURL(),
    createdAt: Date.now(),
    meme: structuredClone(gMeme),
    cloudUrl: null
  }

  uploadImg(memeToSave.previewUrl, (uploadedImgUrl) => {
    memeToSave.cloudUrl = uploadedImgUrl
    savedMemes.push(memeToSave)
    saveToStorage(STORAGE_KEY, savedMemes)
    console.log('Saved meme with preview ✅', memeToSave)
  })
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
          rotate: 0
        }
      ]
      showEditor()
      renderMeme()
    }
  }

  const file = ev.target.files[0]
  if (file) reader.readAsDataURL(file)
}
