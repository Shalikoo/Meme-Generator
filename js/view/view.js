function renderGallery() {
  const elGallery = document.querySelector('.gallery')
  elGallery.innerHTML = gImgs.map(img => `<img src="${img.url}" onclick="onImgSelect(${img.id})" />`).join('')
}

function showEditor() {
  document.querySelector('.gallery-section').classList.add('hidden')
  document.querySelector('.editor-section').classList.remove('hidden')
}
