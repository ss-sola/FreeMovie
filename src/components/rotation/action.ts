import { userRotationStore } from '@/stores/rotationStore'

const rotationStore = userRotationStore().rotationStore
//获取屏幕帧数
let getFPS = async function () {
  var fps = (await main()) as number
  getFPS = async () => {
    return fps
  }
  return fps
  async function main() {
    return new Promise((resolve) => {
      let startTime = performance.now()

      function measureFPS() {
        const endTime = performance.now()
        const timeDiff = endTime - startTime
        const fps = Math.round(1000 / timeDiff)

        resolve(fps)
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(measureFPS)
      })
    })
  }
}

function setStyle(dom: HTMLElement, i: number, len: number) {
  const deg = (i - Math.round(len / 2) + 1) * rotationStore.speed
  //初始化图片位置
  dom.style.transform = 'rotateY(' + deg + 'deg) translateZ(' + rotationStore.radius + 'px)'
}
//暂停开始旋转
function playSpin(yes: boolean) {
  rotationStore.spinDom.style.animationPlayState = yes ? 'running' : 'paused'
  if (yes) {
    render()
    return
  }
  if (rotationStore.count) cancelAnimationFrame(rotationStore.count)
}
function changeRotate(obj: HTMLElement) {
  // X轴旋转0-180度
  if (rotationStore.tY > 180) rotationStore.tY = 180
  if (rotationStore.tY < 0) rotationStore.tY = 0
  // y轴旋转角度不限制
  obj.style.transform = 'rotateX(' + -rotationStore.tY + 'deg) rotateY(' + rotationStore.tX + 'deg)'
}
function mouseMove() {
  let startX: number, startY: number, endX: number, endY: number
  let timer: NodeJS.Timeout
  //鼠标移动事件
  rotationStore.divBody.onpointerdown = function (e) {
    //清除惯性定时器
    clearInterval(timer)
    e = e || window.event
      //鼠标点击位置
      ; (startX = e.clientX), (startY = e.clientY)
    this.onpointermove = function (e) {
      playSpin(false)
      //鼠标点击时 停止自动旋转//鼠标点击时 停止自动旋转
      e = e || window.event
        //记录结束时位置
        ; (endX = e.clientX), (endY = e.clientY)
      //计算移动距离 并修改角度
      rotationStore.desX = endX - startX
      rotationStore.desY = endY - startY
      rotationStore.tX += rotationStore.desX * 0.1
      rotationStore.tY += rotationStore.desY * 0.1
      changeRotate(rotationStore.outDom)
      startX = endX
      startY = endY
    }
    //鼠标离开时 开始自动旋转
    this.onpointerup = function (e) {
      //惯性旋转
      timer = setInterval(function () {
        rotationStore.desX *= 0.95
        rotationStore.desY *= 0.95
        rotationStore.tX += rotationStore.desX * 0.1
        rotationStore.tY += rotationStore.desY * 0.1
        changeRotate(rotationStore.outDom)
        playSpin(false)
        if (Math.abs(rotationStore.desX) < 0.5 && Math.abs(rotationStore.desY) < 0.5) {
          clearInterval(timer)
          playSpin(true)
        }
      })
      this.onpointermove = this.onpointerup = null
    }
    return false
  }
}

async function render() {
  if (rotationStore.aImg.length <= 0) return

  var fps: number = (await getFPS()) * 5

  if (rotationStore.count % fps == 0) {
    animate()
  }
  rotationStore.count = requestAnimationFrame(render)
}
function animate() {
  // 使用函数获取最前方的图片元素

  rotationStore.deg += rotationStore.speed
  rotationStore.spinDom.style.transform = 'rotateY(-' + rotationStore.deg + 'deg)'
  var left = (Math.round(rotationStore.deg / rotationStore.speed) - 1) % rotationStore.imgLen

  // var right = (left + rotationStore.imgLen - 1) % rotationStore.imgLen
  var index = (left + Math.round(rotationStore.imgLen / 2)) % rotationStore.imgLen

  rotationStore.aImg[(rotationStore.imgLen + index - 1) % rotationStore.imgLen].style.opacity =
    '0.5'
  rotationStore.aImg[index].style.opacity = '1'
  var img = rotationStore.aImg[index].querySelector('img')
  if (img) rotationStore.divBody.style.backgroundImage = 'url(' + img.src + ')'

  var leftDeg = rotationStore.srartRightDeg + rotationStore.deg

  rotationStore.aImg[left].style.transform =
    'rotateY(' + leftDeg + 'deg) translateZ(' + rotationStore.radius + 'px)'
}

const rotationDataPush = async function (dataArr: IMovie.IMovieItem[], obj: IMovie.IMovieItem) {
  return new Promise((resolve) => {
    obj.title = obj.title.replace(' ', '')
    let exist = dataArr.find((item) => item.title == obj.title && item.tag == obj.tag)
    if (!exist) {
      dataArr.push(obj)
    }
    resolve(null)
  })
}

export { setStyle, playSpin, changeRotate, mouseMove, render, animate, rotationDataPush }
