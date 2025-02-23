import { ref, reactive } from 'vue'
import { player, options } from '../index'
import { ScreenBrightness } from '@capacitor-community/screen-brightness';

let isTouching = false;
let startX = 0;
let startY = 0;
let prevX = 0;
let prevY = 0;
let width = 0;
let height = 0;
let startVolume = 1; // 默认音量
let startBrightness = 1; // 默认亮度
const threshold = 10; // 移动阈值
let isHorizontal = false; // 是否为水平滑动
let isVertical = false;   // 是否为垂直滑动

const applyProgress = () => {
    // 这里可以绑定进度更新到 video.js
    player.currentTime(Math.min(Math.max(options.currentTime + options.progress, 0), options.duration));
};

const updateVolume = async (diffY: number) => {
    options.showVolume = true;
    const volumeChange = Number((diffY / height * 2).toFixed(2));
    const volume = Math.min(Math.max(startVolume - volumeChange, 0), 1)
    VolumeControl.setVolume(volume)
    options.volume = volume
};

const updateBrightness = (diffY: number) => {
    options.showBrightness = true;
    const brightnessChange = Number((diffY / height * 2).toFixed(2));
    const newBrightness = Math.min(Math.max(startBrightness - brightnessChange, 0), 1);
    ScreenBrightness.setBrightness({ brightness: newBrightness })
    options.brightness = newBrightness;
};

const updateProgress = (diffX: number) => {
    if (!options.duration) return
    options.showProgress = true;
    options.progress = Math.round(diffX);
};

export const onTouchStart = async (event: TouchEvent) => {
    const touch = event.touches[0];
    startX = touch.pageX;
    startY = touch.pageY;
    prevX = startX;
    prevY = startY;
    isHorizontal = false;
    isVertical = false;
    isTouching = false; // 默认不触发任何操作
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    width = rect.width
    height = rect.height
    startVolume = await VolumeControl.getVolume();
    const { brightness } = await ScreenBrightness.getBrightness();
    startBrightness = brightness
    options.progress = 0;
};

export const onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    const diffX = touch.pageX - startX;
    const diffY = touch.pageY - startY;
    // 如果还没有开始触摸操作，或者滑动距离没有超过阈值，直接返回
    if ((Math.abs(diffX) <= threshold && Math.abs(diffY) <= threshold)) {
        return;
    }

    // 判断滑动方向
    if (!isTouching && !isHorizontal && !isVertical) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 确定为水平滑动
            isHorizontal = true;
        } else {
            // 确定为垂直滑动
            isVertical = true;
        }
        isTouching = true; // 开始触发操作
    }

    if (isHorizontal) {
        // 左右滑动控制播放进度
        updateProgress(diffX);
    } else if (isVertical) {
        // 上下滑动控制音量和亮度
        if (startX < width / 2) {
            updateBrightness(diffY);
        } else {
            updateVolume(diffY);
        }
    }

    prevX = touch.pageX;
    prevY = touch.pageY;
};

export const onTouchEnd = () => {
    isTouching = false;
    if (isHorizontal) {
        applyProgress(); // 在抬起时更新进度
    }
    options.showBrightness = false;
    options.showVolume = false;
    options.showProgress = false;
};


