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

  /**
   * Sends the `text` to LUIS server and stores the response inside this
   * instance.
   * @param {string} text - The message from the user which we need to send to
   *    LUIS to recognize the intent.
   */
  async send(text) {
    // Erase previous response and re-query the server:
    this.response = null;
    this.response = await this.predict(text);
  }

  /**
   * Returns the top scoring intent from the LUIS response.
   * @returns {string} The name of the top scoring intent, e.g. "None";
   */
  intent() {
    this._verifyResponseReceived();
    return this.response.topScoringIntent.intent;
  }

  /**
   * Returns the value of the first entity of the given type. If there are
   * multiple entities of that type, only the first one is returned.
   * @param {string} entityType - The entity type, e.g. "CityName";
   * @returns {string} The value of the first entity of the specified type,
   *  or null if the entity was not found.
   */
  entity(entityType) {
    this._verifyResponseReceived();

    // Loop through all entities and find one of the given type:
    for (let entity of this.response.entities) {
      if (entity.type === entityType) {
        // Check if the entity has a canonical form. If so, return the
        // canonical form. Otherwise just return whatever was recognized.
        if (entity.resolution && entity.resolution.values) {
          return entity.resolution.values[0];
        } else {
          return entity.entity;
        }
      }
    }

    return null;
  }

  /**
   * Checks that we have previous called LUIS endpoint, and received the
   * response successfully.
   */
  _verifyResponseReceived() {
    if (!this.response || !this.response.topScoringIntent) {
      throw new Error('We don\'t have any LUIS response yet. Make sure to ' +
        'await luis.send(text) first.');
    }
  }
}

module.expors = LuisAsync;