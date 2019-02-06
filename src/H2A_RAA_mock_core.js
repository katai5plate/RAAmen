(() => {
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
      INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    },
    send(method) {
      const now = new Date();
      const {
        interval, cooldown, isFrozen, lastRequest, freezingStart, errors,
      } = this;
      const error = () => console.error(
        `${errors.API_CALL_LIMIT_EXCEEDED}: ${(cooldown - (now - freezingStart)) / 1000} sec left`,
      );
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
