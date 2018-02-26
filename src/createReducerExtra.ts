import { AnyAction, Reducer } from 'redux'

export type DeepReadonly<S> = S // TODO

export type Action<T extends string, P> = { type: T, payload: P }

export type IntersectionOf<T> =
  ({ [K in keyof T]: (x: T[K]) => void }) extends Record<keyof T, (x: infer V) => void> ? V : never

export const action = <T extends string, P>(type: T, payload: P): Action<T, P> =>
  ({ type, payload: payload || {} })

export type ActionHandler<S, AC> =
  AC extends (...args: any[]) => Action<infer T, infer P> // tslint:disable-line:no-any
    ? { [k in T]: (s: S, p: P) => S }
    : never

export type Handler<S, ACS> = IntersectionOf<{ [K in keyof ACS]: ActionHandler<S, ACS[K]> }>

export type PartialActionHandler<S, AC> =
  AC extends (...args: any[]) => Action<infer T, infer P> // tslint:disable-line:no-any
    ? { [k in T]: (s: S, p: P) => Partial<S> }
    : never

export type PartialHandler<S, ACS> = IntersectionOf<{ [K in keyof ACS]: PartialActionHandler<S, ACS[K]> }>

export const createReducer = <S, ACs>(initialState: S, handler: Handler<S, ACs>): Reducer<S> =>
  (state: S = initialState, { payload, type }: AnyAction): S => {
    if (handler.hasOwnProperty(type)) {
      return (handler as any)[type](state, payload) // tslint:disable-line:no-any
    }
    return state
  }

// Allows the reducer to only return what has changed, rather than having to list every single key of the state object
export const createMergeReducer = <S, ACs>(initialState: S, handler: PartialHandler<S, ACs>): Reducer<S> =>
  (state: S = initialState, { payload, type }: AnyAction): S => {
    if (handler.hasOwnProperty(type)) {
      const changedState: Partial<S> = (handler as any)[type](state, payload) // tslint:disable-line:no-any
      return {
        ...(state as {}),
        ...(changedState as {}),
      } as S
    }
    return state
  }

// Allows the state to be 'reset' to the initialState once a particular action is received.
// This action can be handled by the actionHandler to override this.
export const ResetState = '__create-reducer-extra-reset-state__'
export const resetState = (): Action<typeof ResetState, {}> => action('__create-reducer-extra-reset-state__', {})
export const createResetReducer = <S, ACs>(initialState: S, handler: Handler<S, ACs>): Reducer<S> =>
  (state: S = initialState, { payload, type }: AnyAction): S => {
    if (handler.hasOwnProperty(type)) {
      return (handler as any)[type](state, payload) // tslint:disable-line:no-any
    } else if (type === ResetState) {
      return initialState
    }
    return state
  }

export const createResetMergeReducer = <S, ACs>(initialState: S, handler: PartialHandler<S, ACs>): Reducer<S> =>
  (state: S = initialState, { payload, type }: AnyAction): S => {
    if (handler.hasOwnProperty(type)) {
      const changedState: Partial<S> = (handler as any)[type](state, payload) // tslint:disable-line:no-any
      return {
        ...(state as {}),
        ...(changedState as {}),
      } as S
    } else if (type === ResetState) {
      return initialState
    }
    return state
  }