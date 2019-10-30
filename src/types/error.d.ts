import { EdgeSwapInfo } from './types'

/*
 * These are errors the core knows about.
 *
 * The GUI should handle these errors in an "intelligent" way, such as by
 * displaying a localized error message or asking the user for more info.
 * All these errors have a `type` field, which the GUI can use to select
 * the appropriate response.
 *
 * Other errors are possible, of course, since the Javascript language
 * itself can generate exceptions. Those errors won't have a `type` field,
 * and the GUI should just show them with a stack trace & generic message,
 * since the program has basically crashed at that point.
 */

export declare const errorNames: {
  DustSpendError: 'DustSpendError'
  InsufficientFundsError: 'InsufficientFundsError'
  SpendToSelfError: 'SpendToSelfError'
  NetworkError: 'NetworkError'
  ObsoleteApiError: 'ObsoleteApiError'
  OtpError: 'OtpError'
  PasswordError: 'PasswordError'
  PendingFundsError: 'PendingFundsError'
  SameCurrencyError: 'SameCurrencyError'
  SwapAboveLimitError: 'SwapAboveLimitError'
  SwapBelowLimitError: 'SwapBelowLimitError'
  SwapCurrencyError: 'SwapCurrencyError'
  SwapPermissionError: 'SwapPermissionError'
  UsernameError: 'UsernameError'
  NoAmountSpecifiedError: 'NoAmountSpecifiedError'
}

/**
 * Trying to spend an uneconomically small amount of money.
 */
export declare class DustSpendError extends Error {
  name: 'DustSpendError'
  constructor(message?: string)
}

/**
 * Trying to spend more money than the wallet contains.
 */
export declare class InsufficientFundsError extends Error {
  name: 'InsufficientFundsError'
  currencyCode: string | void
  constructor(currencyCode: string)
}

/**
 * Trying to spend to an address of the source wallet
 */
export declare class SpendToSelfError extends Error {
  name: 'SpendToSelfError'
  constructor(message?: string)
}

/**
 * Attempting to create a MakeSpend without specifying an amount of currency to send
 */

export declare class NoAmountSpecifiedError extends Error {
  name: 'NoAmountSpecifiedError'
  constructor(message?: string)
}

/**
 * Could not reach the server at all.
 */
export declare class NetworkError extends Error {
  name: 'NetworkError'
  constructor(message?: string)
}

/**
 * The endpoint on the server is obsolete, and the app needs to be upgraded.
 */
export declare class ObsoleteApiError extends Error {
  name: 'ObsoleteApiError'
  constructor(message?: string)
}

/**
 * The OTP token was missing / incorrect.
 *
 * The error object should include a `resetToken` member,
 * which can be used to reset OTP protection on the account.
 *
 * The error object may include a `resetDate` member,
 * which indicates that an OTP reset is already pending,
 * and when it will complete.
 */
export declare class OtpError extends Error {
  name: 'OtpError'
  resetToken: string
  resetDate?: Date
  constructor(resultsJson?: object, message?: string)
}

/**
 * The provided authentication is incorrect.
 *
 * Reasons could include:
 * - Password login: wrong password
 * - PIN login: wrong PIN
 * - Recovery login: wrong answers
 *
 * The error object may include a `wait` member,
 * which is the number of seconds the user must wait before trying again.
 */
export declare class PasswordError extends Error {
  name: 'PasswordError'
  wait: number // seconds
  constructor(resultsJson?: object, message?: string)
}

/**
 * Trying to spend funds that are not yet confirmed.
 */
export declare class PendingFundsError extends Error {
  name: 'PendingFundsError'
  constructor(message?: string)
}

/**
 * Attempting to shape shift between two wallets of same currency.
 */
export declare class SameCurrencyError extends Error {
  name: 'SameCurrencyError'
  constructor(message?: string)
}

/**
 * Trying to swap an amount that is either too low or too high.
 * @param nativeMax the maximum supported amount, in the "from" currency.
 */
export declare class SwapAboveLimitError extends Error {
  name: 'SwapAboveLimitError'
  pluginName: string
  nativeMax: string
  constructor(swapInfo: EdgeSwapInfo, nativeMax: string)
}

/**
 * Trying to swap an amount that is either too low or too high.
 * @param nativeMin the minimum supported amount, in the "from" currency.
 */
export declare class SwapBelowLimitError extends Error {
  name: 'SwapBelowLimitError'
  pluginName: string
  nativeMin: string
  constructor(swapInfo: EdgeSwapInfo, nativeMin: string)
}

/**
 * The swap plugin does not support this currency pair.
 */
export declare class SwapCurrencyError extends Error {
  name: 'SwapCurrencyError'
  pluginName: string
  fromCurrency: string
  toCurrency: string
  constructor(swapInfo: EdgeSwapInfo, fromCurrency: string, toCurrency: string)
}

type SwapPermissionReason =
  | 'geoRestriction'
  | 'noVerification'
  | 'needsActivation'

/**
 * The user is not allowed to swap these coins for some reason
 * (no KYC, restricted IP address, etc...).
 * @param reason A string giving the reason for the denial.
 * - 'geoRestriction': The IP address is in a restricted region
 * - 'noVerification': The user needs to provide KYC credentials
 * - 'needsActivation': The user needs to log into the service.
 */
export declare class SwapPermissionError extends Error {
  name: 'SwapPermissionError'
  pluginName: string
  reason: SwapPermissionReason
  constructor(swapInfo: EdgeSwapInfo, reason: SwapPermissionReason)
}

/**
 * Cannot find a login with that id.
 *
 * Reasons could include:
 * - Password login: wrong username
 * - PIN login: wrong PIN key
 * - Recovery login: wrong username, or wrong recovery key
 */
export declare class UsernameError extends Error {
  name: 'UsernameError'
  constructor(message?: string)
}

export type CoreError =
  | DustSpendError
  | InsufficientFundsError
  | SpendToSelfError
  | NetworkError
  | ObsoleteApiError
  | OtpError
  | PasswordError
  | PendingFundsError
  | SameCurrencyError
  | SwapAboveLimitError
  | SwapBelowLimitError
  | SwapCurrencyError
  | SwapPermissionError
  | UsernameError
  | NoAmountSpecifiedError

export type CoreErrorName = CoreError['name']
