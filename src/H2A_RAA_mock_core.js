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

(() => {
  window.RAA = {
    interval: 5000, // 何 ms に一度の通信を推奨するか
    cooldown: 60000, // 規制する時間
    isFrozen: false, // 規制中
    lastRequest: new Date(0), // 最終リクエスト
    freezingStart: new Date(0), // 凍結開始時間
    falseCount: 0, // 推奨する通信頻度を破った回数
    falseMax: 3, // 許容する通信頻度違反回数
    severeFalse: false, // 通信頻度を守っても falseCount をリセットしない
    errors: {
      BAD_REQUEST: 'BAD_REQUEST',
      UNAUTHORIZED: 'UNAUTHORIZED',
      API_CALL_LIMIT_EXCEEDED: 'API_CALL_LIMIT_EXCEEDED',
      FORBIDDEN: 'FORBIDDEN',
      INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    },
    send(method) {
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
      method();
    },
  };

  window.RPGAtsumaru = {
    comment: {
      changeScene: () => window.RAA.send(() => { }),
      resetAndChangeScene: () => window.RAA.send(() => { }),
      pushContextFactor: () => window.RAA.send(() => { }),
      pushMinorContext: () => window.RAA.send(() => { }),
      setContext: () => window.RAA.send(() => { }),
      cameOut: {
        subscribe: () => window.RAA.send(() => { }),
      },
      posted: {
        subscribe: () => window.RAA.send(() => { }),
      },
      verbose: () => window.RAA.send(() => { }),
    },
    controllers: {
      defaultController: {
        subscribe: () => window.RAA.send(() => { }),
      },
    },
    storage: {
      getItems: () => window.RAA.send(() => { }),
      setItems: () => window.RAA.send(() => { }),
      removeItem: () => window.RAA.send(() => { }),
    },
    volume: {
      getCurrentValue: () => window.RAA.send(() => { }),
      changed: {
        subscribe: () => window.RAA.send(() => { }),
      },
    },
    popups: {
      openLink: () => window.RAA.send(() => { }),
    },
    experimental: {
      query: [],
      popups: {
        displayCreatorInformationModal: () => window.RAA.send(() => { }),
      },
      scoreboards: {
        setRecord: () => window.RAA.send(() => { }),
        display: () => window.RAA.send(() => { }),
        getRecords: () => window.RAA.send(() => { }),
      },
      screenshot: {
        displayModal: () => window.RAA.send(() => { }),
        setScreenshotHandler: () => window.RAA.send(() => { }),
      },
      globalServerVariable: {
        getGlobalServerVariable: () => window.RAA.send(() => { }),
        triggerCall: () => window.RAA.send(() => { }),
      },
      storage: {
        getSharedItems: () => window.RAA.send(() => { }),
      },
      user: {
        getSelfInformation: () => window.RAA.send(() => { }),
        getUserInformation: () => window.RAA.send(() => { }),
        getRecentUsers: () => window.RAA.send(() => { }),
      },
      signal: {
        sendSignalToGlobal: () => window.RAA.send(() => { }),
        getGlobalSignals: () => window.RAA.send(() => { }),
        sendSignalToUser: () => window.RAA.send(() => { }),
        getUserSignals: () => window.RAA.send(() => { }),
      },
    },
  };
})();
