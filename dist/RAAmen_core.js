
// ==============================================================================
// katai5plate / RAAmen
// Version : alpha
// Licence : MIT
// Repository : https://github.com/katai5plate/RAAmen
// ------------------------------------------------------------------------------
// Had2Apps
// WebSite : https://Had2Apps.com
// ==============================================================================
"use strict";

/*:
 * @plugindesc RPGアツマールAPIモック（コア）
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
(() => {
  const AtsumaruApiError = function (code, message = '') {
    this.errorType = 'atsumaruApiError';
    this.code = code;
    this.message = message;
  };

  const params = {
    // アツマールAPIが存在しなければモック化する
    isEnable: !window.RPGAtsumaru,
    // 意図的にサーバーダウンを再現するか
    isServerError: false,
    // 何 ms に一度の通信を推奨するか
    interval: 5000,
    // 規制する時間
    cooldown: 60000,
    // 規制中
    isFrozen: false,
    // 最終リクエスト
    lastRequest: new Date(0),
    // 凍結開始時間
    freezingStart: new Date(0),
    // 推奨する通信頻度を破った回数
    falseCount: 0,
    // 許容する通信頻度違反回数
    falseMax: 3,
    // 通信頻度を守っても falseCount をリセットしない
    severeFalse: false,
    // レスポンスが返ってくる時間プリセット
    responseTime: {
      normal: 1000,
      modal: 500
    }
  };
  const collections = {
    errors: {
      BAD_REQUEST: new AtsumaruApiError('BAD_REQUEST'),
      UNAUTHORIZED: new AtsumaruApiError('UNAUTHORIZED'),
      API_CALL_LIMIT_EXCEEDED: new AtsumaruApiError('API_CALL_LIMIT_EXCEEDED'),
      FORBIDDEN: new AtsumaruApiError('FORBIDDEN'),
      INTERNAL_SERVER_ERROR: new AtsumaruApiError('INTERNAL_SERVER_ERROR')
    },
    state: {
      scoreboards: [{
        boardId: 1,
        boardName: 'score board',
        myRecord: {
          isNewRecord: false,
          rank: 1,
          score: 0
        },
        ranking: [{
          rank: 1,
          score: 0,
          userName: ''
        }],
        myBestRecord: {
          rank: 1,
          score: 0,
          userName: ''
        }
      }],
      screenshot: {
        handler: new Promise(resolve => {
          setTimeout(() => {
            resolve('default.png');
          }, params.responseTime.normal);
        })
      },
      globalServerVariable: {
        variables: [{
          id: 123,
          body: {
            name: 'G-Variable',
            maxValue: Number.MAX_SAFE_INTEGER,
            minValue: Number.MIN_SAFE_INTEGER,
            value: 123456
          }
        }],
        trigger: {
          callable: [{
            id: 456,
            value: 100
          }],
          specified: [{
            id: 789,
            delta: {
              min: -100,
              max: 100
            }
          }]
        }
      }
    }
  };
  const methods = {
    check() {
      const now = new Date();
      const {
        interval,
        cooldown,
        isFrozen,
        lastRequest,
        freezingStart,
        falseCount,
        falseMax,
        severeFalse
      } = this;

      const error = () => {
        const diff = cooldown - (now - freezingStart);
        const left = (diff <= 0 ? cooldown : diff) / 1000;
        const e = collections.errors.API_CALL_LIMIT_EXCEEDED;
        console.error(`${e.code}: ${left} sec left`);
        return e;
      };

      if (!isFrozen && now - lastRequest < interval) {
        if (falseCount >= falseMax) {
          this.isFrozen = true;
          this.freezingStart = now;
          return {
            result: false,
            error: error()
          };
        }

        console.warn(`Too early! : ${falseMax - falseCount} left`);
        this.falseCount += 1;
      }

      if (isFrozen) {
        if (now - freezingStart < cooldown) {
          return {
            result: false,
            error: error()
          };
        }

        this.isFrozen = false;
        this.falseCount = 0;
      }

      console.info('REQUEST_SUCCEEDED');
      this.lastRequest = now;

      if (falseCount !== 0 && !severeFalse && now - lastRequest > interval) {
        this.falseCount = 0;
      }

      return {
        result: true
      };
    },

    async request({
      // レスポンスが返ってくる時間
      waitTime = params.responseTime.normal,
      // 送信するデータ
      post = {},
      // 第一引数をpostとして、falseだとエラー
      checkValid = p => !!p,
      // 成功時のレスポンス
      succeeded = {},
      // 失敗時のレスポンス
      failed = collections.errors.BAD_REQUEST
    }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const {
            result: statResult,
            error
          } = this.check();

          if (statResult === false) {
            reject(error);
          }

          if (checkValid(post) === false) {
            reject(failed);
          }

          resolve(succeeded);
        }, waitTime);
      });
    },

    async modal({
      message,
      decorate = s => s,
      checkValid = p => !!p
    }) {
      await this.request({
        waitTime: this.responseTime.modal,
        post: message,
        succeeded: {
          src: message,
          deco: decorate(message)
        },
        checkValid
      }).then(r => {
        console.info(`MODAL: ${r.src}`);
        alert(r.deco);
      }).catch(e => console.error(e));
    }

  };
  window.RAA = { ...params,
    ...methods,
    ...collections
  };

  if (!window.RPGAtsumaru) {
    window.RPGAtsumaru = {
      comment: {
        changeScene: () => window.RAA.check(),
        resetAndChangeScene: () => window.RAA.check(),
        pushContextFactor: () => window.RAA.check(),
        pushMinorContext: () => window.RAA.check(),
        setContext: () => window.RAA.check(),
        cameOut: {
          subscribe: () => window.RAA.check()
        },
        posted: {
          subscribe: () => window.RAA.check()
        },
        verbose: () => window.RAA.check()
      },
      controllers: {
        defaultController: {
          subscribe: () => window.RAA.check()
        }
      },
      storage: {
        getItems: () => window.RAA.check(),
        setItems: () => window.RAA.check(),
        removeItem: () => window.RAA.check()
      },
      volume: {
        getCurrentValue: () => window.RAA.check(),
        changed: {
          subscribe: () => window.RAA.check()
        }
      },
      popups: {
        openLink: () => window.RAA.check()
      },
      experimental: {
        query: [],
        popups: {
          displayCreatorInformationModal: () => window.RAA.check()
        },
        scoreboards: {
          setRecord: () => window.RAA.check(),
          display: () => window.RAA.check(),
          getRecords: () => window.RAA.check()
        },
        screenshot: {
          displayModal: () => window.RAA.check(),
          setScreenshotHandler: () => window.RAA.check()
        },
        globalServerVariable: {
          getGlobalServerVariable: () => window.RAA.check(),
          triggerCall: () => window.RAA.check()
        },
        storage: {
          getSharedItems: () => window.RAA.check()
        },
        user: {
          getSelfInformation: () => window.RAA.check(),
          getUserInformation: () => window.RAA.check(),
          getRecentUsers: () => window.RAA.check()
        },
        signal: {
          sendSignalToGlobal: () => window.RAA.check(),
          getGlobalSignals: () => window.RAA.check(),
          sendSignalToUser: () => window.RAA.check(),
          getUserSignals: () => window.RAA.check()
        }
      }
    };
  }
})();