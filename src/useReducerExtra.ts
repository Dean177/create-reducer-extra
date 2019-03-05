import { Dispatch, Reducer, useReducer } from 'react'
import {
  ActionFromActionCreator,
  createMergeReducer,
  createReducer,
  Handler,
  PartialHandler,
} from './createReducerExtra'
import { Immutable } from './immutable'

export const useReducerExtra = <State, ActionCreators>(
  initialState: State,
  handler: Handler<State, ActionCreators>,
): [Immutable<State>, Dispatch<ActionFromActionCreator<ActionCreators>>] =>
  useReducer<Reducer<State, ActionFromActionCreator<ActionCreators>>>(
    createReducer(initialState, handler),
    initialState,
  ) as [Immutable<State>, Dispatch<ActionFromActionCreator<ActionCreators>>]

export const useMergeReducer = <State, ActionCreators>(
  initialState: State,
  handler: PartialHandler<State, ActionCreators>,
): [Immutable<State>, Dispatch<ActionFromActionCreator<ActionCreators>>] =>
  useReducer<Reducer<State, ActionFromActionCreator<ActionCreators>>>(
    createMergeReducer(initialState, handler),
    initialState,
  ) as [Immutable<State>, Dispatch<ActionFromActionCreator<ActionCreators>>]
