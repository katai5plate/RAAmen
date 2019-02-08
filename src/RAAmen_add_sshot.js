/*:
 * @plugindesc RPGアツマールAPIモック（＋スクリーンショット）
 * @author Had2Apps
 *
 * @help
 * これはRPGアツマールAPIのモックプラグインのアドオンです。
 *
 * このアドオンにより使えるようになる機能：
 * ・window.RPGAtsumaru.experimental.screenshot.displayModal
 * ・window.RPGAtsumaru.experimental.screenshot.setScreenshotHandler
 */

(() => {
  const { RAA } = window;

  if (RAA.isEnable) {
    const { RPGAtsumaru } = window;
    const { experimental } = RPGAtsumaru;
    const { screenshot } = experimental;

    screenshot.displayModal = async () => {
      const openModal = async (src) => {
        await RAA.modal({
          message: src,
          decorate: s => `<img src="${s}" />`,
        });
      };
      RAA.state.screenshot.handler
        .then(r => openModal(r))
        .catch(e => console.error(e));
    };

    screenshot.setScreenshotHandler = async (promise) => {
      await RAA.request({
        waitTime: RAA.responseTime.normal,
        post: promise,
        checkValid: p => p instanceof Promise,
      })
        .then(() => { RAA.state.screenshot.handler = promise; })
        .catch(e => console.error(e));
    };
  }
})();
