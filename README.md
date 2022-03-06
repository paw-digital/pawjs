# pawjs

JavaScript utilities for the paw cryptocurrency.

make sure to use `npm i @pawdigital/pawjs@latest` to get the latest version.

now includes Ledger Nano S/X Support in a different project:
    https://github.com/paw-digital/pawjs-hw

# simple paw functions

```js
const run = async () => {
  const pawjs = require('@paw-digital/pawjs');
  pawjs.setPawnodeApiUrl('https://rpc.paw.digital');

  const crypto = require('crypto');
  const seed = crypto.randomBytes(32).toString('hex');
  const privateKey = pawjs.getPrivateKey(seed, 0);
  const publicKey = await pawjs.getPublicKey(privateKey);
  const account = pawjs.getPawAccount(publicKey);

  pawjs.getAccountInfo(account).then((res) => console.log(res));
};
run();
```

# examples of most functions as part of the cli

  <https://github.com/paw-digital/pawjs/blob/master/main.js>

# simple browser integration

  https://paw-digital.github.io/pawjs/web/

# description on how to do browser integration

  <https://github.com/paw-digital/pawjs/blob/master/docs/paw-client-side.md>

# complete documentation of all functions

  <https://github.com/paw-digital/pawjs/blob/master/docs/documentation.md>

# notes on using CLI:
  please remember to install and test before running the CLI.
```
  npm i;

  #test on osx/linux
  npm test;

  # test on windows.
  npm run win-test;

  npm start;
```

# complete documentation of camo CLI functions

  <https://github.com/paw-digital/pawjs/blob/master/docs/camo-paw-cli.md>

# complete documentation of paw CLI functions

  <https://github.com/paw-digital/pawjs/blob/master/docs/paw-cli.md>

# complete documentation of nano CLI functions

  <https://github.com/paw-digital/pawjs/blob/master/docs/nano-cli.md>
