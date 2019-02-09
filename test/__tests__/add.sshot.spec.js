/* eslint-disable no-unused-vars */
const connect = require('../connect');

describe('addon: sshot', () => {
  // const fail = () => expect().toEqual('FAILED');
  const files = [
    'src/RAAmen_core.js',
    'src/RAAmen_add_sshot.js',
  ];
  beforeEach(() => {
    global.alert = jest.fn();
  });
  it('APIが存在しない: モックを生成', () => {
    connect({ files });
    const { RPGAtsumaru } = window;
    const { displayModal, setScreenshotHandler } = RPGAtsumaru.experimental.screenshot;
    expect(displayModal).toBeTruthy();
    expect(setScreenshotHandler).toBeTruthy();
  });
  it('displayModal: Promise が返る', async () => {
    connect({ files });
    const { RPGAtsumaru } = window;
    const { displayModal } = RPGAtsumaru.experimental.screenshot;
    const response = displayModal();
    expect(response.constructor.name).toEqual('Promise');
  });
});
