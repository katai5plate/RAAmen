
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
 * @plugindesc RPGアツマールAPIモック（＋スクリーンショット）
 * @author Had2Apps
 *
 * @help
 * これはRPGアツマールAPIのモックプラグインのアドオンです。
 *
 * このアドオンにより使えるようになる機能：
 * ・window.RPGAtsumaru.experimental.screenshot.displayModal
 * ・window.RPGAtsumaru.experimental.screenshot.setScreenshotHandler
 */(()=>{const{RAA}=window;if(RAA.isEnable){const{RPGAtsumaru}=window,{experimental}=RPGAtsumaru,{screenshot}=experimental;screenshot.displayModal=async()=>{const openModal=async src=>{await RAA.modal({message:src,decorate:s=>`<img src="${s}" />`})};RAA.state.screenshot.handler.then(r=>openModal(r)).catch(e=>console.error(e))},screenshot.setScreenshotHandler=async promise=>{await RAA.request({waitTime:RAA.responseTime.normal,post:promise,checkValid:p=>p instanceof Promise}).then(()=>{RAA.state.screenshot.handler=promise}).catch(e=>console.error(e))}}})();