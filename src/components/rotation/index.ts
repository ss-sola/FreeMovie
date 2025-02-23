import { userRotationStore } from '@/stores/rotationStore'
import { isPC, emptyElement } from '@/utils/static'
import { setStyle, mouseMove } from './action'
import { initRotationData } from '@/service/rotation'

const rotationStore = userRotationStore().rotationStore

async function init(divBody: HTMLDivElement) {
  await initRotationData()
  divBody.scrollIntoView()

  rotationStore.divBody = divBody
  rotationStore.spinDom = document.getElementById('spinBox') || emptyElement()
  rotationStore.outDom = document.getElementById('dragBox') || emptyElement()

  rotationStore.aImg = Array.from(
    rotationStore.spinDom.querySelectorAll('.card')
  ) as HTMLDivElement[]
  rotationStore.imgLen = rotationStore.aImg.length
  if (!rotationStore.imgLen) return
  rotationStore.radius = 250
  if (isPC()) {
    mouseMove()
    rotationStore.radius = 480
  }

  rotationStore.deg = 0
  rotationStore.srartRightDeg =
    (rotationStore.imgLen - Math.round(rotationStore.imgLen / 2)) * rotationStore.speed

  rotationStore.spinDom.style.transform = 'rotateY(' + rotationStore.deg + 'deg)'

  var center =
    (rotationStore.imgLen - 1 + Math.round(rotationStore.imgLen / 2)) % rotationStore.imgLen
  const img = rotationStore.aImg[center].querySelector('img')
  if (img) {
    divBody.style.backgroundImage = 'url(' + img.src + ')'
  }

  for (let i = 0; i < rotationStore.aImg.length; i++) {
    setStyle(rotationStore.aImg[i], i, rotationStore.aImg.length)
  }
}

const cardStyle = {
  img: {
    '-webkit-box-reflect': 'below 5px linear-gradient(transparent, transparent, #0005)'
  },
  span: {
    transform: 'scale(0.5)',
    position: 'absolute',
    bottom: '10px',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#fff',
    padding: '0 5px',
    borderRadius: '10px',
    marginRight: '5px',
    marginLeft: '5px',
    whiteSpace: 'nowrap'
  },
  p: {
    transform: 'scale(0.5)',
    position: 'absolute',
    bottom: '0px',
    margin: '0',
    width: 'auto',
    color: '#fff'
  }
}
export { init, cardStyle }
