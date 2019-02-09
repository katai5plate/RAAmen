/* eslint-disable no-unused-vars */
const _ = require('lodash');
const connect = require('../connect');

describe('core', () => {
  const fail = () => expect().toEqual('FAILED');
  const files = [
    'src/RAAmen_core.js',
  ];
  describe('メソッド', () => {
    describe('request()', () => {
      it('存在する', () => {
        connect({ files });
        const { RAA } = window;
        expect(RAA.request).toBeTruthy();
      });
      it('通常 : 送信 > 成功', async () => {
        connect({ files });
        const { RAA } = window;
        return RAA.request({ checkValid: () => true })
          .then((res) => { expect(res).toEqual({}); })
          .catch(() => { fail(); });
      });
      it('noCheck : 送信 > 成功', async () => {
        connect({ files });
        const { RAA } = window;
        return RAA.request({ checkValid: () => true, noCheck: true })
          .then((res) => { expect(res).toEqual({}); })
          .catch(() => { fail(); });
      });
      it('通常 : 通らない送信 > BAD_REQUEST', async () => {
        connect({ files });
        const { RAA } = window;
        return RAA.request({ checkValid: () => false })
          .then(() => { fail(); })
          .catch((error) => {
            expect(error.constructor.name).toEqual('AtsumaruApiError');
            expect(error.code).toEqual('BAD_REQUEST');
          });
      });
      it('noCheck : 通らない送信 > 成功', async () => {
        connect({ files });
        const { RAA } = window;
        return RAA.request({ checkValid: () => true, noCheck: true })
          .then((res) => { expect(res).toEqual({}); })
          .catch(() => { fail(); });
      });
      it('通常 : 過度な送信 > API_CALL_LIMIT_EXCEEDED', async () => {
        connect({ files });
        const { RAA } = window;
        const { falseMax } = RAA;
        let response;
        const request = () => RAA.request({ checkValid: () => true });
        // 初期送信
        response = await request();
        expect(response).toEqual({});
        // 規制直前まで送信
        _.range(falseMax).forEach(async () => {
          response = await request();
          expect(response).toEqual({});
        });
        // 規制になる送信
        return request()
          .then(() => { fail(); })
          .catch((error) => {
            expect(error.constructor.name).toEqual('AtsumaruApiError');
            expect(error.code).toEqual('API_CALL_LIMIT_EXCEEDED');
          });
      });
      it('noCheck : 過度な送信 > 成功', async () => {
        connect({ files });
        const { RAA } = window;
        const { falseMax } = RAA;
        let response;
        const request = () => RAA.request({ checkValid: () => true, noCheck: true });
        // 初期送信
        response = await request();
        expect(response).toEqual({});
        // 規制直前まで送信
        _.range(falseMax).forEach(async () => {
          response = await request();
          expect(response).toEqual({});
        });
        // 規制になる送信
        return request()
          .then((res) => { expect(res).toEqual({}); })
          .catch(() => { fail(); });
      });
    });
  });
});
