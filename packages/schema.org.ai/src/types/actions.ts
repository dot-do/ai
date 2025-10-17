/**
 * Schema.org Action types
 * Exported without "Action" suffix for convenience
 */

import type { Thing } from './base.js'

/**
 * Base Action type
 */
export interface Action extends Thing {
  $type: 'Action' | string
  agent?: string | Thing
  endTime?: string
  error?: Thing
  instrument?: Thing
  location?: string | Thing
  object?: Thing
  participant?: string | Thing
  result?: Thing
  startTime?: string
  target?: string | Thing
}

export interface Achieve extends Action {
  $type: 'AchieveAction'
}

export interface Assess extends Action {
  $type: 'AssessAction'
}

export interface Consume extends Action {
  $type: 'ConsumeAction'
}

export interface Create extends Action {
  $type: 'CreateAction'
}

export interface Find extends Action {
  $type: 'FindAction'
}

export interface Interact extends Action {
  $type: 'InteractAction'
}

export interface Move extends Action {
  $type: 'MoveAction'
}

export interface Organize extends Action {
  $type: 'OrganizeAction'
}

export interface Play extends Action {
  $type: 'PlayAction'
}

export interface Search extends Action {
  $type: 'SearchAction'
}

export interface Trade extends Action {
  $type: 'TradeAction'
}

export interface Transfer extends Action {
  $type: 'TransferAction'
}

export interface Update extends Action {
  $type: 'UpdateAction'
}

export interface Communicate extends Omit<Interact, '$type'> {
  $type: 'CommunicateAction'
  about?: Thing
  inLanguage?: string
  recipient?: string | Thing
}

export interface Ask extends Omit<Communicate, '$type'> {
  $type: 'AskAction'
  question?: string
}

export interface Reply extends Omit<Communicate, '$type'> {
  $type: 'ReplyAction'
}

export interface Share extends Omit<Communicate, '$type'> {
  $type: 'ShareAction'
}

export interface Buy extends Omit<Trade, '$type'> {
  $type: 'BuyAction'
  seller?: string | Thing
  price?: number | string
}

export interface Sell extends Omit<Trade, '$type'> {
  $type: 'SellAction'
  buyer?: string | Thing
  price?: number | string
}

export interface Order extends Omit<Trade, '$type'> {
  $type: 'OrderAction'
  deliveryMethod?: string
}

export interface Quote extends Omit<Trade, '$type'> {
  $type: 'QuoteAction'
}

export interface Give extends Omit<Transfer, '$type'> {
  $type: 'GiveAction'
  recipient?: string | Thing
}

export interface Send extends Omit<Transfer, '$type'> {
  $type: 'SendAction'
  recipient?: string | Thing
}

export interface Receive extends Omit<Transfer, '$type'> {
  $type: 'ReceiveAction'
  sender?: string | Thing
}

export interface Take extends Omit<Transfer, '$type'> {
  $type: 'TakeAction'
}

export interface Add extends Omit<Update, '$type'> {
  $type: 'AddAction'
}

export interface Delete extends Omit<Update, '$type'> {
  $type: 'DeleteAction'
}

export interface Replace extends Omit<Update, '$type'> {
  $type: 'ReplaceAction'
  replacee?: Thing
  replacer?: Thing
}

// Export all action types
export type ActionType =
  | Action
  | Achieve
  | Assess
  | Consume
  | Create
  | Find
  | Interact
  | Move
  | Organize
  | Play
  | Search
  | Trade
  | Transfer
  | Update
  | Communicate
  | Ask
  | Reply
  | Share
  | Buy
  | Sell
  | Order
  | Quote
  | Give
  | Send
  | Receive
  | Take
  | Add
  | Delete
  | Replace

/**
 * Action type names (without "Action" suffix)
 */
export type ActionName =
  | 'Achieve'
  | 'Assess'
  | 'Consume'
  | 'Create'
  | 'Find'
  | 'Interact'
  | 'Move'
  | 'Organize'
  | 'Play'
  | 'Search'
  | 'Trade'
  | 'Transfer'
  | 'Update'
  | 'Communicate'
  | 'Ask'
  | 'Reply'
  | 'Share'
  | 'Buy'
  | 'Sell'
  | 'Order'
  | 'Quote'
  | 'Give'
  | 'Send'
  | 'Receive'
  | 'Take'
  | 'Add'
  | 'Delete'
  | 'Replace'

/**
 * Array of all action names
 */
export const actionNames: ActionName[] = [
  'Achieve',
  'Assess',
  'Consume',
  'Create',
  'Find',
  'Interact',
  'Move',
  'Organize',
  'Play',
  'Search',
  'Trade',
  'Transfer',
  'Update',
  'Communicate',
  'Ask',
  'Reply',
  'Share',
  'Buy',
  'Sell',
  'Order',
  'Quote',
  'Give',
  'Send',
  'Receive',
  'Take',
  'Add',
  'Delete',
  'Replace',
]
