"use strict";

/*:
 * @plugindesc RPGアツマールAPIモックプラグイン（コア）
 * @author Had2Apps
 *
 * @help
 * RPGアツマールAPIのモックを作ります。
 * このプラグインに追加で別の専用プラグインを繋げて使います。
 *
 * このプラグイン自体の機能：
 * ・2019/02/07 現在のAPIメソッドの網羅
 * ・APIメソッドを呼び出した際のサーバーエラーをシミュレート
 */
(function () {
  window.RAA = {
    interval: 5000,
    cooldown: 60000,
    isFrozen: false,
    lastRequest: new Date(0),
    freezingStart: new Date(0),
    errors: {
      BAD_REQUEST: 'BAD_REQUEST',
      UNAUTHORIZED: 'UNAUTHORIZED',
      API_CALL_LIMIT_EXCEEDED: 'API_CALL_LIMIT_EXCEEDED',
      FORBIDDEN: 'FORBIDDEN',
      INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
    },
    send: function send(method) {
      var now = new Date();
      var interval = this.interval,
          cooldown = this.cooldown,
          isFrozen = this.isFrozen,
          lastRequest = this.lastRequest,
          freezingStart = this.freezingStart,
          errors = this.errors;

      var error = function error() {
        var diff = cooldown - (now - freezingStart);
        var left = (diff <= 0 ? cooldown : diff) / 1000;
        console.error("".concat(errors.API_CALL_LIMIT_EXCEEDED, ": ").concat(left, " sec left"));
      };

      if (!isFrozen && now - lastRequest < interval) {
        this.isFrozen = true;
        this.freezingStart = now;
        error();
        return;
      }

      if (isFrozen) {
        if (now - freezingStart < cooldown) {
          error();
          return;
        }

        this.isFrozen = false;
      }

      console.info('REQUEST_SUCCEEDED');
      this.lastRequest = now;
      method();
    }
  };
  window.RPGAtsumaru = {
    comment: {
      changeScene: function changeScene() {
        return window.RAA.send(function () {});
      },
      resetAndChangeScene: function resetAndChangeScene() {
        return window.RAA.send(function () {});
      },
      pushContextFactor: function pushContextFactor() {
        return window.RAA.send(function () {});
      },
      pushMinorContext: function pushMinorContext() {
        return window.RAA.send(function () {});
      },
      setContext: function setContext() {
        return window.RAA.send(function () {});
      },
      cameOut: {
        subscribe: function subscribe() {
          return window.RAA.send(function () {});
        }
      },
      posted: {
        subscribe: function subscribe() {
          return window.RAA.send(function () {});
        }
      },
      verbose: function verbose() {
        return window.RAA.send(function () {});
      }
    },
    controllers: {
      defaultController: {
        subscribe: function subscribe() {
          return window.RAA.send(function () {});
        }
      }
    },
    storage: {
      getItems: function getItems() {
        return window.RAA.send(function () {});
      },
      setItems: function setItems() {
        return window.RAA.send(function () {});
      },
      removeItem: function removeItem() {
        return window.RAA.send(function () {});
      }
    },
    volume: {
      getCurrentValue: function getCurrentValue() {
        return window.RAA.send(function () {});
      },
      changed: {
        subscribe: function subscribe() {
          return window.RAA.send(function () {});
        }
      }
    },
    popups: {
      openLink: function openLink() {
        return window.RAA.send(function () {});
      }
    },
    experimental: {
      query: [],
      popups: {
        displayCreatorInformationModal: function displayCreatorInformationModal() {
          return window.RAA.send(function () {});
        }
      },
      scoreboards: {
        setRecord: function setRecord() {
          return window.RAA.send(function () {});
        },
        display: function display() {
          return window.RAA.send(function () {});
        },
        getRecords: function getRecords() {
          return window.RAA.send(function () {});
        }
      },
      screenshot: {
        displayModal: function displayModal() {
          return window.RAA.send(function () {});
        },
        setScreenshotHandler: function setScreenshotHandler() {
          return window.RAA.send(function () {});
        }
      },
      globalServerVariable: {
        getGlobalServerVariable: function getGlobalServerVariable() {
          return window.RAA.send(function () {});
        },
        triggerCall: function triggerCall() {
          return window.RAA.send(function () {});
        }
      },
      storage: {
        getSharedItems: function getSharedItems() {
          return window.RAA.send(function () {});
        }
      },
      user: {
        getSelfInformation: function getSelfInformation() {
          return window.RAA.send(function () {});
        },
        getUserInformation: function getUserInformation() {
          return window.RAA.send(function () {});
        },
        getRecentUsers: function getRecentUsers() {
          return window.RAA.send(function () {});
        }
      },
      signal: {
        sendSignalToGlobal: function sendSignalToGlobal() {
          return window.RAA.send(function () {});
        },
        getGlobalSignals: function getGlobalSignals() {
          return window.RAA.send(function () {});
        },
        sendSignalToUser: function sendSignalToUser() {
          return window.RAA.send(function () {});
        },
        getUserSignals: function getUserSignals() {
          return window.RAA.send(function () {});
        }
      }
    }
  };
})();