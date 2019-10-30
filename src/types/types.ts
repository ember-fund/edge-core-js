import { Disklet } from 'disklet'
import { Subscriber } from 'yaob'

export {
  DustSpendError,
  errorNames,
  InsufficientFundsError,
  SpendToSelfError,
  NetworkError,
  NoAmountSpecifiedError,
  ObsoleteApiError,
  OtpError,
  PasswordError,
  PendingFundsError,
  SameCurrencyError,
  SwapAboveLimitError,
  SwapBelowLimitError,
  SwapCurrencyError,
  SwapPermissionError,
  UsernameError
} from './error'

// ---------------------------------------------------------------------
// io types
// ---------------------------------------------------------------------

// Node.js randomBytes function:
export type EdgeRandomFunction = (bytes: number) => Uint8Array

// The only subset of `Console` that Edge core uses:
export interface EdgeConsole {
  error(...data: any[]): void
  info(...data: any[]): void
  warn(...data: any[]): void
}

// The scrypt function Edge expects:
export type EdgeScryptFunction = (
  data: Uint8Array,
  salt: Uint8Array,
  n: number,
  r: number,
  p: number,
  dklen: number
) => Promise<Uint8Array>

/**
 * Access to platform-specific resources.
 * The core never talks to the outside world on its own,
 * but always goes through this object.
 */
export interface EdgeIo {
  // Crypto:
  readonly random: EdgeRandomFunction
  readonly scrypt: EdgeScryptFunction

  // Local io:
  readonly console: EdgeConsole
  readonly disklet: Disklet

  // Networking:
  readonly fetch: typeof fetch
  readonly WebSocket: typeof WebSocket
}

/**
 * On React Native, each plugin can provide a bridge to whatever native
 * io it needs.
 */
export interface EdgeNativeIo {
  [packageName: string]: object
}

export interface EdgeCorePluginOptions {
  initOptions: object // Load-time options (like API keys)
  io: EdgeIo
  nativeIo: EdgeNativeIo // Only filled in on React Native
  pluginDisklet: Disklet // Plugin local storage
}

export interface EdgePluginMap<Value> {
  [pluginName: string]: Value
}

// ---------------------------------------------------------------------
// key types
// ---------------------------------------------------------------------

export interface EdgeWalletInfo {
  id: string
  type: string
  keys: any
}

export interface EdgeWalletInfoFull {
  appIds: string[]
  archived: boolean
  deleted: boolean
  id: string
  keys: any
  sortIndex: number
  type: string
}

export interface EdgeWalletState {
  archived?: boolean
  deleted?: boolean
  sortIndex?: number
}

export interface EdgeWalletStates {
  [walletId: string]: EdgeWalletState
}

// ---------------------------------------------------------------------
// currency types
// ---------------------------------------------------------------------

// currency info -------------------------------------------------------

export interface EdgeDenomination {
  name: string
  multiplier: string
  symbol?: string
}

export interface EdgeMetaToken {
  currencyCode: string
  currencyName: string
  denominations: EdgeDenomination[]
  contractAddress?: string
  symbolImage?: string
}

type EdgeObjectTemplate = Array<
  | {
      type: 'nativeAmount'
      key: string
      displayName: string
      displayMultiplier: string
    }
  | {
      type: 'number'
      key: string
      displayName: string
    }
  | {
      type: 'string'
      key: string
      displayName: string
    }
>

export interface EdgeCurrencyInfo {
  // Basic currency information:
  displayName: string
  pluginName: string
  walletType: string

  // Native token information:
  currencyCode: string
  denominations: EdgeDenomination[]

  // Chain information:
  canAdjustFees?: boolean // Defaults to true
  canImportKeys?: boolean // Defaults to false
  customFeeTemplate?: EdgeObjectTemplate // Indicates custom fee support
  customTokenTemplate?: EdgeObjectTemplate // Indicates custom token support
  requiredConfirmations?: number

  // Configuration options:
  defaultSettings: any
  metaTokens: EdgeMetaToken[]

  // Explorers:
  addressExplorer: string
  blockExplorer?: string
  transactionExplorer: string

