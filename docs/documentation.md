## Objects

<dl>
<dt><a href="#Main">Main</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#PawUtil">PawUtil</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#DepositUtil">DepositUtil</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#PawnodeApi">PawnodeApi</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#PawParts">PawParts</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#AccountValidationInfo">AccountValidationInfo</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Main"></a>

## Main : <code>object</code>
**Kind**: global namespace  

* [Main](#Main) : <code>object</code>
    * [.setPawnodeApi(_pawnodeApi)](#Main.setPawnodeApi) ⇒ <code>undefined</code>
    * [.setAuth(auth)](#Main.setAuth) ⇒ <code>undefined</code>
    * [.setPawnodeApiUrl(url)](#Main.setPawnodeApiUrl) ⇒ <code>undefined</code>

<a name="Main.setPawnodeApi"></a>

### Main.setPawnodeApi(_pawnodeApi) ⇒ <code>undefined</code>
Sets the Pawnode Api (useful for overriding some methods)

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| _pawnodeApi | <code>string</code> | the new pawnodeApi |

<a name="Main.setAuth"></a>

### Main.setAuth(auth) ⇒ <code>undefined</code>
Sets the Pawnode Api Authorization

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| auth | <code>string</code> | the new authorization |

<a name="Main.setPawnodeApiUrl"></a>

### Main.setPawnodeApiUrl(url) ⇒ <code>undefined</code>
Sets the URL to use for the node behind the Pawnode Api

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the new url |

<a name="PawUtil"></a>

## PawUtil : <code>object</code>
**Kind**: global namespace  

* [PawUtil](#PawUtil) : <code>object</code>
    * [.getPawPartsFromDecimal(decimalAmount)](#PawUtil.getPawPartsFromDecimal) ⇒ [<code>PawParts</code>](#PawParts)
    * [.getPawPartsAsDecimal(pawParts)](#PawUtil.getPawPartsAsDecimal) ⇒ <code>string</code>
    * [.getPawDecimalAmountAsRaw(amount)](#PawUtil.getPawDecimalAmountAsRaw) ⇒ <code>string</code>
    * [.getPawPartsDescription(pawParts)](#PawUtil.getPawPartsDescription) ⇒ <code>string</code>
    * [.sendAmountToPawAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash)](#PawUtil.sendAmountToPawAccountWithRepresentativeAndPrevious) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.sendAmountToNanoAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash)](#PawUtil.sendAmountToNanoAccountWithRepresentativeAndPrevious) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.sendAmountToPawAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback)](#PawUtil.sendAmountToPawAccount) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.sendAmountToNanoAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback)](#PawUtil.sendAmountToNanoAccount) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.changePawRepresentativeForSeed(seed, seedIx, representative)](#PawUtil.changePawRepresentativeForSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.changeNanoRepresentativeForSeed(seed, seedIx, representative)](#PawUtil.changeNanoRepresentativeForSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getPawAccountFromSeed(seed, seedIx)](#PawUtil.getPawAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getNanoAccountFromSeed(seed, seedIx)](#PawUtil.getNanoAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.openPawAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw)](#PawUtil.openPawAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.openNanoAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw)](#PawUtil.openNanoAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getBlockHash(block)](#PawUtil.getBlockHash) ⇒ <code>string</code>
    * [.signHash(privateKey, hash)](#PawUtil.signHash) ⇒ <code>string</code>
    * [.verify(hash, signature, publicKey)](#PawUtil.verify) ⇒ <code>string</code>
    * [.getSignature(privateKey, block)](#PawUtil.getSignature) ⇒ <code>string</code>
    * [.getBytesFromHex(hex)](#PawUtil.getBytesFromHex) ⇒ <code>Uint8Array</code>
    * [.getHexFromBytes(bytes)](#PawUtil.getHexFromBytes) ⇒ <code>string</code>
    * [.getWorkUsingCpu(hash, workBytes)](#PawUtil.getWorkUsingCpu) ⇒ <code>string</code>
    * [.getRawStrFromPawStr(amountStr, amountPrefix)](#PawUtil.getRawStrFromPawStr) ⇒ <code>string</code>
    * [.getRawStrFromPawoshiStr(amountStr, amountPrefix)](#PawUtil.getRawStrFromPawoshiStr) ⇒ <code>string</code>
    * [.getRawStrFromNanoStr(amountStr, amountPrefix)](#PawUtil.getRawStrFromNanoStr) ⇒ <code>string</code>
    * [.getRawStrFromNanoshiStr(amountStr, amountPrefix)](#PawUtil.getRawStrFromNanoshiStr) ⇒ <code>string</code>
    * [.getPawAccount(publicKey)](#PawUtil.getPawAccount) ⇒ <code>string</code>
    * [.getNanoAccount(publicKey)](#PawUtil.getNanoAccount) ⇒ <code>string</code>
    * [.getPawPartsFromRaw(amountRawStr)](#PawUtil.getPawPartsFromRaw) ⇒ [<code>PawParts</code>](#PawParts)
    * [.getNanoPartsFromRaw(amountRawStr)](#PawUtil.getNanoPartsFromRaw) ⇒ [<code>PawParts</code>](#PawParts)
    * [.getRawStrFromMajorAmountStr(amountStr, amountPrefix)](#PawUtil.getRawStrFromMajorAmountStr) ⇒ <code>string</code>
    * [.getRawStrFromMinorAmountStr(amountStr, amountPrefix)](#PawUtil.getRawStrFromMinorAmountStr) ⇒ <code>string</code>
    * [.getAmountPartsFromRaw(amountRawStr, amountPrefix)](#PawUtil.getAmountPartsFromRaw) ⇒ [<code>PawParts</code>](#PawParts)
    * [.getAccountPublicKey(account)](#PawUtil.getAccountPublicKey) ⇒ <code>string</code>
    * [.getAccountSuffix(publicKey)](#PawUtil.getAccountSuffix) ⇒ <code>string</code>
    * [.getAccount(publicKey, accountPrefix)](#PawUtil.getAccount) ⇒ <code>string</code>
    * [.isWorkValid(hashBytes, workBytes)](#PawUtil.isWorkValid) ⇒ <code>boolean</code>
    * [.getZeroedWorkBytes()](#PawUtil.getZeroedWorkBytes) ⇒ <code>Uint8Array</code>
    * [.getPublicKey(privateKey)](#PawUtil.getPublicKey) ⇒ <code>string</code>
    * [.isSeedValid(seed, seedIx)](#PawUtil.isSeedValid) ⇒ <code>object</code>
    * [.getPrivateKey(seed, seedIx)](#PawUtil.getPrivateKey) ⇒ <code>string</code>
    * [.getPawAccountValidationInfo(account)](#PawUtil.getPawAccountValidationInfo) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)
    * [.getNanoAccountValidationInfo(account)](#PawUtil.getNanoAccountValidationInfo) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)

<a name="PawUtil.getPawPartsFromDecimal"></a>

### PawUtil.getPawPartsFromDecimal(decimalAmount) ⇒ [<code>PawParts</code>](#PawParts)
converts amount from decimal to pawParts.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: [<code>PawParts</code>](#PawParts) - returns the paw parts of the decimal amount.  

| Param | Type | Description |
| --- | --- | --- |
| decimalAmount | <code>string</code> | the decimal amount of paws. |

<a name="PawUtil.getPawPartsAsDecimal"></a>

### PawUtil.getPawPartsAsDecimal(pawParts) ⇒ <code>string</code>
converts amount from pawParts to decimal.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - returns the decimal amount of paws.  

| Param | Type | Description |
| --- | --- | --- |
| pawParts | [<code>PawParts</code>](#PawParts) | the paw parts to describe. |

<a name="PawUtil.getPawDecimalAmountAsRaw"></a>

### PawUtil.getPawDecimalAmountAsRaw(amount) ⇒ <code>string</code>
converts amount from decimal to raw.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - returns amount in raw.  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>string</code> | the decimal amount. |

<a name="PawUtil.getPawPartsDescription"></a>

### PawUtil.getPawPartsDescription(pawParts) ⇒ <code>string</code>
describes the paw parts in an english description.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - returns the description of the paw parts.  

| Param | Type | Description |
| --- | --- | --- |
| pawParts | [<code>PawParts</code>](#PawParts) | the paw parts to describe. |

<a name="PawUtil.sendAmountToPawAccountWithRepresentativeAndPrevious"></a>

### PawUtil.sendAmountToPawAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the account with an optional representative and
previous block hash.
If the representative is not sent, it will be pulled from the api.
If the previous is not sent, it will be pulled from the api.
Be very careful with previous, as setting it incorrectly
can cause an incorrect amount of funds to be sent.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| representative | <code>string</code> | the representative (optional). |
| previousHash | <code>string</code> | the previous hash (optional). |

<a name="PawUtil.sendAmountToNanoAccountWithRepresentativeAndPrevious"></a>

### PawUtil.sendAmountToNanoAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the account with an optional representative and
previous block hash.
If the representative is not sent, it will be pulled from the api.
If the previous is not sent, it will be pulled from the api.
Be very careful with previous, as setting it incorrectly
can cause an incorrect amount of funds to be sent.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| representative | <code>string</code> | the representative (optional). |
| previousHash | <code>string</code> | the previous hash (optional). |

<a name="PawUtil.sendAmountToPawAccount"></a>

### PawUtil.sendAmountToPawAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the paw account with a callback for success and failure.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| successCallback | <code>string</code> | the callback to call upon success. |
| failureCallback | <code>string</code> | the callback to call upon failure. |

<a name="PawUtil.sendAmountToNanoAccount"></a>

### PawUtil.sendAmountToNanoAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the nano account with a callback for success and failure.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| successCallback | <code>string</code> | the callback to call upon success. |
| failureCallback | <code>string</code> | the callback to call upon failure. |

<a name="PawUtil.changePawRepresentativeForSeed"></a>

### PawUtil.changePawRepresentativeForSeed(seed, seedIx, representative) ⇒ <code>Promise.&lt;string&gt;</code>
Sets the rep for an account with a given seed.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the change.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |

<a name="PawUtil.changeNanoRepresentativeForSeed"></a>

### PawUtil.changeNanoRepresentativeForSeed(seed, seedIx, representative) ⇒ <code>Promise.&lt;string&gt;</code>
Sets the rep for an account with a given seed.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the change.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |

<a name="PawUtil.getPawAccountFromSeed"></a>

### PawUtil.getPawAccountFromSeed(seed, seedIx) ⇒ <code>Promise.&lt;string&gt;</code>
Get the paw account with a given seed and index.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="PawUtil.getNanoAccountFromSeed"></a>

### PawUtil.getNanoAccountFromSeed(seed, seedIx) ⇒ <code>Promise.&lt;string&gt;</code>
Get the paw account with a given seed and index.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="PawUtil.openPawAccountFromSeed"></a>

### PawUtil.openPawAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw) ⇒ <code>Promise.&lt;string&gt;</code>
Open a paw account with a given seed.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the open.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| pendingBlockHash | <code>string</code> | the pending block hash. |
| pendingValueRaw | <code>string</code> | the pending block hash. |

<a name="PawUtil.openNanoAccountFromSeed"></a>

### PawUtil.openNanoAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw) ⇒ <code>Promise.&lt;string&gt;</code>
Open a nano account with a given seed.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the open.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| pendingBlockHash | <code>string</code> | the pending block hash. |
| pendingValueRaw | <code>string</code> | the pending block hash. |

<a name="PawUtil.getBlockHash"></a>

### PawUtil.getBlockHash(block) ⇒ <code>string</code>
Get the hash for a given block.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the block's hash.  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>string</code> | the seed to use to find the account. |

<a name="PawUtil.signHash"></a>

### PawUtil.signHash(privateKey, hash) ⇒ <code>string</code>
signs a hash.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the block's hash.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key to use to sign. |
| hash | <code>string</code> | the hash to sign. |

<a name="PawUtil.verify"></a>

### PawUtil.verify(hash, signature, publicKey) ⇒ <code>string</code>
verifys a hash.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - true if verification passed.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | the hash to verify. |
| signature | <code>string</code> | the signature to verify. |
| publicKey | <code>string</code> | the public key to use to sign. |

<a name="PawUtil.getSignature"></a>

### PawUtil.getSignature(privateKey, block) ⇒ <code>string</code>
Get the signature for a given block (gets the hash of the block, and signs the hash).

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the block's signature.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key used to sign the block. |
| block | <code>string</code> | the block to sign. |

<a name="PawUtil.getBytesFromHex"></a>

### PawUtil.getBytesFromHex(hex) ⇒ <code>Uint8Array</code>
Converts a hex string to bytes in a Uint8Array.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Uint8Array</code> - the bytes in a Uint8Array.  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | the hex string to use. |

<a name="PawUtil.getHexFromBytes"></a>

### PawUtil.getHexFromBytes(bytes) ⇒ <code>string</code>
Converts bytes in a Uint8Array to a hex string.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the hex string.  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Uint8Array</code> | the bytes to use. |

<a name="PawUtil.getWorkUsingCpu"></a>

### PawUtil.getWorkUsingCpu(hash, workBytes) ⇒ <code>string</code>
gets work bytes using the CPU.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the work bytes as a hex string.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | the hash to use to calculate work bytes. |
| workBytes | <code>Uint8Array</code> | the Uint8Array(8) used to store temporary calculations. |

<a name="PawUtil.getRawStrFromPawStr"></a>

### PawUtil.getRawStrFromPawStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the paw as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="PawUtil.getRawStrFromPawoshiStr"></a>

### PawUtil.getRawStrFromPawoshiStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the paw as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="PawUtil.getRawStrFromNanoStr"></a>

### PawUtil.getRawStrFromNanoStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the paw as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="PawUtil.getRawStrFromNanoshiStr"></a>

### PawUtil.getRawStrFromNanoshiStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the paw as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="PawUtil.getPawAccount"></a>

### PawUtil.getPawAccount(publicKey) ⇒ <code>string</code>
Get the paw account for a given public key.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |

<a name="PawUtil.getNanoAccount"></a>

### PawUtil.getNanoAccount(publicKey) ⇒ <code>string</code>
Get the paw account for a given public key.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |

<a name="PawUtil.getPawPartsFromRaw"></a>

### PawUtil.getPawPartsFromRaw(amountRawStr) ⇒ [<code>PawParts</code>](#PawParts)
Get the paw parts (paw, pawoshi, raw) for a given raw value.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: [<code>PawParts</code>](#PawParts) - the paw parts.  

| Param | Type | Description |
| --- | --- | --- |
| amountRawStr | <code>string</code> | the raw amount, as a string. |

<a name="PawUtil.getNanoPartsFromRaw"></a>

### PawUtil.getNanoPartsFromRaw(amountRawStr) ⇒ [<code>PawParts</code>](#PawParts)
Get the nano parts nano, nanoshi, raw) for a given raw value.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: [<code>PawParts</code>](#PawParts) - the paw parts.  

| Param | Type | Description |
| --- | --- | --- |
| amountRawStr | <code>string</code> | the raw amount, as a string. |

<a name="PawUtil.getRawStrFromMajorAmountStr"></a>

### PawUtil.getRawStrFromMajorAmountStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the paw as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="PawUtil.getRawStrFromMinorAmountStr"></a>

### PawUtil.getRawStrFromMinorAmountStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts a pawoshi amount into a raw amount.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the paw as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the pawoshi, as a string. |
| amountPrefix | <code>string</code> | the amount prefix, as a string. |

<a name="PawUtil.getAmountPartsFromRaw"></a>

### PawUtil.getAmountPartsFromRaw(amountRawStr, amountPrefix) ⇒ [<code>PawParts</code>](#PawParts)
Get the paw parts (paw, pawoshi, raw) for a given raw value.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: [<code>PawParts</code>](#PawParts) - the paw parts.  

| Param | Type | Description |
| --- | --- | --- |
| amountRawStr | <code>string</code> | the raw amount, as a string. |
| amountPrefix | <code>string</code> | the amount prefix, as a string. |

<a name="PawUtil.getAccountPublicKey"></a>

### PawUtil.getAccountPublicKey(account) ⇒ <code>string</code>
Get the public key for a given account.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the public key.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account. |

<a name="PawUtil.getAccountSuffix"></a>

### PawUtil.getAccountSuffix(publicKey) ⇒ <code>string</code>
Get the account suffix for a given public key (everything but paw_ or camo_ or nano_).

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the account suffix.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |

<a name="PawUtil.getAccount"></a>

### PawUtil.getAccount(publicKey, accountPrefix) ⇒ <code>string</code>
Get the account for a given public key.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |
| accountPrefix | <code>string</code> | the prefix. paw_ or nano_. |

<a name="PawUtil.isWorkValid"></a>

### PawUtil.isWorkValid(hashBytes, workBytes) ⇒ <code>boolean</code>
returns true if the work (in bytes) for the hash (in bytes) is valid.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>boolean</code> - true if the work is valid for the hash.  

| Param | Type | Description |
| --- | --- | --- |
| hashBytes | <code>string</code> | the hash bytes to check. |
| workBytes | <code>string</code> | the work bytes to check. |

<a name="PawUtil.getZeroedWorkBytes"></a>

### PawUtil.getZeroedWorkBytes() ⇒ <code>Uint8Array</code>
creates a new Uint8Array(8) to calculate work bytes.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>Uint8Array</code> - the bytes in a Uint8Array.  
<a name="PawUtil.getPublicKey"></a>

### PawUtil.getPublicKey(privateKey) ⇒ <code>string</code>
Get the public key for a given private key.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the public key.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key. |

<a name="PawUtil.isSeedValid"></a>

### PawUtil.isSeedValid(seed, seedIx) ⇒ <code>object</code>
validates a seed.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>object</code> - {valid:[true/false] message:[if false, why]}.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to validate. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="PawUtil.getPrivateKey"></a>

### PawUtil.getPrivateKey(seed, seedIx) ⇒ <code>string</code>
Get the private key for a given seed.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: <code>string</code> - the private key.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="PawUtil.getPawAccountValidationInfo"></a>

### PawUtil.getPawAccountValidationInfo(account) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)
Returns an object saying if the paw account is valid or not.
If the account is not valid, the message describes why it is not valid.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: [<code>AccountValidationInfo</code>](#AccountValidationInfo) - an object saying if the account is valid, and why.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account. |

<a name="PawUtil.getNanoAccountValidationInfo"></a>

### PawUtil.getNanoAccountValidationInfo(account) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)
Returns an object saying if the nano account is valid or not.
If the account is not valid, the message describes why it is not valid.

**Kind**: static method of [<code>PawUtil</code>](#PawUtil)  
**Returns**: [<code>AccountValidationInfo</code>](#AccountValidationInfo) - an object saying if the account is valid, and why.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account. |

<a name="DepositUtil"></a>

## DepositUtil : <code>object</code>
**Kind**: global namespace  

* [DepositUtil](#DepositUtil) : <code>object</code>
    * [.receiveNanoDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash)](#DepositUtil.receiveNanoDepositsForSeed) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.receivePawDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash)](#DepositUtil.receivePawDepositsForSeed) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="DepositUtil.receiveNanoDepositsForSeed"></a>

### DepositUtil.receiveNanoDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash) ⇒ <code>Promise.&lt;object&gt;</code>
Recieve deposits for a nano account with a given seed.

**Kind**: static method of [<code>DepositUtil</code>](#DepositUtil)  
**Returns**: <code>Promise.&lt;object&gt;</code> - returns the response returned by the receive.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| specificPendingBlockHash | <code>string</code> | a specific block hash to receive (optional). |

<a name="DepositUtil.receivePawDepositsForSeed"></a>

### DepositUtil.receivePawDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash) ⇒ <code>Promise.&lt;object&gt;</code>
Recieve deposits for a paw account with a given seed.

**Kind**: static method of [<code>DepositUtil</code>](#DepositUtil)  
**Returns**: <code>Promise.&lt;object&gt;</code> - returns the response returned by the receive.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| specificPendingBlockHash | <code>string</code> | a specific block hash to receive (optional). |

<a name="PawnodeApi"></a>

## PawnodeApi : <code>object</code>
**Kind**: global namespace  

* [PawnodeApi](#PawnodeApi) : <code>object</code>
    * [.getAccountBalanceRaw(account)](#PawnodeApi.getAccountBalanceRaw) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getAccountBalanceAndPendingRaw(account)](#PawnodeApi.getAccountBalanceAndPendingRaw) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountsBalances(accounts)](#PawnodeApi.getAccountsBalances) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountHistory(account, count, head, raw)](#PawnodeApi.getAccountHistory) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountInfo(account, representativeFlag)](#PawnodeApi.getAccountInfo) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getBlockCount()](#PawnodeApi.getBlockCount) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountsPending(accounts, count, source)](#PawnodeApi.getAccountsPending) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.setAuth(authString)](#PawnodeApi.setAuth) ⇒ <code>undefined</code>

<a name="PawnodeApi.getAccountBalanceRaw"></a>

### PawnodeApi.getAccountBalanceRaw(account) ⇒ <code>Promise.&lt;string&gt;</code>
Get the balance, in raw, for an account.

(use other methods like getPawPartsFromRaw to convert to paw or pawoshi)

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_balances](https://docs.nano.org/commands/rpc-protocol/#accounts_balances)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the account's balance, in raw.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |

<a name="PawnodeApi.getAccountBalanceAndPendingRaw"></a>

### PawnodeApi.getAccountBalanceAndPendingRaw(account) ⇒ <code>Promise.&lt;object&gt;</code>
Get the balance and pending values, in raw, as an object like this one:
{ balance: '123', pending: '123' } for an account.

(use other methods like getPawPartsFromRaw to convert to paw or pawoshi)

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_balances](https://docs.nano.org/commands/rpc-protocol/#accounts_balances)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's balances, in raw.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |

<a name="PawnodeApi.getAccountsBalances"></a>

### PawnodeApi.getAccountsBalances(accounts) ⇒ <code>Promise.&lt;object&gt;</code>
Get the balances and pending values, in raw, as an object for all given account. Returns the Node object without transformation.

(use other methods like getPawPartsFromRaw to convert to paw or pawoshi)

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_balances](https://docs.nano.org/commands/rpc-protocol/#accounts_balances)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's balances, in raw.  

| Param | Type | Description |
| --- | --- | --- |
| accounts | <code>string\_array</code> | the account to use. |

<a name="PawnodeApi.getAccountHistory"></a>

### PawnodeApi.getAccountHistory(account, count, head, raw) ⇒ <code>Promise.&lt;object&gt;</code>
Get the history for an account.

Calls [https://docs.nano.org/commands/rpc-protocol/#account_history](https://docs.nano.org/commands/rpc-protocol/#account_history)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's history.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |
| count | <code>string</code> | the count to use (use -1 for all). |
| head | <code>string</code> | the head to start at (optional). |
| raw | <code>string</code> | if true, return raw history (optional). |

<a name="PawnodeApi.getAccountInfo"></a>

### PawnodeApi.getAccountInfo(account, representativeFlag) ⇒ <code>Promise.&lt;object&gt;</code>
Get the account info for an account.

Calls [https://docs.nano.org/commands/rpc-protocol/#account_info](https://docs.nano.org/commands/rpc-protocol/#account_info)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's info.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |
| representativeFlag | <code>boolean</code> | the representativeFlag to use (optional). |

<a name="PawnodeApi.getBlockCount"></a>

### PawnodeApi.getBlockCount() ⇒ <code>Promise.&lt;object&gt;</code>
Get the network block count.

Calls [https://docs.nano.org/commands/rpc-protocol/#block_count](https://docs.nano.org/commands/rpc-protocol/#block_count)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the block count.  
<a name="PawnodeApi.getAccountsPending"></a>

### PawnodeApi.getAccountsPending(accounts, count, source) ⇒ <code>Promise.&lt;object&gt;</code>
Get the network block count.

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_pending](https://docs.nano.org/commands/rpc-protocol/#accounts_pending)

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's pending blocks.  

| Param | Type | Description |
| --- | --- | --- |
| accounts | <code>string\_array</code> | the array of pending accounts. |
| count | <code>number</code> | the max count to get. |
| source | <code>string</code> | if true, get source. |

<a name="PawnodeApi.setAuth"></a>

### PawnodeApi.setAuth(authString) ⇒ <code>undefined</code>
Sets an authorization string (http 'Authorization' header), useful if node requires api key.

**Kind**: static method of [<code>PawnodeApi</code>](#PawnodeApi)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| authString | <code>string</code> | api key as a string\ |

<a name="PawParts"></a>

## PawParts : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| paw | <code>string</code> | The amount of paw. |
| pawoshi | <code>string</code> | The amount of pawoshi (not counting whole paw). |
| raw | <code>string</code> | The amount of raw (not counting whole paw and whole pawoshi). |

<a name="AccountValidationInfo"></a>

## AccountValidationInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message describing why the account is valid or not. |
| valid | <code>boolean</code> | True if account is valid. |

