/* eslint-disable no-unused-vars */
const _ = require('lodash');
const connect = require('../connect');

describe('core', () => {
  // const fail = () => expect().toEqual('FAILED');
  const files = [
    'src/RAAmen_core.js',
  ];
  describe('メソッド', () => {
    describe('send()', () => {
      it('存在する', () => {
        connect({ files });
        const { RAA } = window;
        expect(RAA.send).toBeTruthy();
      });
      it('１回だけ送信 > 成功', async () => {
        connect({ files });
        const { RAA } = window;
        const response = await RAA.send();
        expect(response.result).toBeTruthy();
        expect(response.error).toBeNull();
      });
      it('規定回数以上連続送信 > 失敗', async () => {
        connect({ files });
        const { RAA } = window;
        const { falseMax } = RAA;
        let response;
        // 初期送信
        response = await RAA.send();
        expect(response.result).toBeTruthy();
        expect(response.error).toBeNull();
        // 規制直前まで送信
        _.range(falseMax).forEach(async () => {
          response = await RAA.send();
          expect(response.result).toBeTruthy();
          expect(response.error).toBeNull();
        });
        // 規制になる送信
        response = await RAA.send();
        expect(response.result).toBeFalsy();
        expect(response.error.code).toEqual('API_CALL_LIMIT_EXCEEDED');
      });
    });
  });
});
