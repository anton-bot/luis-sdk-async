An easy, async, well-documented way to call Microsoft's LUIS service.
===================

### Short sample ###

```js
const Luis = require('luis-sdk-async');

const luis = new Luis('<APP ID>', '<KEY>');

// Send request to server:
await luis.send('Call me a taxi pls');

// Get what we need:
let intent = luis.intent(); // 'Get_Service'
let service = luis.entity('Service_Type'); // 'taxi'
```

### What's it for? ###

This package provides an easy way to call LUIS (luis.ai), which is a part of
Microsoft's Cognitive Services.

It's a wrapper around Microsoft's `luis-sdk` package, which uses callbacks. 

In contrast, this package uses async-await instead of callbacks, and provides
three additional methods to easily get the data you may need most often.

### Methods and Static Members ###

#### Constructor #### 

The constructor takes two required and two optional parameters.

* `appId` - The GUID of the LUIS app. It can be obtained at luis.ai.
* `appKey` - The LUIS subscription key that can be obtained from Azure Portal.
* `domain` - Optional LUIS server's hostname. Default is 'westus.api.cognitive.microsoft.com' (West US).
* `verbose` - Optional verbosity parameter. Leave it default, which is `true`.

#### New methods (more convenient) ###

* `send(text)` - sends the specified text to the LUIS endpoint. Stores the
result inside the client instance.
* `intent()` - returns the top-scoring intent as string.
* `entity(type)` - finds the value of the first entity of the given type.

**Example:**

```js
const Luis = require('luis-sdk-async');
const luis = new Luis('<APP ID>', '<KEY>');

// Send request to server, wait for the results to arrive:
await luis.send('hey can you find a mcdonalds nearby?');

// Extract the data that we need:
let intent = luis.intent(); // 'Get_Restaurant'
let restaurant = luis.entity('Restaurant_Name'); // 'mcdonalds'
```

#### Old methods (designed by Microsoft) ####

These two methods are just the async wrappers for the two LUIS methods provided
by Microsoft's `luis-sdk` package. 

* `predict(text)` - sends the `text` to LUIS endpoint and returns the entire
response from LUIS. You need to manually extract the top intent, entities etc.
* `reply()` - undocumented function in Microsoft's SDK.

**Example:**

```js
const Luis = require('luis-sdk-async');
const luis = new Luis('<APP ID>', '<KEY>');

// Send request to server, wait for the results to arrive:
let response = await luis.predict('hey can you find a mcdonalds nearby?');

// Extract the data that we need:
let intent = response.topScoringIntent.intent; // 'Get_Restaurant'
```

### Comments and suggestions ###

If you have any comments, contact me here: https://github.com/catcher-in-the-try/