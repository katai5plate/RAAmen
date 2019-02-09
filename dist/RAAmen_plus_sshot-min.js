
// ==============================================================================
// katai5plate / RAAmen
// Version : alpha
// Licence : MIT
// Repository : https://github.com/katai5plate/RAAmen
// ------------------------------------------------------------------------------
// Had2Apps
// WebSite : https://Had2Apps.com
// ==============================================================================
"use strict";/*:
 * @plugindesc RAAmen ＋スクリーンショットをシェアする
 * @author Had2Apps
 *
 * @help
 * これはRPGアツマールAPIのモックプラグインのアドオンです。
 * 単体では動作しません。このプラグインより先に、
 * RAAmen_core.js が読み込まれるように設定してください。
 *
 * このアドオンにより使えるようになる機能：
 * ・window.RPGAtsumaru.experimental.screenshot.displayModal
 * ・window.RPGAtsumaru.experimental.screenshot.setScreenshotHandler
 */(()=>{const{RAA}=window;if(RAA.isEnable){const{RPGAtsumaru}=window,{experimental}=RPGAtsumaru,{screenshot}=experimental;screenshot.displayModal=async()=>{const openModal=async src=>{await RAA.modal({message:src,decorate:s=>`<img src="${s}" />`})};return RAA.state.screenshot.handler.then(r=>openModal(r))},screenshot.setScreenshotHandler=async promise=>{const send=await RAA.request({waitTime:RAA.responseTime.normal,post:promise,checkValid:p=>p instanceof Promise}).then(()=>{RAA.state.screenshot.handler=promise});return send}}})();