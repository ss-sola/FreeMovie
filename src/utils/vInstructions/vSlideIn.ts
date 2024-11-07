const DURATION = 1000
const animationMap = new WeakMap()

// 创建一个选项对象（可选）
const options = {
  root: null, // 使用视窗作为根
  rootMargin: '0px 0px 20px 0px', // 在目标元素进入视窗底部前20px时触发
  threshold: 0.1 // 当交叉区域超过10%时触发回调
}
//IntersectionObserver 观察元素是否从下方进入视口
const ob = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const animation = animationMap.get(entry.target)
      animation.play()
      ob.unobserve(entry.target)
    }
  }
}, options)

function isBelowViewport(el: HTMLDivElement) {
  const rect = el.getBoundingClientRect()
  return rect.top > window.innerHeight
}

export default {
  mounted(el: HTMLDivElement) {
    //获取el的高度
    if (!isBelowViewport(el)) return
    const animation = el.animate(
      [
        {
          opacity: 0,
          transform: `translateY(${el.clientHeight / 3}px)`
        },
        {
          opacity: 1,
          transform: `translateY(0)`
        }
      ],
      {
        duration: DURATION,
        easing: 'ease'
      }
    )

    animation.pause()
    animationMap.set(el, animation)
    ob.observe(el)
  },
  unmounted(el: HTMLDivElement) {
    ob.unobserve(el)
  }
}
