/*:
 * @plugindesc RAAmen コアスクリプト
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
      modal: 500,
      client: 100,
    },
  };

  const collections = {
    errors: {
      BAD_REQUEST: new AtsumaruApiError(
        'BAD_REQUEST', `いずれかの問題：${[
          '同じポップアップがすでに表示されています',
          'スクリーンショットの撮影に失敗しました',
          '正しいURLが指定されていません',
          'トリガーIDが自然数ではありません',
          'グローバルサーバー変数IDが自然数ではありません',
          'ユーザーIDリストが配列ではありません',
          'ユーザーIDリストが1～100件ではありません',
          'ユーザーIDが自然数ではありません',
          'シグナルデータが文字列型ではありません'].join(', ')}`,
      ),
      UNAUTHORIZED: new AtsumaruApiError(
        'UNAUTHORIZED', `いずれかの問題：${[
          'ログインしていません',
          '非ログイン時に共有セーブを保存できません'].join(', ')}`,
      ),
      API_CALL_LIMIT_EXCEEDED: new AtsumaruApiError(
        'API_CALL_LIMIT_EXCEEDED',
        'このアツマールAPIへのアクセス回数が多すぎます',
      ),
      FORBIDDEN: new AtsumaruApiError(
        'FORBIDDEN',
        '対象のユーザーのプレイヤー間通信が有効化されていません',
      ),
      INTERNAL_SERVER_ERROR: new AtsumaruApiError(
        'INTERNAL_SERVER_ERROR', '内部エラーが発生しました',
      ),
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
            }, params.responseTime.client);
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
    send() {
      const now = new Date();
      const {
        interval, cooldown,
        isFrozen, lastRequest, freezingStart,
        falseCount, falseMax, severeFalse,
      } = this;
      const error = () => {
        const diff = (cooldown - (now - freezingStart));
        const left = (diff <= 0 ? cooldown : diff) / 1000;
        const e = collections.errors.API_CALL_LIMIT_EXCEEDED;
        console.error(
          `${e.code}: ${left} sec left`,
        );
        return e;
      };
      if (!isFrozen && now - lastRequest < interval) {
        if (falseCount >= falseMax) {
          this.isFrozen = true;
          this.freezingStart = now;
          return { result: false, error: error() };
        }
        console.warn(`Too early! : ${falseMax - falseCount} left`);
        this.falseCount += 1;
      }
      if (isFrozen) {
        if (now - freezingStart < cooldown) {
          return { result: false, error: error() };
        }
        this.isFrozen = false;
        this.falseCount = 0;
      }
      console.info('REQUEST_SUCCEEDED');
      this.lastRequest = now;
      if (falseCount !== 0 && !severeFalse && now - lastRequest > interval) {
        this.falseCount = 0;
      }
      return { result: true, error: null };
    },
    request({
      // レスポンスが返ってくる時間
      waitTime = params.responseTime.normal,
      // 送信するデータ
      post = {},
      // 第一引数をpostとして、falseだとエラー
      checkValid = p => !!p,
      // 成功時のレスポンス
      succeeded = {},
      // 失敗時のレスポンス
      failed = collections.errors.BAD_REQUEST,
      // RAA.send()を行わないか（非通信）
      client = false,
    } = {}) {
      return new Promise(
        (resolve, reject) => {
          setTimeout(() => {
            if (client === false) {
              const { result: statResult, error } = this.send();
              if (statResult === false) {
                reject(error);
              }
            }
            if (checkValid(post) === false) {
              reject(failed);
            }
            resolve(succeeded);
          }, waitTime);
        },
      );
    },
    clientRequest({
      // 送信するデータ
      post = {},
      // 第一引数をpostとして、falseだとエラー
      checkValid = p => !!p,
      // 成功時のレスポンス
      succeeded = {},
      // 失敗時のレスポンス
      failed = collections.errors.BAD_REQUEST,
    } = {}) {
      return this.request({
        waitTime: params.responseTime.client,
        post,
        checkValid,
        succeeded,
        failed,
        client: true,
      });
    },
    async modal({
      message, decorate = s => s, checkValid = p => !!p, client = false,
    } = {}) {
      if (!message) throw new Error('message is undefined');
      const request = client
        ? this.clientRequest({
          post: message,
          succeeded: {
            src: message,
            deco: decorate(message),
          },
          checkValid,
        })
        : this.request({
          waitTime: this.responseTime.modal,
          post: message,
          succeeded: {
            src: message,
            deco: decorate(message),
          },
          checkValid,
        });
      await request
        .then((r) => {
          console.info(`MODAL: ${r.src}, DECO: ${r.deco}`);
          alert(r.deco);
        });
    },
  };

  window.RAA = { ...params, ...methods, ...collections };

  if (window.RAA.isEnable) {
    const callsLocalCompletionAPI = function (...args) {
      console.info('an EMPTY non-communication API was CALLED!', args);
      return window.RAA.clientRequest();
    };
    const callsCommunicationAPI = function (...args) {
      console.info('an EMPTY communication API was CALLED!', args);
      return window.RAA.request();
    };
    window.RPGAtsumaru = {
      comment: {
        changeScene: callsLocalCompletionAPI,
        resetAndChangeScene: callsLocalCompletionAPI,
        pushContextFactor: callsLocalCompletionAPI,
        pushMinorContext: callsLocalCompletionAPI,
        setContext: callsLocalCompletionAPI,
        cameOut: {
          subscribe: callsLocalCompletionAPI,
        },
        posted: {
          subscribe: callsLocalCompletionAPI,
        },
        verbose: callsLocalCompletionAPI,
      },
      controllers: {
        defaultController: {
          subscribe: callsLocalCompletionAPI,
        },
      },
      storage: {
        getItems: callsLocalCompletionAPI,
        setItems: callsLocalCompletionAPI,
        removeItem: callsLocalCompletionAPI,
      },
      volume: {
        getCurrentValue: callsLocalCompletionAPI,
        changed: {
          subscribe: callsLocalCompletionAPI,
        },
      },
      popups: {
        openLink: callsLocalCompletionAPI,
      },
      experimental: {
        query: [],
        popups: {
          displayCreatorInformationModal: callsLocalCompletionAPI,
        },
        scoreboards: {
          setRecord: callsCommunicationAPI,
          display: callsLocalCompletionAPI,
          getRecords: callsCommunicationAPI,
        },
        screenshot: {
          displayModal: callsLocalCompletionAPI,
          setScreenshotHandler: callsLocalCompletionAPI,
        },
        globalServerVariable: {
          getGlobalServerVariable: callsCommunicationAPI,
          triggerCall: callsCommunicationAPI,
        },
        storage: {
          getSharedItems: callsCommunicationAPI,
        },
        user: {
          getSelfInformation: callsCommunicationAPI,
          getUserInformation: callsCommunicationAPI,
          getRecentUsers: callsCommunicationAPI,
        },
        signal: {
          sendSignalToGlobal: callsCommunicationAPI,
          getGlobalSignals: callsCommunicationAPI,
          sendSignalToUser: callsCommunicationAPI,
          getUserSignals: callsCommunicationAPI,
        },
        interplayer: {
          enable: callsLocalCompletionAPI,
        },
      },
    };
  }
})();
