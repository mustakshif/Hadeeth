/**
 * 通用工具函数模块
 * 提供项目中常用的工具函数
 */

import { DebouncedFunction } from '../types/core';

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): DebouncedFunction<T> {
    let timeout: NodeJS.Timeout;

    const debounced = function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    } as DebouncedFunction<T>;

    debounced.cancel = () => clearTimeout(timeout);

    return debounced;
}

// DOM元素查询工具
export async function querySelectorAsync(selector: string, timeout: number = 3000): Promise<Element | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
}

// 批量DOM元素查询工具
export async function querySelectorAllAsync(selector: string, timeout: number = 3000): Promise<NodeListOf<Element> | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) return elements;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
}

// 环境检测工具
export const env = {
    isMobile: /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent),
    isWindows: navigator.platform.toLowerCase().includes('win'),
    isMacOS: navigator.platform.toLowerCase().includes('mac'),
    isLinux: navigator.platform.toLowerCase().includes('linux')
};

// 事件工具
export const eventUtil = {
    on<K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        element.addEventListener(type, listener, options);
    },

    off<K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void {
        element.removeEventListener(type, listener, options);
    }
};