  // Images:
  symbolImage?: string
  symbolImageDarkMono?: string
}

// spending ------------------------------------------------------------

export interface EdgeMetadata {
  name?: string
  category?: string
  notes?: string
  amountFiat?: number
  bizId?: number
  miscJson?: string
}

export interface EdgeNetworkFee {
  readonly currencyCode: string
  readonly nativeAmount: string
}

export interface EdgeTransaction {
  // Amounts:
  currencyCode: string
  nativeAmount: string

  // Fees:
  networkFee: string
  parentNetworkFee?: string

  // Confirmation status:
  blockHeight: number
  date: number

  // Transaction info:
  txid: string
  signedTx: string
  ourReceiveAddresses: string[]

  // Core:
  metadata?: EdgeMetadata
  wallet?: EdgeCurrencyWallet // eslint-disable-line no-use-before-define
  otherParams?: object
}

export interface EdgeSpendTarget {
  nativeAmount?: string
  publicAddress?: string
  otherParams?: object
}

export interface EdgePaymentProtocolInfo {
  domain: string
  memo: string
  merchant: string
  nativeAmount: string
  spendTargets: EdgeSpendTarget[]
}

export interface EdgeSpendInfo {
  // Basic information:
  currencyCode?: string
  privateKeys?: string[]
  spendTargets: EdgeSpendTarget[]

  // Options:
  noUnconfirmed?: boolean
  networkFeeOption?: string // 'high' | 'standard' | 'low' | 'custom',
  customNetworkFee?: object // Some kind of currency-specific JSON

  // Core:
  metadata?: EdgeMetadata
  otherParams?: object
}

// query data ----------------------------------------------------------

export interface EdgeDataDump {
  walletId: string
  walletType: string
  data: {
    [dataCache: string]: any
  }
}

export interface EdgeFreshAddress {
  publicAddress: string
  segwitAddress?: string
  legacyAddress?: string
}

export interface EdgeTokenInfo {
  currencyCode: string
  currencyName: string
  contractAddress: string
  multiplier: string
}

export interface EdgeTxidMap {
  [txid: string]: number
}

// URI -----------------------------------------------------------------

export interface EdgeParsedUri {
  token?: EdgeMetaToken
  privateKeys?: string[]
  publicAddress?: string
  legacyAddress?: string
  segwitAddress?: string
  nativeAmount?: string
  currencyCode?: string
  metadata?: EdgeMetadata
  bitIDURI?: string
  bitIDDomain?: string
  bitIDCallbackUri?: string
  paymentProtocolUrl?: string
  returnUri?: string
  uniqueIdentifier?: string // Ripple payment id
  bitidPaymentAddress?: string // Experimental
  bitidKycProvider?: string // Experimental
  bitidKycRequest?: string // Experimental
}

export interface EdgeEncodeUri {
  publicAddress: string
  segwitAddress?: string
  legacyAddress?: string
  nativeAmount?: string
  label?: string
  message?: string
  currencyCode?: string
}

// options -------------------------------------------------------------

export interface EdgeCurrencyCodeOptions {
  currencyCode?: string
}

export interface EdgeGetTransactionsOptions {
  currencyCode?: string
  startIndex?: number
  startEntries?: number
  startDate?: number
  endDate?: number
  searchString?: string
  returnIndex?: number
  returnEntries?: number
  denomination?: string
}

// engine --------------------------------------------------------------

export interface EdgeCurrencyEngineCallbacks {
  readonly onBlockHeightChanged: (blockHeight: number) => void
  readonly onTransactionsChanged: (transactions: EdgeTransaction[]) => void
  readonly onBalanceChanged: (
    currencyCode: string,
    nativeBalance: string
  ) => void
  readonly onAddressesChecked: (progressRatio: number) => void
  readonly onTxidsChanged: (txids: EdgeTxidMap) => void
}

export interface EdgeCurrencyEngineOptions {
  callbacks: EdgeCurrencyEngineCallbacks
  walletLocalDisklet: Disklet
  walletLocalEncryptedDisklet: Disklet
  userSettings: object | void
}

export interface EdgeCurrencyEngine {
  changeUserSettings(settings: object): Promise<unknown>

