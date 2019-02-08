const wrapper = require('./wrapExport');

/**
 * プラグインを読み込む
 *
 * @param {Array<string>} props.files ファイルパス
 * @param {RAA: string, RPGAtsumaru: string} props.init 初期値
 * @param {string} props.init.RAA RAAの初期値（eval）
 * @param {string} props.init.RPGAtsumaru RPGAtsumaruの初期値（eval）
 */
const connect = (props) => {
  const { files = ['src/RAAmen_core.js'], init } = props;
  files.forEach((v, i) => {
    if (i === 0) {
      wrapper(v)(init);
    } else {
      wrapper(v)({ RAA: 'window.RAA', RPGAtsumaru: 'window.RPGAtsumaru' });
    }
  });
};

module.exports = connect;
