/**
 * 编辑器模块基类
 * 统一管理编辑器相关的功能
 */

import { IModule } from '../core/ModuleManager';
import { PROJECT_CONFIG } from '../../config/project.config';
import { debounce, querySelectorAllAsync } from '../../utils/common';

export class EditorModule implements IModule {
    private static instance: EditorModule;
    private readonly debounceTime: number;

    private constructor() {
        this.debounceTime = PROJECT_CONFIG.modules.editor.debounceTime;
    }

    public static getInstance(): EditorModule {
        if (!EditorModule.instance) {
            EditorModule.instance = new EditorModule();
        }
        return EditorModule.instance;
    }

    public init(): void {
        this.initBackgroundHandling();
        this.initSelectionHandling();
    }

    public destroy(): void {
        this.removeBackgroundHandling();
        this.removeSelectionHandling();
    }

    private async initBackgroundHandling(): Promise<void> {
        const formatBackground = debounce(async () => {
            const protyleBgs = await querySelectorAllAsync('.protyle-top>.protyle-background');
            protyleBgs?.forEach(protyleBg => {
                const hasImage = !protyleBg.querySelector('.protyle-background__img img')?.classList.contains('fn__none');
                const hasIcon = !protyleBg.querySelector('.protyle-background__icon')?.classList.contains('fn__none');
                
                if (hasImage && !hasIcon) {
                    protyleBg.classList.add(PROJECT_CONFIG.constants.classNames.withoutIcon);
                } else {
                    protyleBg.classList.remove(PROJECT_CONFIG.constants.classNames.withoutIcon);
                }
            });
        }, this.debounceTime);

        // 添加观察者
        const observer = new MutationObserver(() => formatBackground());
        document.querySelectorAll('.protyle').forEach(protyle => {
            observer.observe(protyle, { 
                childList: true, 
                subtree: true, 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        });
    }

    private removeBackgroundHandling(): void {
        document.querySelectorAll(`.protyle .protyle-background.${PROJECT_CONFIG.constants.classNames.withoutIcon}`)
            .forEach(el => el.classList.remove(PROJECT_CONFIG.constants.classNames.withoutIcon));
    }

    private initSelectionHandling(): void {
        document.addEventListener('selectionchange', this.handleSelectionChange);
    }

    private removeSelectionHandling(): void {
        document.removeEventListener('selectionchange', this.handleSelectionChange);
        this.removeSelectedBlockClass();
    }

    private handleSelectionChange = (): void => {
        Promise.race([
            new Promise<void>(resolve => {
                const mouseUpHandler = () => {
                    document.removeEventListener('mouseup', mouseUpHandler, true);
                    resolve();
                };
                document.addEventListener('mouseup', mouseUpHandler, true);
            }),
            new Promise<void>(resolve => {
                const keyUpHandler = () => {
                    document.removeEventListener('keyup', keyUpHandler, true);
                    resolve();
                };
                document.addEventListener('keyup', keyUpHandler, true);
            }),
            new Promise<void>(resolve => setTimeout(resolve, PROJECT_CONFIG.modules.editor.selectionChangeDelay))
        ]).then(() => {
            const selection = window.getSelection();
            const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            if (!range) return;

            const curNode = range.commonAncestorContainer;
            const curParent = curNode.parentElement;
            const curBlock = curParent?.closest('[data-node-id]');
            if (!curBlock) return;

            const curBlockType = curBlock.getAttribute('data-type');
            this.removeSelectedBlockClass();

            if (!curBlockType || ['NodeAttributeView', 'NodeCodeBlock', 'NodeList', 'NodeHTMLBlock'].includes(curBlockType)) {
                return;
            }

            curBlock.classList.add(PROJECT_CONFIG.constants.classNames.selectedBlock);
        });
    };

    private removeSelectedBlockClass(): void {
        document.querySelectorAll(`.${PROJECT_CONFIG.constants.classNames.selectedBlock}`)
            .forEach(block => block.classList.remove(PROJECT_CONFIG.constants.classNames.selectedBlock));
    }
}