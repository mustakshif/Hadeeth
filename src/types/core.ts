/**
 * 核心类型定义文件
 * 定义项目中使用的核心类型和接口
 */

// 主题配置相关类型
export interface ThemeConfig {
    name: string;
    version: string;
    author: string;
}

// UI状态相关类型
export interface UIState {
    isDarkMode: boolean;
    isFullScreen: boolean;
    isMobile: boolean;
}

// DOM元素引用类型
export interface DOMRefs {
    layoutDockL?: HTMLElement;
    protyleWysiwyg?: HTMLElement;
    protyleBackground?: HTMLElement;
}

// 事件处理器类型
export type EventHandler<T = Event> = (event: T) => void;

// 防抖函数类型
export type DebouncedFunction<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

// 观察者配置类型
export interface ObserverConfig {
    target: Element | null;
    options?: MutationObserverInit;
    callback: MutationCallback;
}

// API响应类型
export interface APIResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}