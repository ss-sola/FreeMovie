
const globalDOMObjects = [
    'document',
    'customElements',
    'CSS', // CSS 相关 API
    'visualViewport', // 影响视口布局
    'screen', // 屏幕信息
    'navigator', // 可能影响渲染，如 `navigator.deviceMemory`
    'history', // 可能影响页面导航
    'location', // 可能会改变 URL 触发页面刷新
    'performance', // 可能用于影响动画和渲染
];
const globalDOMMethods = [
    'alert', 'confirm', 'prompt', // 弹窗可能会影响页面布局
    'print', // 可能影响页面渲染
    'open', 'close', // 可能改变窗口状态
    'requestAnimationFrame', 'cancelAnimationFrame', // 影响页面渲染
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', // 计时器可能影响动画
    'matchMedia', // 监听 CSS 媒体查询（可能触发渲染更新）
    'getComputedStyle', // 影响 CSS 计算
    'scrollTo', 'scrollBy', 'scrollIntoView', // 滚动相关
    'focus', 'blur' // 可能影响交互体验
];
const globalDOMConstructors = [
    'HTMLElement', 'Element', 'Node', 'Text', 'Comment', 'DocumentFragment', // 基础 DOM 元素
    'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', // 事件相关
    'MutationObserver', 'ResizeObserver', // 监听 DOM 变化
    'IntersectionObserver', 'PerformanceObserver', // 影响布局计算
    'ShadowRoot', 'HTMLCollection', 'NodeList' // 其他 DOM 相关对象
];
const globalEventHandlers = [
    'onload', 'onresize', 'onscroll', 'onmousemove', 'onclick',
    'onkeydown', 'onkeyup', 'ontouchstart', 'ontouchmove',
    'onfocus', 'onblur'
];

const blockedGlobals = new Set([
    ...globalDOMObjects,
    ...globalDOMMethods,
    ...globalDOMConstructors,
    ...globalEventHandlers
]);
const handler: ProxyHandler<Window & typeof globalThis> = {
    get(target: Window & typeof globalThis, prop: string): any {
        if (blockedGlobals.has(prop)) {
            console.warn(`Access to global property '${prop}' is blocked.`);
            return undefined;
        }
        return Reflect.get(target, prop);
    }
}
const globalProxy = new Proxy(window as Window & typeof globalThis, handler)


export {
    globalProxy
}

