const { expect } = require('chai');
const { SpecHandler } = require('../../dist/spec-manager.cjs.js');

describe('spec handler', () => {
    it('test', () => {
        const handler = new SpecHandler();

        handler.addMeta({ id: 'spec1', key: 'spec1', name: '尺码', list: new Set(['41', '39']) });
        handler.addMeta({ id: 'spec2', key: 'spec2', name: '颜色', list: new Set(['red'])});
        handler.addMeta({ id: 'spec3', key: 'spec3', name: '款式', list: new Set(['male', 'female']) });

        handler.addSpec({
            spec1: '41',
            spec2: 'red',
            spec3: 'male',
        }, { quantity: 1 });
        handler.addSpec({
            spec1: '39',
            spec2: 'red',
            spec3: 'female',
        }, { quantity: 1 });

        expect(handler.map.spec1['41'].quantity).to.equal(1);
        expect(handler.map.spec1['41'].enable).to.equal(true);
        expect(handler.map.spec1['39'].quantity).to.equal(1);
        expect(handler.map.spec1['39'].enable).to.equal(true);
        expect(handler.map.spec2['red'].quantity).to.equal(2);
        expect(handler.map.spec2['red'].enable).to.equal(true);
        expect(handler.map.spec3['male'].quantity).to.equal(1);
        expect(handler.map.spec3['male'].enable).to.equal(true);
        expect(handler.map.spec3['female'].quantity).to.equal(1);
        expect(handler.map.spec3['female'].enable).to.equal(true);

        handler.toggleSpec('spec1', '41');
        expect(handler.selected.spec1).to.equal('41');
        expect(handler.map.spec1['41'].quantity).to.equal(1);
        expect(handler.map.spec1['41'].enable).to.equal(true);
        expect(handler.map.spec1['39'].quantity).to.equal(1);
        expect(handler.map.spec1['39'].enable).to.equal(true); // 这里仍旧允许选择
        expect(handler.map.spec2['red'].quantity).to.equal(2);
        expect(handler.map.spec2['red'].enable).to.equal(true);
        expect(handler.map.spec3['male'].quantity).to.equal(1);
        expect(handler.map.spec3['male'].enable).to.equal(true);
        expect(handler.map.spec3['female'].quantity).to.equal(1);
        expect(handler.map.spec3['female'].enable).to.equal(false);
    });
});