  // Keys:
  getDisplayPrivateSeed(): string | null
  getDisplayPublicSeed(): string | null

  // Engine status:
  startEngine(): Promise<unknown>
  killEngine(): Promise<unknown>
  resyncBlockchain(): Promise<unknown>
  dumpData(): EdgeDataDump

  // Chain state:
  getBlockHeight(): number
  getBalance(opts: EdgeCurrencyCodeOptions): string
  getNumTransactions(opts: EdgeCurrencyCodeOptions): number
  getTransactions(opts: EdgeGetTransactionsOptions): Promise<EdgeTransaction[]>
  getTxids?: () => EdgeTxidMap

  // Tokens:
  enableTokens(tokens: string[]): Promise<unknown>
  disableTokens(tokens: string[]): Promise<unknown>
  getEnabledTokens(): Promise<string[]>
  addCustomToken(token: EdgeTokenInfo): Promise<unknown>
  getTokenStatus(token: string): boolean

  // Addresses:
  getFreshAddress(opts: EdgeCurrencyCodeOptions): EdgeFreshAddress
  addGapLimitAddresses(addresses: string[]): void
  isAddressUsed(address: string): boolean

  // Spending:
  makeSpend(spendInfo: EdgeSpendInfo): Promise<EdgeTransaction>
  signTx(transaction: EdgeTransaction): Promise<EdgeTransaction>
  broadcastTx(transaction: EdgeTransaction): Promise<EdgeTransaction>
  saveTx(transaction: EdgeTransaction): Promise<unknown>
  readonly sweepPrivateKeys?: (
    spendInfo: EdgeSpendInfo
  ) => Promise<EdgeTransaction>
  readonly getPaymentProtocolInfo?: (
    paymentProtocolUrl: string
  ) => Promise<EdgePaymentProtocolInfo>

  // Escape hatch:
  readonly otherMethods?: object
}

// currency plugin -----------------------------------------------------

export interface EdgeBitcoinPrivateKeyOptions {
  format?: string
  coinType?: number
  account?: number
}

// Add other currencies to this list as they gather options:
export type EdgeCreatePrivateKeyOptions = {} | EdgeBitcoinPrivateKeyOptions

export interface EdgeCurrencyTools {
  // Keys:
  readonly importPrivateKey?: (
    key: string,
    opts?: EdgeCreatePrivateKeyOptions
  ) => Promise<object>
  createPrivateKey(
    walletType: string,
    opts?: EdgeCreatePrivateKeyOptions
  ): Promise<object>
  derivePublicKey(walletInfo: EdgeWalletInfo): Promise<object>
  readonly getSplittableTypes?: (walletInfo: EdgeWalletInfo) => string[]

  // URIs:
  parseUri(
    uri: string,
    currencyCode?: string,
    customTokens?: EdgeMetaToken[]
  ): Promise<EdgeParsedUri>
  encodeUri(obj: EdgeEncodeUri, customTokens?: EdgeMetaToken[]): Promise<string>
}

export interface EdgeCurrencyPlugin {
  readonly currencyInfo: EdgeCurrencyInfo

  makeCurrencyTools(): Promise<EdgeCurrencyTools>
  makeCurrencyEngine(
    walletInfo: EdgeWalletInfo,
    opts: EdgeCurrencyEngineOptions
  ): Promise<EdgeCurrencyEngine>

  // Escape hatch:
  readonly otherMethods?: object
}

// wallet --------------------------------------------------------------

export interface EdgeBalances {
  [currencyCode: string]: string
}

export type EdgeReceiveAddress = EdgeFreshAddress & {
  metadata: EdgeMetadata
  nativeAmount: string
}

export interface EdgeCurrencyWalletEvents {
  close: void
  newTransactions: EdgeTransaction[]
  transactionsChanged: EdgeTransaction[]
}

export interface EdgeCurrencyWallet {
  readonly on: Subscriber<EdgeCurrencyWalletEvents>
  readonly watch: Subscriber<EdgeCurrencyWallet>

