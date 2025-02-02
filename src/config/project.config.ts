/**
 * 项目配置文件
 * 定义项目的核心配置和常量
 */

export const PROJECT_CONFIG = {
    // 主题相关配置
    theme: {
        name: 'Asri',
        version: '3.1.0',
        author: 'mustakshif'
    },
    
    // 功能模块配置
    modules: {
        // 编辑器相关配置
        editor: {
            debounceTime: 300, // 防抖时间（毫秒）
            selectionChangeDelay: 300 // 选择变化延迟（毫秒）
        },
        
        // UI相关配置
        ui: {
            transitionDuration: 300, // 过渡动画持续时间（毫秒）
            animationTiming: 'var(--asri-ease-spring-2)' // 动画时间函数
        }
    },
    
    // 系统常量
    constants: {
        // CSS类名
        classNames: {
            selectedBlock: 'asri-selected-block',
            withoutIcon: 'without-icon',
            hasFocus: 'has-focus'
        }
    }
};

// 导出类型定义
export type ThemeConfig = typeof PROJECT_CONFIG.theme;
export type ModulesConfig = typeof PROJECT_CONFIG.modules;
export type ConstantsConfig = typeof PROJECT_CONFIG.constants;