'use strict'

function renderSavedMemes() {
  const memes = loadFromStorage(STORAGE_KEY) || []
  const elGallery = document.querySelector('.saved-memes-gallery')

  if (!memes.length) {
    elGallery.innerHTML = '<p>No saved memes yet...</p>'
    return
  }

  elGallery.innerHTML = memes.map((meme, idx) => {
    const encodedUrl = encodeURIComponent(meme.cloudUrl || meme.imgUrl)
    return `
      <div class="saved-meme-card">
        <img src="${meme.previewUrl}" alt="Saved Meme"/>
        <div class="share-container">
          <button class="btn" onclick="onUploadToFB('${encodedUrl}')">Share to FB</button>
          <button class="btn" onclick="onEditMeme(${idx})">Edit</button>
          <button class="btn" onclick="onShareMeme(${idx})">Share</button>
        </div>
      </div>
    `
  }).join('')
}

function onEditMeme(idx) {
  const savedMemes = loadFromStorage(STORAGE_KEY)
  const meme = savedMemes[idx]

  gMeme = structuredClone(meme.meme)

  const imgObj = gImgs.find(img => img.id === gMeme.selectedImgId)

  gCurrImg = new Image()
  gCurrImg.src = imgObj.url

  gElCanvas = document.getElementById('meme-canvas')
  gCtx = gElCanvas.getContext('2d')

  gCurrImg.onload = () => {
    resizeCanvasToImage()
    showEditor()
    renderMeme()
    renderStickers()
  }
}

function onShareMeme(idx) {
  const savedMemes = loadFromStorage(STORAGE_KEY)
  const meme = savedMemes[idx]
  const urlToShare = meme.cloudUrl || meme.imgUrl

  if (navigator.share) {
    navigator.share({
      title: 'Check out my meme!',
      text: 'Look what I made!',
      url: urlToShare
    }).then(() => {
      console.log('Shared successfully')
    }).catch(err => {
      console.error('Error sharing:', err)
      alert('Sharing failed. Copy the link manually: ' + urlToShare)
    })
  } else {
    copyToClipboard(urlToShare)
    alert('Your browser does not support sharing. The link was copied to clipboard:\n\n' + urlToShare)
  }
}

function copyToClipboard(text) {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

function onBackToSavedMemes() {
  document.querySelector('.gallery-section').classList.remove('hidden')
  document.querySelector('.editor-section').classList.add('hidden')
  document.querySelector('.gallery').classList.remove('hidden')
  renderSavedMemes()
}