  // Data store:
  readonly id: string
  readonly keys: any
  readonly type: string
  readonly publicWalletInfo: EdgeWalletInfo
  readonly disklet: Disklet
  readonly localDisklet: Disklet
  sync(): Promise<unknown>

  // Wallet keys:
  readonly displayPrivateSeed: string | null
  readonly displayPublicSeed: string | null

  // Wallet name:
  readonly name: string | null
  renameWallet(name: string): Promise<unknown>

  // Fiat currency option:
  readonly fiatCurrencyCode: string
  setFiatCurrencyCode(fiatCurrencyCode: string): Promise<unknown>

  // Currency info:
  readonly currencyInfo: EdgeCurrencyInfo
  nativeToDenomination(
    nativeAmount: string,
    currencyCode: string
  ): Promise<string>
  denominationToNative(
    denominatedAmount: string,
    currencyCode: string
  ): Promise<string>

  // Chain state:
  readonly balances: EdgeBalances
  readonly blockHeight: number
  readonly syncRatio: number

  // Running state:
  startEngine(): Promise<unknown>
  stopEngine(): Promise<unknown>

  // Token management:
  enableTokens(tokens: string[]): Promise<unknown>
  disableTokens(tokens: string[]): Promise<unknown>
  getEnabledTokens(): Promise<string[]>
  addCustomToken(token: EdgeTokenInfo): Promise<unknown>

  // Transaction history:
  getNumTransactions(opts?: EdgeCurrencyCodeOptions): Promise<number>
  getTransactions(opts?: EdgeGetTransactionsOptions): Promise<EdgeTransaction[]>

  // Addresses:
  getReceiveAddress(opts?: EdgeCurrencyCodeOptions): Promise<EdgeReceiveAddress>
  saveReceiveAddress(receiveAddress: EdgeReceiveAddress): Promise<unknown>
  lockReceiveAddress(receiveAddress: EdgeReceiveAddress): Promise<unknown>

  // Sending:
  makeSpend(spendInfo: EdgeSpendInfo): Promise<EdgeTransaction>
  signTx(tx: EdgeTransaction): Promise<EdgeTransaction>
  broadcastTx(tx: EdgeTransaction): Promise<EdgeTransaction>
  saveTx(tx: EdgeTransaction): Promise<unknown>
  sweepPrivateKeys(edgeSpendInfo: EdgeSpendInfo): Promise<EdgeTransaction>
  saveTxMetadata(
    txid: string,
    currencyCode: string,
    metadata: EdgeMetadata
  ): Promise<unknown>
  getMaxSpendable(spendInfo: EdgeSpendInfo): Promise<string>
  getPaymentProtocolInfo(
    paymentProtocolUrl: string
  ): Promise<EdgePaymentProtocolInfo>

  // Wallet management:
  resyncBlockchain(): Promise<unknown>
  dumpData(): Promise<EdgeDataDump>
  getDisplayPrivateSeed(): string | null
  getDisplayPublicSeed(): string | null

  // Data exports:
  exportTransactionsToQBO(opts: EdgeGetTransactionsOptions): Promise<string>
  exportTransactionsToCSV(opts: EdgeGetTransactionsOptions): Promise<string>

  // URI handling:
  parseUri(uri: string, currencyCode?: string): Promise<EdgeParsedUri>
  encodeUri(obj: EdgeEncodeUri): Promise<string>

  readonly otherMethods: object

  // Deprecated API's:
  getBalance(opts?: EdgeCurrencyCodeOptions): string
  getBlockHeight(): number
}

// ---------------------------------------------------------------------
// swap plugin
// ---------------------------------------------------------------------

export interface EdgeSwapInfo {
  readonly displayName: string
  readonly pluginName: string

  readonly quoteUri?: string // The quoteId would be appended to this
  readonly supportEmail: string
}

export interface EdgeSwapRequest {
  // Where?
  fromWallet: EdgeCurrencyWallet
  toWallet: EdgeCurrencyWallet

  // What?
  fromCurrencyCode: string
  toCurrencyCode: string

  // How much?
  nativeAmount: string
  quoteFor: 'from' | 'to'
}

