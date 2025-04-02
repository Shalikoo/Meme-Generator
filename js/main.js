'use strict'

function log(msg) {
    console.log(msg)
    const elLog = document.getElementById('screen-log')
    if (elLog) {
      elLog.innerText = msg
    }
  }
  

var gElCanvas
var gCtx
var gCurrImg
var gIsDragging = false
var gLastPos = null

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Your meme text',
            size: 30,
            color: 'white',
            align: 'center',
            pos: { x: 100, y: 50 },
        },
    ]
}

const gImgs = Array.from({ length: 25 }, (val, i) => ({
    id: i + 1,
    url: `imgs/${i + 1}.jpg`,
}))


function initCanvas() {
    gElCanvas = document.getElementById('meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('touchstart', onDown, { passive: false })
    gElCanvas.addEventListener('touchmove', onMove, { passive: false })
    gElCanvas.addEventListener('touchend', onUp)

}


function renderGallery() {
    const elGallery = document.querySelector('.gallery')
    const strHTMLs = gImgs.map(
        (img) => `<img src="${img.url}" onclick="onImgSelect(${img.id})" />`
    )
    elGallery.innerHTML = strHTMLs.join('')
}


renderGallery()

function onImgSelect(imgId) {
    const img = gImgs.find((img) => img.id === imgId)
    gCurrImg = new Image()
    gCurrImg.src = img.url
    gCurrImg.onload = () => {
        gElCanvas.width = gCurrImg.naturalWidth
        gElCanvas.height = gCurrImg.naturalHeight

        gMeme.selectedImgId = imgId
        gMeme.selectedLineIdx = 0
        gMeme.lines = [
            {
                txt: '',
                size: 30,
                color: 'white',
                align: 'center',
                pos: { x: gElCanvas.width / 2, y: 50 }
            }
        ]

        showEditor()
        renderMeme()
    }
}


function showEditor() {
    document.querySelector('.gallery-section').classList.add('hidden')
    document.querySelector('.editor-section').classList.remove('hidden')
}

function onBackToGallery() {
    document.querySelector('.gallery-section').classList.remove('hidden')
    document.querySelector('.editor-section').classList.add('hidden')
}

function renderMeme() {
    const { width, height } = gElCanvas
    gCtx.clearRect(0, 0, width, height)
    gCtx.drawImage(gCurrImg, 0, 0, width, height)

    gMeme.lines.forEach((line, idx) => {
        const safeFontSize = fitTextToCanvas(line.txt, line.size, width * 0.9)

        gCtx.font = `${safeFontSize}px Impact`
        gCtx.fillStyle = line.color
        gCtx.strokeStyle = 'black'
        gCtx.textAlign = line.align
        gCtx.lineWidth = 2
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y)

        if (idx === gMeme.selectedLineIdx) return drawLineBox(line)
    })

    document.getElementById('txt-line').value = gMeme.lines[gMeme.selectedLineIdx].txt
}


function onSetLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    renderMeme()
}

function onSetColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
    renderMeme()
}

function onChangeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
    renderMeme()
}

function onAddLine() {
    const y = 100 + gMeme.lines.length * 50
    gMeme.lines.push({
        txt: '',
        size: 30,
        color: 'white',
        align: 'center',
        pos: { x: gElCanvas.width / 2, y}
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    renderMeme()
}

function onSwitchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
    renderMeme()
}

function onSetAlign(align) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.align = align
  
    if (align === 'left') line.pos.x = 20
    else if (align === 'right') line.pos.x = gElCanvas.width - 20
    else line.pos.x = gElCanvas.width / 2
  
    renderMeme()
  }
  

function fitTextToCanvas(txt, fontSize, maxWidth) {
    gCtx.font = `${fontSize}px Impact`
    let metrics = gCtx.measureText(txt)
    while (metrics.width > maxWidth && fontSize > 10) {
        fontSize -= 1
        gCtx.font = `${fontSize}px Impact`
        metrics = gCtx.measureText(txt)
    }
    return fontSize
}

function drawLineBox(line) {
    const metrics = gCtx.measureText(line.txt)
    const width = metrics.width
    const height = line.size
  
    let xStart
  
    if (line.align === 'left') {
      xStart = line.pos.x
    } else if (line.align === 'right') {
      xStart = line.pos.x - width
    } else {
      xStart = line.pos.x - width / 2
    }
  
    gCtx.beginPath()
    gCtx.rect(xStart - 10, line.pos.y - height, width + 20, height + 10)
    gCtx.strokeStyle = 'yellow'
    gCtx.lineWidth = 2
    gCtx.stroke()
  }
  

function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
    let pos = {
      x: ev.offsetX,
      y: ev.offsetY,
    }
  
    if (TOUCH_EVS.includes(ev.type)) {
      ev.preventDefault()
      ev = ev.changedTouches[0]
      pos = {
        x: ev.pageX - ev.target.offsetLeft,
        y: ev.pageY - ev.target.offsetTop,
      }
    }
  
    return pos
  }
  

function onDown(ev) {
    log(`onDown: ${ev.type}`)
    const pos = getEvPos(ev)
    const clickedLineIdx = gMeme.lines.findIndex((line) => isLineClicked(pos, line))

    if (clickedLineIdx === -1) return

    gMeme.selectedLineIdx = clickedLineIdx
    gIsDragging = true
    gLastPos = pos

    document.body.style.cursor = 'grabbing'
    renderMeme()
}

function onUp(ev) {
    log(`onUp: ${ev.type}`)
    gIsDragging = false
    document.body.style.cursor = 'default'
}

function onMove(ev) {
    log(`onMove: ${ev.type}`)
    if(!gIsDragging) return

    const pos = getEvPos(ev)
    const dx = pos.x - gLastPos.x
    const dy = pos.y - gLastPos.y

    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.pos.x += dx
    line.pos.y += dy

    gLastPos = pos
    renderMeme()
}

function isLineClicked(pos, line) {
    const metrics = gCtx.measureText(line.txt)
    const width = metrics.width
    const height = line.size
    return (
        pos.x >= line.pos.x - width / 2 &&
        pos.x <= line.pos.x + width / 2 &&
        pos.y >= line.pos.y - height &&
        pos.y <= line.pos.y
    )
}

function onDeleteLine() {
    if(!gMeme.lines.length) return

    gMeme.lines.splice(gMeme.selectedLineIdx, 1)

    if(gMeme.lines.length === 0 ) {
        gMeme.lines.push({
            txt: '',
            size: 30,
            color: 'white',
            align: 'center',
            pos: { x: gElCanvas.width / 2, y: 50}
        })
        gMeme.selectedLineIdx = 0
    } else {
        gMeme.selectedLineIdx = gMeme.selectedLineIdx % gMeme.lines.length
    }

    renderMeme()
}