/**
 * 处理规格选择
 *
 * <S> 规格类型，例如后端传来的 { color: '红色', size: 'xxl' }
 */
export class SpecHandler<S extends SpecManager.Specification = SpecManager.Specification> {
    /** 配置信息 */
    public options: SpecManager.ManagerOptions;
    public map: {
        [specKey: string]: {
            [specName: string]: SpecManager.SpecNameEnableInfo
        };
    } = {};
    /** 
     * 连线信息
     */
    public lineMap: {
        [specName: string]: boolean;
    } = {};
    /**
     * 规格数据
     * 例如:
     * {
     *   color_size: { color:  }
     * }
     */
    public specMap: {
        [specKeyJoin: string]: S;
    } = {};
    /** 
     * 规格原始数据
     */
    public meta: SpecManager.SpecMeta[] = [];
    /**
     * meta数据中key到index的映射
     */
    public metaMap: { [key: string]: number } = {};
    /**
     * 当前选择的规格
     */
    public selected: {
        [specKey: string]: SpecManager.SpecValue | null;
    } = {};

    public constructor(options?: Partial<SpecManager.ManagerOptions>) {
        this.options = Object.assign({
            minQuantity: 1,
        }, options);
    }

    /**
     * 添加规格原始数据
     *
     * @param {SpecManager.SpecKey} specKey 规格字段名
     * @param {SpecManager.SpecName} name 规格名
     * @param list 所有规格
     */
    public addMeta(specKey: SpecManager.SpecKey, specName: SpecManager.SpecName, list?: SpecManager.SpecValue[]) {
        const self = this;
        // 已经添加过了
        if (self.metaMap[specKey] >= 0) {
            // todo: warn
            return;
        }

        self.metaMap[specKey] = self.meta.length;
        self.meta.push({
            key: specKey,
            name: specName,
            list: new Set(list || []),
        });

        // todo: 考虑是否有必要
        if (list) {
            list.forEach((specName) => {
                if (!self.map[specKey][specName]) {
                    self.map[specKey][specName] = {
                        quantity: 0,
                        enable: true,
                    };
                }
            });
        }

        // tip: 帮助vue建立可观测的对象
        this.selected[specKey] = null;
    }
    /**
     * 为规格添加库存
     *
     * @param {SpecManager.SpecKey} specKey 规格key
     * @param {SpecManager.SpecName} specName 规格
     * @param {number} quantity 数量
     */
    public addSpecQuantity(specKey: SpecManager.SpecKey, specName: SpecManager.SpecName, quantity: number): void {
        const map = this.map;
        // todo: 考虑是否要求先添加meta
        if (!map[specKey]) {
            map[specKey] = {};
        }
        if (!map[specKey][specName]) {
            map[specKey][specName] = {
                quantity: quantity || 0,
                enable: true,
            };
        } else {
            map[specKey][specName].quantity += quantity;
        }
    }
    /**
     * 建立line
     */
    public buildLine(item) {
        const keys = this.meta.map((item) => item.key);
        const l = keys.length;
        for (let x = 0; x < l; x++) {
            for (let y = 0; y < l; y++) {
                if (x === y) {
                    continue;
                }
                const key = item[keys[x]] + '_' + item[keys[y]];
                // 根据quantity来创建spec
                if (item.quantity >= this.options.minQuantity) {
                    this.lineMap[key] = true;
                }
            }
        }
    }
    /**
     * 保存在specMap中
     *
     * @param spec 规格数据
     */
    public storeSpecMap(spec) {
        const keys = this.meta.map((item) => item.key);
        this.specMap[keys.map((key) => spec[key]).join('_')] = spec;
    }

    /**
     * 开启/关闭规格
     * @param {SpecManager.SpecKey} key 规格key
     * @param {SpecManager.SpecValue} spec 规格内容
     */
    public toggleSpec(key: SpecManager.SpecKey, spec: SpecManager.SpecValue) {
        // toggle规格
        this.selected[key] = this.selected[key] === spec ? null : spec;
        this.refreshSpec();
    }
    /**
     * 刷新规格信息
     */
    public refreshSpec() {
        const metaList = this.meta;
        const lineMap = this.lineMap;
        // tip: 不使用isUndef，是为了不引入lib/utils，因为引入会导致单元测试失败
        const selectedEntries = Object.entries(this.selected).filter((item) => (item[1] !== null && item[1] !== undefined));

        // 没有选中，全部重置
        for (const meta of metaList) {
            for (const spec of meta.list) {
                let enable = true;
                for (const [ sKey, sSpec, ] of selectedEntries) {
                    // 同key不检查
                    if (meta.key === sKey) {
                        continue;
                    }
                    enable = enable && !!lineMap[spec + '_' + sSpec];
                }
                this.map[meta.key][spec].enable = enable;
            }
        }
    }
    /**
     * 使用spec数据
     */
    public select(spec) {
        this.meta.forEach((meta) => {
            this.selected[meta.key] = spec[meta.key];
        });
    }
    /**
     * 重置选择的内容
     */
    public resetSelected() {
        this.meta.forEach((meta) => {
            this.selected[meta.key] = null;
        });
    }
    /**
     * 获取选中的规格信息
     */
    public getSelectedSpecification() {
        const keys = this.meta.map((item) => item.key);
        return this.specMap[keys.map((key) => this.selected[key]).join('_')];
    }
}
