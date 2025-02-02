/**
 * 模块管理器
 * 负责管理和初始化所有功能模块
 */

import { PROJECT_CONFIG } from '../../config/project.config';
import { UIState } from '../../types/core';
import { env } from '../../utils/common';

// 模块基础接口
export interface IModule {
    init(): void;
    destroy(): void;
}

// 模块管理器类
export class ModuleManager {
    private static instance: ModuleManager;
    private modules: Map<string, IModule>;
    private uiState: UIState;

    private constructor() {
        this.modules = new Map();
        this.uiState = {
            isDarkMode: document.documentElement.classList.contains('theme--dark'),
            isFullScreen: document.fullscreenElement !== null,
            isMobile: env.isMobile
        };
    }

    // 单例模式获取实例
    public static getInstance(): ModuleManager {
        if (!ModuleManager.instance) {
            ModuleManager.instance = new ModuleManager();
        }
        return ModuleManager.instance;
    }

    // 注册模块
    public registerModule(name: string, module: IModule): void {
        if (this.modules.has(name)) {
            console.warn(`Module ${name} already exists`);
            return;
        }
        this.modules.set(name, module);
    }

    // 初始化所有模块
    public initializeModules(): void {
        this.modules.forEach((module, name) => {
            try {
                module.init();
            } catch (error) {
                console.error(`Failed to initialize module ${name}:`, error);
            }
        });
    }

    // 销毁所有模块
    public destroyModules(): void {
        this.modules.forEach((module, name) => {
            try {
                module.destroy();
            } catch (error) {
                console.error(`Failed to destroy module ${name}:`, error);
            }
        });
        this.modules.clear();
    }

    // 获取UI状态
    public getUIState(): UIState {
        return { ...this.uiState };
    }

    // 更新UI状态
    public updateUIState(newState: Partial<UIState>): void {
        this.uiState = { ...this.uiState, ...newState };
    }
}