import { JsonRpcResponse } from "./rpc.types.mjs";

export interface ChangellyResponse<T> extends JsonRpcResponse {
  result: T;
}

export interface Currency {
  name: string;
  ticker: string;
  fullName: string;
  enabled: boolean;
  enabledFrom: boolean;
  enabledTo: boolean;
  fixRateEnabled: boolean;
  payinConfirmations: number;
  addressUrl: string;
  transactionUrl: string;
  image: string;
  fixedTime: number;
  protocol: string;
  blockchain: string;
}

export interface CurrencyPairInfo {
  from: string;
  to: string;
  minAmountFloat: string;
  maxAmountFloat: string;
  minAmountFixed: string;
  maxAmountFixed: string;
}

export interface CurrencyPair {
  from: string;
  to: string;
}

export interface CurrencyPairWithAmount extends CurrencyPair {
  amountFrom: string | number;
}

export interface ExchangeTransaction {
  id: string;
  trackUrl: string;
  type: string;
  payinExtraId: string | null;
  payoutExtraId: string;
  amountExpectedFrom: string;
  status: string;
  currencyFrom: string;
  currencyTo: string;
  amountExpectedTo: string;
  payinAddress: string;
  payoutAddress: string;
  createdAt: number;
}

export interface FixedExchangeTransaction extends ExchangeTransaction {
  type: "fixed";
  payTill: string;
  refundAddress: string;
}

export interface ExchangeInfo {
  id: string;
  result: string | number;
  networkFee: string | number;
  from: string;
  to: string;
  max: string | number;
  maxFrom: string | number;
  maxTo: string | number;
  min: string | number;
  minFrom: string | number;
  minTo: string | number;
  expiredAt: number;
}

export interface ExchangeInfoWithAmount extends ExchangeInfo {
  amountFrom: string | number;
  amountTo: string | number;
}

export interface ExchangeDetails {
  from: string;
  to: string;
  networkFee: string;
  amountFrom: string;
  amountTo: string;
  max: string;
  maxFrom: string;
  maxTo: string;
  min: string;
  minFrom: string;
  minTo: string;
  visibleAmount: string;
  rate: string;
  fee: string;
}

export interface CreateTransactionDetails {
  from: string;
  to: string;
  address: string;
  extraId: string;
  amountFrom: string;
}

export interface CreateTransactionWithRefundDetails
  extends CreateTransactionDetails {
  refundAddress: string;
  refundExtraId: string;
}

export interface CreateFixTransactionDetails {
  from: string;
  to: string;
  address: string;
  extraId?: string;
  amountFrom: string;
  rateId: string;
  refundAddress: string;
}

export interface FinishedTransaction {
  id: string;
  trackUrl: string;
  createdAt: number;
  type: string | "fixed" | "float";
  moneyReceived: number;
  moneySent: number;
  rate: string;
  payinConfirmations: string;
  status: string;
  currencyFrom: string;
  currencyTo: string;
  payinAddress: string;
  payinExtraId: string | null;
  payinExtraIdName: string | null;
  payinHash: string;
  payoutHashLink: string;
  refundHashLink: string | null;
  amountExpectedFrom: string;
  payoutAddress: string;
  payoutExtraId: string | null;
  payoutExtraIdName: string | null;
  payoutHash: string;
  refundHash: string | null;
  refundAddress: string;
  refundExtraId: string | null;
  amountFrom: string;
  amountTo: string;
  amountExpectedTo: string;
  networkFee: string;
  changellyFee: string;
  apiExtraFee: string;
  totalFee: string;
  canPush: boolean;
  canRefund: boolean;
}

export interface SearchTransactionsBase {
  currency: string;
  address: string;
  extraId: string;
  limit: number;
  offset: number;
}

export interface SearchTransactionsById {
  id: string;
  limit: number;
}

export interface SearchTransactionsExtended {
  id?: string[];
  currency?: string[];
  status?: string[];
}

export type SearchTransactions =
  | SearchTransactionsBase
  | SearchTransactionsById
  | SearchTransactionsExtended;

export interface ValidationResult {
  result: boolean;
  message: string;
}

export type TransactionStatus =
  | "new"
  | "waiting"
  | "confirming"
  | "exchanging"
  | "sending"
  | "finished"
  | "failed"
  | "refunded"
  | "hold"
  | "overdue"
  | "expired";
