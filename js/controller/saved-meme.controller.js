'use strict'

const STORAGE_KEY = 'saved_memes'

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
        <img src="${meme.imgUrl}" alt="Saved Meme" />
        <div class="share-container">
          <button class="btn" onclick="onUploadToFB('${encodedUrl}')">Share on Facebook</button>
        </div>
      </div>
    `
  }).join('')
}


