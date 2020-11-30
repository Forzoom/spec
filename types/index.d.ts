/**
 * 例如针对这样的数据
 * {
 *   size: 'XXL',
 *   color: '白色',
 * }
 * 在页面中显示为 尺码: XXL，颜色: 白色
 */

declare namespace SpecManager {
    /** 例如 size color */
    type SpecKey = string;
    /** 例如 尺码 颜色 */
    type SpecName = string;
    /** 具体的规格内容，例如 XXL 白色 */
    type SpecValue = string;

    /** 配置信息 */
    interface ManagerOptions {
        /** 当库存数量低于minQuantity时，将不可选择 */
        minQuantity: number | undefined | null;
    }
    /** 包含规格具体数据 */
    interface Specification {
        [specKey: string]: SpecValue;
    }

    /** 连线信息 */
    interface LineInfo {
        [key: string]: any;
        quantity: number;
    }
    /** 规格额外信息，并非针对于Spec，而是针对SpecName */
    interface SpecNameEnableInfo {
        /** 库存 */
        quantity: number;
        /** 当前是否可选，即存在这个规格 */
        enable: boolean;
    }
    /**
     * 规格原始数据
     */
    interface SpecMeta {
        /** 用来标识唯一性 */
        id: any;
        /** 规则字段名，例如: color，size */
        key: SpecKey;
        /** 规则名字，例如: 颜色，尺码 */
        name: SpecName;
        /** 规格内容，例如: 红色，黄色，白色 */
        list: Set<SpecValue>;
    }
}