export interface EdgeSwapPluginQuote {
  // isEstimate defaults to true.
  // Edge prefers true quotes (not estimates) where possible.
  readonly isEstimate?: boolean
  readonly fromNativeAmount: string
  readonly toNativeAmount: string
  readonly networkFee: EdgeNetworkFee
  readonly destinationAddress: string

  readonly pluginName: string
  readonly expirationDate?: Date
  readonly quoteId?: string

  approve(): Promise<EdgeTransaction>
  close(): Promise<unknown>
}

export interface EdgeSwapPluginStatus {
  needsActivation?: boolean
}

export interface EdgeSwapPlugin {
  readonly swapInfo: EdgeSwapInfo

  checkSettings?: (userSettings: object) => EdgeSwapPluginStatus
  fetchSwapQuote(
    request: EdgeSwapRequest,
    userSettings: object | void
  ): Promise<EdgeSwapPluginQuote>
}

// ---------------------------------------------------------------------
// rate plugin
// ---------------------------------------------------------------------

export interface EdgeRateHint {
  fromCurrency: string
  toCurrency: string
}

export interface EdgeRateInfo {
  readonly displayName: string
}

export interface EdgeRatePair {
  fromCurrency: string
  toCurrency: string
  rate: number
}

export interface EdgeRatePlugin {
  readonly rateInfo: EdgeRateInfo

  fetchRates(hints: EdgeRateHint[]): Promise<EdgeRatePair[]>
}

// ---------------------------------------------------------------------
// account
// ---------------------------------------------------------------------

export interface EdgeAccountOptions {
  otp?: string
}

// currencies ----------------------------------------------------------

export interface EdgeCreateCurrencyWalletOptions {
  fiatCurrencyCode?: string
  name?: string

  // Create a private key from some text:
  importText?: string

  // Used to tell the currency plugin what keys to create:
  keyOptions?: EdgeCreatePrivateKeyOptions

  // Used to copy wallet keys between accounts:
  keys?: {}
}

export interface EdgeCurrencyConfig {
  readonly watch: Subscriber<EdgeCurrencyConfig>

  readonly currencyInfo: EdgeCurrencyInfo
  readonly otherMethods: object
  readonly userSettings: object | void

  changeUserSettings(settings: object): Promise<unknown>
  importKey(userInput: string): Promise<object>
}

export interface EthereumTransaction {
  chainId: number // Not part of raw data, but needed for signing
  nonce: string
  gasPrice: string
  gasLimit: string
  to: string
  value: string
  data: string
  // The transaction is unsigned, so these are not present:
  v?: string
  r?: string
  s?: string
}

// rates ---------------------------------------------------------------

export interface EdgeRateCacheEvents {
  close: void
  update: unknown
}

export interface EdgeRateCache {
  readonly on: Subscriber<EdgeRateCacheEvents>

  convertCurrency(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<number>
}

// swap ----------------------------------------------------------------

/**
 * Information and settings for a currency swap plugin.
 */
export interface EdgeSwapConfig {
  readonly watch: Subscriber<EdgeSwapConfig>

  readonly enabled: boolean
  readonly needsActivation: boolean
  readonly swapInfo: EdgeSwapInfo
  readonly userSettings: object | void

  changeEnabled(enabled: boolean): Promise<unknown>
  changeUserSettings(settings: object): Promise<unknown>
}

export type EdgeSwapQuote = EdgeSwapPluginQuote & {
  readonly isEstimate: boolean // No longer optional at this point
  readonly quoteUri?: string
}

// edge login ----------------------------------------------------------

export interface EdgeLoginRequest {
  readonly appId: string
  approve(): Promise<unknown>

  readonly displayName: string
  readonly displayImageUrl: string | void
}

export interface EdgeLobby {
  readonly loginRequest: EdgeLoginRequest | void
  // walletRequest: EdgeWalletRequest | void
}

// storage -------------------------------------------------------------

export interface EdgeDataStore {
  deleteItem(storeId: string, itemId: string): Promise<unknown>
  deleteStore(storeId: string): Promise<unknown>

  listItemIds(storeId: string): Promise<string[]>
  listStoreIds(): Promise<string[]>

