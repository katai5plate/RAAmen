/* eslint-disable no-unused-vars */
const _ = require('lodash');
const connect = require('../connect');

describe('core', () => {
  const fail = () => expect().toEqual('FAILED');
  const files = [
    'src/RAAmen_core.js',
  ];
  describe('RAA.clientRequest()', () => {
    it('存在する', () => {
      connect({ files });
      const { RAA } = window;
      expect(RAA.clientRequest).toBeTruthy();
    });
    it('通常 : 送信 > 成功', async () => {
      connect({ files });
      const { RAA } = window;
      return RAA.clientRequest({ checkValid: () => true })
        .then((res) => { expect(res).toEqual({}); })
        .catch(() => { fail(); });
    });
    it('通常 : 通らない送信 > BAD_REQUEST', async () => {
      connect({ files });
      const { RAA } = window;
      return RAA.clientRequest({ checkValid: () => false })
        .then(() => { fail(); })
        .catch((error) => {
          expect(error.constructor.name).toEqual('AtsumaruApiError');
          expect(error.code).toEqual('BAD_REQUEST');
        });
    });
    it('通常 : 過度な送信 > 成功', async () => {
      connect({ files });
      const { RAA } = window;
      const { falseMax } = RAA;
      let response;
      const request = () => RAA.request({ checkValid: () => true, client: true });
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
