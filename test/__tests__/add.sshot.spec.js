/* eslint-disable no-unused-vars */
const connect = require('../connect');

describe('addon: sshot', () => {
  const files = [
    'src/RAAmen_core.js',
    'src/RAAmen_add_sshot.js',
  ];
  it('APIが存在しない: モックを生成', () => {
    connect({ files });
    const { RPGAtsumaru } = window;
    const { displayModal, setScreenshotHandler } = RPGAtsumaru.experimental.screenshot;
    expect(displayModal).toBeTruthy();
    expect(setScreenshotHandler).toBeTruthy();
  });
});
