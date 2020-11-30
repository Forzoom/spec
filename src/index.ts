function isUndef(v: any): v is (null | undefined) {
    return v === null || v === undefined;
}

/**
 * 处理规格选择
 * 1. 添加所有的meta
 * 2. 添加spec
 * 3. 建立line，line的建立依赖于minQuantity
 *
 * <S> 规格类型，例如后端传来的 { color: '红色', size: 'xxl' }
 */
export class SpecHandler<S extends SpecManager.Specification = SpecManager.Specification> {
    /** 配置信息 */
    public options: SpecManager.ManagerOptions;
    /** 每个规格的信息 */
    public map: {
        [specKey: string]: {
            [specValue: string]: SpecManager.SpecNameEnableInfo;
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
     * 当前选择的规格
     */
    public selected: {
        [specKey: string]: SpecManager.SpecValue | null;
    } = {};

    /** meta数据中key到index的映射 */
    private metaIdSet: Set<any> = new Set();

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
    public addMeta(meta: SpecManager.SpecMeta | SpecManager.SpecMeta[]) {
        if (Array.isArray(meta)) {
            meta.forEach((meta) => {
                this.addMeta(meta);
            });
            return;
        }

        const self = this;
        // 已经添加过了
        if (self.metaIdSet.has(meta.id)) {
            // todo: warn
            return;
        }

        self.meta.push(meta);
        self.metaIdSet.add(meta.id);

        // todo: 考虑是否有必要
        const list = Array.from(meta.list);
        if (list) {
            list.forEach((name) => {
                self.prepareSpecInfo(meta.key, name);
            });
        }

        // tip: 帮助vue建立可观测的对象
        this.selected[meta.key] = null;
    }
    /**
     * 添加spec数据
     */
    public addSpec(spec: S, option?: { quantity?: number }) {
        // 添加quantity
        if (option && option.quantity) {
            this.meta.forEach((meta) => {
                this.addQuantity(meta.key, spec[meta.key], option.quantity);
            });
        }
        // 添加line
        this.buildLine(spec);
        // 添加到map中
        this.storeSpec(spec);
    }
    /**
     * 为规格添加库存
     *
     * @param {SpecManager.SpecKey} specKey 规格key
     * @param {SpecManager.SpecName} specName 规格
     * @param {number} quantity 数量
     */
    public addQuantity(specKey: SpecManager.SpecKey, specName: SpecManager.SpecName, quantity: number): void {
        this.prepareSpecInfo(specKey, specName);
        this.map[specKey][specName].quantity += quantity;
    }
    /**
     * 建立line
     */
    public buildLine(item: any) {
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
    public storeSpec(spec: S) {
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
        const selectedEntries: string[][] = [];
        const keys = Object.keys(this.selected);
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            const value = this.selected[key];
            if (!isUndef(value)) {
                selectedEntries.push([ key, this.selected[key] ]);
            }
        }

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
    public select(spec: any) {
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
     * 获取选中的规格
     */
    public getSelectedSpecification() {
        const keys = this.meta.map((item) => item.key);
        return this.specMap[keys.map((key) => this.selected[key]).join('_')];
    }

    private prepareSpecInfo(key: SpecManager.SpecKey, value: SpecManager.SpecValue) {
        if (!this.map[key]) {
            this.map[key] = {};
        }
        if (!this.map[key][value]) {
            this.map[key][value] = {
                quantity: 0,
                enable: true,
            };
        }
    }
}
