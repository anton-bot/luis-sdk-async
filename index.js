/**
 * @fileoverview A wrapper for Microsoft's `luis-sdk` package that
 * uses async-await instead of callbacks.
 * @author Anton Ivanov <anton@ivanov.hk>
 */

const Luis = require('luis-sdk');

/**
 * Provides a way to call Microsoft's LUIS service.
 */
class LuisAsync {
  /**
   * Instantiates a new async LUIS client.
   * @param {string} appId - The GUID of the LUIS app. It can be obtained at
   *    luis.ai.
   * @param {string} appKey - The LUIS subscription key that can be obtained
   *    from Azure Portal.
   * @param {boolean} [verbose] - Optional verbosity parameter. Leave default,
   *    which is `true`.
   */
  constructor(appId, appKey, verbose = true) {
    // Create a new client using Microsoft's non-async luis-sdk package:
    this.luis = new Luis({ appId, appKey, verbose });

    // Just in case, save all the input params:
    this.appId = appId;
    this.appKey = appKey;
    this.verbose = verbose;
  }

  /**
   * Sends the `text` to LUIS and returns the intent and entities.
   * @param {string} text - The message from the user which we need to send to
   *    LUIS to recognize the intent.
   * @returns {object} the LUISResponse object.
   */
  predict(text) {
    // Call Microsoft's function, but convert callbacks into promises:
    return new Promise((resolve, reject) => {
      this.luis.predict(text, {
        onSuccess: data => resolve(data),
        onFailure: data => reject(data),
      });
    });
  }

  /**
   * Undocumented function created by Microsoft.
   * @param {string} text - The message from the user which we need to send to
   *    LUIS to recognize the intent.
   * @param {object} LUISresponse - A previous response from LUIS that
   *    contains the context ID of the dialog.
   * @param {string} forceSetParameterName - An undocumented parameter from
   *    Microsoft. Sets the `forceset` parameter in LUIS URL.
   */
  reply(text, LUISresponse, forceSetParameterName) {
    // Call Microsoft's function, but convert callbacks into promises:
    return new Promise((resolve, reject) => {
      this.luis.reply(text, LUISresponse, {
        onSuccess: data => resolve(data),
        onFailure: data => reject(data),
      }, forceSetParameterName);
    });
  }
}

module.expors = LuisAsync;