  getItem(storeId: string, itemId: string): Promise<string>
  setItem(storeId: string, itemId: string, value: string): Promise<unknown>
}

// Deprecated:
export interface EdgePluginData {
  deleteItem(pluginId: string, itemId: string): Promise<unknown>
  deletePlugin(pluginId: string): Promise<unknown>

  listItemIds(pluginId: string): Promise<string[]>
  listPluginIds(): Promise<string[]>

  getItem(pluginId: string, itemId: string): Promise<string>
  setItem(pluginId: string, itemId: string, value: string): Promise<unknown>
}

// account -------------------------------------------------------------

export interface EdgeAccountEvents {
  close: void
}

export interface EdgeAccount {
  readonly on: Subscriber<EdgeAccountEvents>
  readonly watch: Subscriber<EdgeAccount>

  // Data store:
  readonly id: string
  readonly keys: any
  readonly type: string
  readonly disklet: Disklet
  readonly localDisklet: Disklet
  sync(): Promise<unknown>

  // Basic login information:
  readonly appId: string
  readonly loggedIn: boolean
  readonly loginKey: string
  readonly recoveryKey: string | void // For email backup
  readonly username: string

  // Special-purpose API's:
  readonly currencyConfig: EdgePluginMap<EdgeCurrencyConfig>
  readonly rateCache: EdgeRateCache
  readonly swapConfig: EdgePluginMap<EdgeSwapConfig>
  readonly dataStore: EdgeDataStore

  // What login method was used?
  readonly edgeLogin: boolean
  readonly keyLogin: boolean
  readonly newAccount: boolean
  readonly passwordLogin: boolean
  readonly pinLogin: boolean
  readonly recoveryLogin: boolean

  // Change or create credentials:
  changePassword(password: string): Promise<unknown>
  changePin(opts: {
    pin?: string // We keep the existing PIN if unspecified
    enableLogin?: boolean // We default to true if unspecified
  }): Promise<string>
  changeRecovery(questions: string[], answers: string[]): Promise<string>

  // Verify existing credentials:
  checkPassword(password: string): Promise<boolean>
  checkPin(pin: string): Promise<boolean>

  // Remove credentials:
  deletePassword(): Promise<unknown>
  deletePin(): Promise<unknown>
  deleteRecovery(): Promise<unknown>

  // OTP:
  readonly otpKey: string | void // OTP is enabled if this exists
  readonly otpResetDate: string | void // A reset is requested if this exists
  cancelOtpReset(): Promise<unknown>
  disableOtp(): Promise<unknown>
  enableOtp(timeout?: number): Promise<unknown>

  // Edge login approval:
  fetchLobby(lobbyId: string): Promise<EdgeLobby>

  // Login management:
  logout(): Promise<unknown>

  // Master wallet list:
  readonly allKeys: EdgeWalletInfoFull[]
  changeWalletStates(walletStates: EdgeWalletStates): Promise<unknown>
  createWallet(type: string, keys: any): Promise<string>
  getFirstWalletInfo(type: string): EdgeWalletInfo | void
  getWalletInfo(id: string): EdgeWalletInfo | void
  listWalletIds(): string[]
  listSplittableWalletTypes(walletId: string): Promise<string[]>
  splitWalletInfo(walletId: string, newWalletType: string): Promise<string>

  // Currency wallets:
  readonly activeWalletIds: string[]
  readonly archivedWalletIds: string[]
  readonly currencyWallets: { [walletId: string]: EdgeCurrencyWallet }
  createCurrencyWallet(
    type: string,
    opts?: EdgeCreateCurrencyWalletOptions
  ): Promise<EdgeCurrencyWallet>
  waitForCurrencyWallet(walletId: string): Promise<EdgeCurrencyWallet>

  // Web compatibility:
  signEthereumTransaction(
    walletId: string,
    transaction: EthereumTransaction
  ): Promise<string>

  // Swapping:
  fetchSwapQuote(request: EdgeSwapRequest): Promise<EdgeSwapQuote>

