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

  const constants = {
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
      modal: 500,
    },
  };

  const collections = {
    errors: {
      BAD_REQUEST: new AtsumaruApiError('BAD_REQUEST'),
      UNAUTHORIZED: new AtsumaruApiError('UNAUTHORIZED'),
      API_CALL_LIMIT_EXCEEDED: new AtsumaruApiError('API_CALL_LIMIT_EXCEEDED'),
      FORBIDDEN: new AtsumaruApiError('FORBIDDEN'),
      INTERNAL_SERVER_ERROR: new AtsumaruApiError('INTERNAL_SERVER_ERROR'),
    },
    state: {
      scoreboards: [
        {
          boardId: 1,
          boardName: 'score board',
          myRecord: { isNewRecord: false, rank: 1, score: 0 },
          ranking: [
            { rank: 1, score: 0, userName: '' },
          ],
          myBestRecord: { rank: 1, score: 0, userName: '' },
        },
      ],
      screenshot: {
        handler: new Promise(
          (resolve) => {
            setTimeout(() => {
              resolve('default.png');
            }, constants.responseTime.normal);
          },
        ),
      },
      globalServerVariable: {
        variables: [
          {
            id: 123,
            body: {
              name: 'G-Variable',
              maxValue: Number.MAX_SAFE_INTEGER,
              minValue: Number.MIN_SAFE_INTEGER,
              value: 123456,
            },
          },
        ],
        trigger: {
          callable: [
            { id: 456, value: 100 },
          ],
          specified: [
            { id: 789, delta: { min: -100, max: 100 } },
          ],
        },
      },
    },
  };

  const methods = {
    send(doit) {
      const now = new Date();
      const {
        interval, cooldown,
        isFrozen, lastRequest, freezingStart,
        errors,
        falseCount, falseMax, severeFalse,
      } = this;
      const error = () => {
        const diff = (cooldown - (now - freezingStart));
        const left = (diff <= 0 ? cooldown : diff) / 1000;
        console.error(
          `${errors.API_CALL_LIMIT_EXCEEDED}: ${left} sec left`,
        );
      };
      if (!isFrozen && now - lastRequest < interval) {
        if (falseCount >= falseMax) {
          this.isFrozen = true;
          this.freezingStart = now;
          error();
          return;
        }
        console.warn(`Too early! : ${falseMax - falseCount} left`);
        this.falseCount += 1;
      }
      if (isFrozen) {
        if (now - freezingStart < cooldown) {
          error();
          return;
        }
        this.isFrozen = false;
        this.falseCount = 0;
      }
      console.info('REQUEST_SUCCEEDED');
      this.lastRequest = now;
      if (falseCount !== 0 && !severeFalse) this.falseCount = 0;
      doit();
    },
    async request({
      // レスポンスが返ってくる時間
      waitTime = constants.responseTime.normal,
      // 送信するデータ
      post = {},
      // 第一引数をpostとして、falseだとエラー
      checkValid = p => !!p,
      // 成功時のレスポンス
      succeeded = {},
      // 失敗時のレスポンス
      failed = collections.errors.BAD_REQUEST,
    }) {
      return new Promise(
        (resolve, reject) => {
          setTimeout(() => {
            if (checkValid(post) === false) {
              reject(failed);
            }
            resolve(succeeded);
          }, waitTime);
        },
      );
    },
    async modal({ message, decorate = s => s, checkValid = p => !!p }) {
      await this.request({
        waitTime: this.responseTime.modal,
        post: message,
        succeeded: {
          src: message,
          deco: decorate(message),
        },
        checkValid,
      })
        .then((r) => {
          console.info(`MODAL: ${r.src}`);
          alert(r.deco);
        })
        .catch(e => console.error(e));
    },
  };

  window.RAA = { ...constants, ...methods, ...collections };

  const nothing = () => { };

  window.RPGAtsumaru = {
    comment: {
      changeScene: () => window.RAA.send(nothing),
      resetAndChangeScene: () => window.RAA.send(nothing),
      pushContextFactor: () => window.RAA.send(nothing),
      pushMinorContext: () => window.RAA.send(nothing),
      setContext: () => window.RAA.send(nothing),
      cameOut: {
        subscribe: () => window.RAA.send(nothing),
      },
      posted: {
        subscribe: () => window.RAA.send(nothing),
      },
      verbose: () => window.RAA.send(nothing),
    },
    controllers: {
      defaultController: {
        subscribe: () => window.RAA.send(nothing),
      },
    },
    storage: {
      getItems: () => window.RAA.send(nothing),
      setItems: () => window.RAA.send(nothing),
      removeItem: () => window.RAA.send(nothing),
    },
    volume: {
      getCurrentValue: () => window.RAA.send(nothing),
      changed: {
        subscribe: () => window.RAA.send(nothing),
      },
    },
    popups: {
      openLink: () => window.RAA.send(nothing),
    },
    experimental: {
      query: [],
      popups: {
        displayCreatorInformationModal: () => window.RAA.send(nothing),
      },
      scoreboards: {
        setRecord: () => window.RAA.send(nothing),
        display: () => window.RAA.send(nothing),
        getRecords: () => window.RAA.send(nothing),
      },
      screenshot: {
        displayModal: () => window.RAA.send(nothing),
        setScreenshotHandler: () => window.RAA.send(nothing),
      },
      globalServerVariable: {
        getGlobalServerVariable: () => window.RAA.send(nothing),
        triggerCall: () => window.RAA.send(nothing),
      },
      storage: {
        getSharedItems: () => window.RAA.send(nothing),
      },
      user: {
        getSelfInformation: () => window.RAA.send(nothing),
        getUserInformation: () => window.RAA.send(nothing),
        getRecentUsers: () => window.RAA.send(nothing),
      },
      signal: {
        sendSignalToGlobal: () => window.RAA.send(nothing),
        getGlobalSignals: () => window.RAA.send(nothing),
        sendSignalToUser: () => window.RAA.send(nothing),
        getUserSignals: () => window.RAA.send(nothing),
      },
    },
  };
})();

const { RAA } = window;

window.RPGAtsumaru.experimental.screenshot
  .displayModal = async () => {
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
