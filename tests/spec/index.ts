import { expect } from 'chai';
import { SpecHandler } from '../../src/index';

describe('spec handler', () => {
    it('test', () => {
        const handler = new SpecHandler();
        handler.addSpecQuantity('spec1', '41', 1);
        handler.addSpecQuantity('spec2', 'red', 1);
        handler.addSpecQuantity('spec3', 'male', 1);
        handler.addSpecQuantity('spec1', '39', 1);
        handler.addSpecQuantity('spec2', 'red', 1);
        handler.addSpecQuantity('spec3', 'female', 1);

        handler.addMeta('spec1', '尺码', ['41', '39']);
        handler.addMeta('spec2', '颜色', ['red']);
        handler.addMeta('spec3', '款式', ['male', 'female']);

        handler.buildLine({
            spec1: '41',
            spec2: 'red',
            spec3: 'male',
            quantity: 1,
        });
        handler.buildLine({
            spec1: '39',
            spec2: 'red',
            spec3: 'female',
            quantity: 1,
        });

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
