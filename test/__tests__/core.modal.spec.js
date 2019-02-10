/* eslint-disable no-unused-vars */
const _ = require('lodash');
const connect = require('../connect');

const files = [
  'src/RAAmen_core.js',
];

describe('RAA.modal()', () => {
  const fail = () => expect().toEqual('FAILED');
  const mockAlert = jest.fn();
  const getFnReturn = m => m.mock.calls[mockAlert.mock.calls.length - 1];
  const getMockAlertReturn = () => getFnReturn(mockAlert)[0];
  beforeEach(() => {
    mockAlert.mockClear();
  });
  it('存在する', () => {
    connect({ files });
    const { RAA } = window;
    expect(RAA.modal).toBeTruthy();
  });
  it('引数なし : 送信 > 失敗', async () => {
    connect({ files });
    const { RAA } = window;
    global.alert = mockAlert;
    try {
      await RAA.modal();
    } catch (error) {
      expect(error.message).toEqual('message is undefined');
      return;
    }
    fail();
  });
  [undefined, false, true] // 内部処理と待機時間は変わるが、結果は同じになる
    .forEach((client) => {
      describe(`client : ${client}`, () => {
        it('メッセージのみ : 送信 > 成功', async () => {
          connect({ files });
          const { RAA } = window;
          global.alert = mockAlert;
          const message = 'dummy';
          await RAA.modal({ message, client });
          expect(getMockAlertReturn()).toEqual(message);
        });
        it('メッセージなし : 送信 > 失敗', async () => {
          connect({ files });
          const { RAA } = window;
          global.alert = mockAlert;
          try {
            await RAA.modal({ client });
          } catch (error) {
            expect(error.message).toEqual('message is undefined');
            return;
          }
          fail();
        });
        it('checkValid : 通す > 成功', async () => {
          connect({ files });
          const { RAA } = window;
          global.alert = mockAlert;
          const message = 'dummy';
          await RAA.modal({ message, checkValid: () => true, client });
          expect(getMockAlertReturn()).toEqual(message);
        });
        it('checkValid : 通さない > BAD_REQUEST', async () => {
          connect({ files });
          const { RAA } = window;
          global.alert = mockAlert;
          const message = 'dummy';
          try {
            await RAA.modal({ message, checkValid: () => false, client });
          } catch (error) {
            expect(error.constructor.name).toEqual('AtsumaruApiError');
            expect(error.code).toEqual('BAD_REQUEST');
            return;
          }
          fail();
        });
        it('decorate : 変化する設定 > messageと異なる', async () => {
          connect({ files });
          const { RAA } = window;
          global.alert = mockAlert;
          const message = 'Hello';
          const decorate = x => `${x}, World!`;
          await RAA.modal({ message, decorate, client });
          expect(getMockAlertReturn()).not.toEqual(message);
          expect(getMockAlertReturn()).toEqual(decorate(message));
        });
        it('decorate : 変化しない設定 > messageと同じ', async () => {
          connect({ files });
          const { RAA } = window;
          global.alert = mockAlert;
          const message = 'Hello';
          const decorate = x => x;
          await RAA.modal({ message, decorate, client });
          expect(getMockAlertReturn()).toEqual(message);
          expect(getMockAlertReturn()).toEqual(decorate(message));
        });
      });
    });
});
