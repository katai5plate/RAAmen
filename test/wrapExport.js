/* eslint-disable no-eval */

const fs = require('fs');

/**
 * プラグインをevalする形で読み込む
 *
 * @param {string} path ルートからの拡張子つき相対パス
 */
const wrapper = (path) => {
  const code = fs.readFileSync(
    `${process.cwd()}/${path}`,
    { encoding: 'utf8' },
  );
  /**
   * 初期値をeval文字列で設定
   *
   * @param {RAA: string, RPGAtsumaru: string} init 初期値
   * @param {string} init.RAA RAAの初期値（eval）
   * @param {string} init.RPGAtsumaru RPGAtsumaruの初期値（eval）
   */
  const doit = (init) => {
    const { RAA = undefined, RPGAtsumaru = undefined } = init || {};
    eval(`window.RAA = ${RAA}; window.RPGAtsumaru = ${RPGAtsumaru}; ${code}`);
  };
  return doit;
};

module.exports = wrapper;
