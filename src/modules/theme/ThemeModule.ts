/**
 * 主题模块
 * 负责管理主题相关的功能
 */

import { IModule } from '../core/ModuleManager';
import { PROJECT_CONFIG } from '../../config/project.config';
import { eventUtil } from '../../utils/common';

export class ThemeModule implements IModule {
    private static instance: ThemeModule;
    private themeTransitionClass = 'theme-transition';
    private darkModeClass = 'theme--dark';

    private constructor() {}

    public static getInstance(): ThemeModule {
        if (!ThemeModule.instance) {
            ThemeModule.instance = new ThemeModule();
        }
        return ThemeModule.instance;
    }

    public init(): void {
        this.initThemeTransition();
        this.initThemeChangeListener();
    }

    public destroy(): void {
        this.removeThemeTransition();
        this.removeThemeChangeListener();
    }

    private initThemeTransition(): void {
        document.documentElement.classList.add(this.themeTransitionClass);
    }

    private removeThemeTransition(): void {
        document.documentElement.classList.remove(this.themeTransitionClass);
    }

    private initThemeChangeListener(): void {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
                    this.handleThemeChange(isDarkMode);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    private removeThemeChangeListener(): void {
        // MutationObserver会在页面卸载时自动断开连接
    }

    private handleThemeChange(isDarkMode: boolean): void {
        // 更新主题相关的样式和行为
        const transitionDuration = PROJECT_CONFIG.modules.ui.transitionDuration;
        const animationTiming = PROJECT_CONFIG.modules.ui.animationTiming;

        document.documentElement.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`);
        document.documentElement.style.setProperty('--theme-transition-timing', animationTiming);

        // 触发主题变更事件
        const themeChangeEvent = new CustomEvent('themeChange', {
            detail: { isDarkMode }
        });
        document.dispatchEvent(themeChangeEvent);
    }

    public getCurrentTheme(): string {
        return document.documentElement.classList.contains(this.darkModeClass) ? 'dark' : 'light';
    }

    public toggleTheme(): void {
        const isDarkMode = this.getCurrentTheme() === 'dark';
        document.documentElement.classList.toggle(this.darkModeClass);
    }
}