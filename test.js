const Luis = require('./index');

(async () => {
  const luis = new Luis('<APP ID>', '<KEY>');

  try {
    await luis.send('<TEXT TO SEND TO LUIS>');
  } catch (error) {
    console.log(error);
  }

  console.log(`intent = ${luis.intent()}`);
  console.log(`entity = ${luis.entity('<ENTITY TYPE>')}`);
})();
