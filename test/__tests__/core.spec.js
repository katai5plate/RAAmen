/* eslint-disable no-unused-vars */
const connect = require('../connect');

describe('core', () => {
  const files = [
    'src/RAAmen_core.js',
  ];

  it('APIが存在しない: RAAを生成', () => {
    connect({ files });
    const { RAA } = window;
    expect(RAA).toBeTruthy();
  });

  it('APIが存在しない: モックを生成', () => {
    connect({ files });
    const { RAA, RPGAtsumaru } = window;
    expect(RAA).toBeTruthy();
    expect(RAA.isEnable).toBeTruthy();
    expect(RPGAtsumaru).toBeTruthy();
  });

  it('APIが存在する: RAAを生成', () => {
    connect({ files, init: { RPGAtsumaru: '{}' } });
    const { RAA } = window;
    expect(RAA).toBeTruthy();
  });

  it('APIが存在する: モックを生成', () => {
    connect({ files, init: { RPGAtsumaru: '{}' } });
    const { RAA, RPGAtsumaru } = window;
    expect(RAA).toBeTruthy();
    expect(RAA.isEnable).toBeFalsy();
    expect(RPGAtsumaru).toEqual({});
  });
});