  // Deprecated names:
  readonly pluginData: EdgePluginData
  readonly exchangeCache: EdgeRateCache
  readonly currencyTools: EdgePluginMap<EdgeCurrencyConfig>
  readonly exchangeTools: EdgePluginMap<EdgeSwapConfig>
  getExchangeQuote(request: EdgeSwapRequest): Promise<EdgeSwapQuote>
}

// ---------------------------------------------------------------------
// context types
// ---------------------------------------------------------------------

export type EdgeCorePlugin =
  | EdgeCurrencyPlugin
  | EdgeRatePlugin
  | EdgeSwapPlugin

export type EdgeCorePlugins = EdgePluginMap<
  EdgeCorePlugin | ((env: EdgeCorePluginOptions) => EdgeCorePlugin)
>

export type EdgeCorePluginsInit = EdgePluginMap<boolean | object>

export interface EdgeContextOptions {
  apiKey: string
  appId: string
  authServer?: string
  hideKeys?: boolean
  path?: string // Only used on node.js
  plugins?: EdgeCorePluginsInit
}

// parameters ----------------------------------------------------------

export type EdgeEdgeLoginOptions = EdgeAccountOptions & {
  // Deprecated. The info server handles these now:
  displayImageUrl?: string
  displayName?: string
}

export interface EdgeLoginMessages {
  [username: string]: {
    otpResetPending: boolean
    recovery2Corrupt: boolean
  }
}

export interface EdgePasswordRules {
  secondsToCrack: number
  tooShort: boolean
  noNumber: boolean
  noLowerCase: boolean
  noUpperCase: boolean
  passed: boolean
}

export interface EdgePendingEdgeLogin {
  readonly id: string
  cancelRequest(): void
}

export interface EdgeUserInfo {
  pinLoginEnabled: boolean
  username: string
}

// context -------------------------------------------------------------

export interface EdgeContextEvents {
  close: void
  error: Error
  login: EdgeAccount
  loginStart: { username: string }
  loginError: { error: Error }
}

export interface EdgeContext {
  readonly on: Subscriber<EdgeContextEvents>
  readonly watch: Subscriber<EdgeContext>
  close(): Promise<unknown>

  readonly appId: string

  // Local user management:
  localUsers: EdgeUserInfo[]
  fixUsername(username: string): string
  listUsernames(): Promise<string[]>
  deleteLocalAccount(username: string): Promise<unknown>

  // Account creation:
  usernameAvailable(username: string): Promise<boolean>
  createAccount(
    username: string,
    password?: string,
    pin?: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>

  // Edge login:
  requestEdgeLogin(opts: EdgeEdgeLoginOptions): Promise<EdgePendingEdgeLogin>

  // Fingerprint login:
  loginWithKey(
    username: string,
    loginKey: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>

  // Password login:
  checkPasswordRules(password: string): EdgePasswordRules
  loginWithPassword(
    username: string,
    password: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>

  // PIN login:
  pinLoginEnabled(username: string): Promise<boolean>
  loginWithPIN(
    username: string,
    pin: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>

  // Recovery2 login:
  getRecovery2Key(username: string): Promise<string>
  loginWithRecovery2(
    recovery2Key: string,
    username: string,
    answers: string[],
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>
  fetchRecovery2Questions(
    recovery2Key: string,
    username: string
  ): Promise<string[]>
  listRecoveryQuestionChoices(): Promise<string[]>

  // OTP stuff:
  requestOtpReset(username: string, otpResetToken: string): Promise<Date>
  fetchLoginMessages(): Promise<EdgeLoginMessages>

  // Background mode:
  readonly paused: boolean
  changePaused(
    paused: boolean,
    opts?: { secondsDelay?: number }
  ): Promise<unknown>
}

// ---------------------------------------------------------------------
// fake mode
// ---------------------------------------------------------------------

export interface EdgeFakeUser {
  username: string
  loginId: string
  loginKey: string
  repos: object
  server: object
}

export interface EdgeFakeWorld {
  close(): Promise<unknown>

  makeEdgeContext(
    opts: EdgeContextOptions & { cleanDevice?: boolean }
  ): Promise<EdgeContext>

  goOffline(offline?: boolean): Promise<unknown>
  dumpFakeUser(account: EdgeAccount): Promise<EdgeFakeUser>
}
