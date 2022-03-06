# client side pawjs

Client side pawjs currently uses a field on the window object to store it's code.

This will be updated to use a modular include sometime soon (TM).

For now here's now to get started:

1.  include pawjs in the web page

    ```html
    <script src="../dist/pawdigital-pawjs.js"></script>
    ```

2.  generate a seed

    ```js
    const getRandomHex32 = () => {
      const array = new Uint32Array(32);
      window.crypto.getRandomValues(array);
      const hex = getByteArrayAsHexString(array);
      return hex;
    };

    window.localStorage.seed = getRandomHex32();
    ```

3.  look for account balances (will give an error in an unopened account)

    ```js
    const getAccountInfo = async (ix) => {
      const url = 'https://kaliumapi.appditto.com/api';
      const seed = window.localStorage.seed;
      const privateKey = await window.pawdigitalPawjs.getPrivateKey(seed, 0);
      const publicKey = await window.pawdigitalPawjs.getPublicKey(
        privateKey
      );
      const account = window.pawdigitalPawjs.getPawAccount(publicKey);
      window.pawdigitalPawjs.setPawnodeApiUrl(url);
      const accountInfo = await window.pawdigitalPawjs.getAccountInfo(
        account,
        true
      );
      return accountInfo;
    };
    ```

4.  receive pending deposits

    ```js
    const receivePawDeposits = async () => {
      const seed = window.localStorage.seed;
      const privateKey = await window.pawdigitalPawjs.getPrivateKey(seed, 0);
      const publicKey = await window.pawdigitalPawjs.getPublicKey(
        privateKey
      );
      const account = window.pawdigitalPawjs.getPawAccount(publicKey);
      return await window.pawdigitalPawjs.receivePawDepositsForSeed(
        seed,
        0,
        account
      );
    };
    ```

5.  withdraw paw.

    ```js
    const withdrawPaw = async (withdrawAccount, withdrawAmount) => {
      const seed = window.localStorage.seed;
      return await window.pawdigitalPawjs.sendPawWithdrawalFromSeed(
        seed,
        0,
        withdrawAccount,
        withdrawAmount
      );
    };
    ```
