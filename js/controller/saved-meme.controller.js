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
          <button class="btn" onclick="onUploadToFB('${encodedUrl}')">Share on Facebook</button>
          <button onclick="onEditMeme(${idx})">Edit</button>
        </div>
      </div>
    `
  }).join('')
}

function onEditMeme(idx){
  const savedMemes = loadFromStorage(STORAGE_KEY)
  const meme = savedMemes[idx]

  gMeme = structuredClone(meme.meme)

  gElCanvas = document.getElementById('meme-canvas')
  gCtx = gElCanvas.getContext('2d')
  
  gCurrImg = new Image()
  gCurrImg.src = meme.imgUrl
  gCurrImg.onload = () => {
    resizeCanvasToImage()
    showEditor()
    renderMeme()
    renderStickers()
  }
}
