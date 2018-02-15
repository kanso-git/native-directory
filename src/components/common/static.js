
/* eslint global-require: "off" */
const noImageIcon = 'data:image/png;base64,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';
const momentStatic = require('moment');
require('moment/locale/fr');

momentStatic.locale('fr');

export {
  noImageIcon,
  momentStatic,
};
