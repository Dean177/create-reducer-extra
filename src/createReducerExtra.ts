import { Immutable } from './immutable'

export type Action<Type extends string, Payload> = { type: Type; payload: Payload }

type AnyAction = Action<string, any>

export const action = <Type extends string, Payload>(
  type: Type,
  payload: Payload,
): Action<Type, Payload> => ({ type, payload })

export type Reducer<State, Actions> = (s: Immutable<State>, a: Actions) => State

export type ActionFromActionCreator<ActionCreator> = ActionCreator extends (
  ...args: any[]
  ) => Action<infer T, infer P>
  ? Action<T, P>
  : never

// The function types here might seem a little strange as the types this is used on don't have functions on the right hand side,
// but its to take advantage of the following (from the TS docs):
// > multiple candidates for the same type variable in contra-variant positions causes an intersection type to be inferred:
// e.g.
// ```typescript
// type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
// type T20 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;  // string
// type T21 = Bar<{ a: (x: string) => void, b: (x: number) => void }>;  // string & number
// ```
// // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
// See https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type another example
export type IntersectionOf<T> = ({ [K in keyof T]: (x: T[K]) => void }) extends Record<keyof T,
    (x: infer V) => void>
  ? V
  : never

export type ActionHandler<State, ActionCreator> = ActionCreator extends (
  ...args: any[]
  ) => Action<infer T, infer P>
  ? { [k in T]: (s: Immutable<State>, p: P) => State }
  : never

export type Handler<State, ActionCreators> = IntersectionOf<{ [K in keyof ActionCreators]: ActionHandler<State, ActionCreators[K]> }>

export type PartialActionHandler<State, ActionCreator> = ActionCreator extends (
  ...args: any[]
  ) => Action<infer T, infer P>
  ? { [k in T]: (s: Immutable<State>, p: P) => Partial<State> }
  : never

export type PartialHandler<State, ActionCreators> = IntersectionOf<{ [K in keyof ActionCreators]: PartialActionHandler<State, ActionCreators[K]> }>

export const createReducer = <State, ActionCreators>(
  initialState: State,
  handler: Handler<State, ActionCreators>,
): Reducer<State> => (
  state: Immutable<State> = initialState as Immutable<State>,
  { payload, type }: AnyAction,
): State => {
  if (handler.hasOwnProperty(type)) {
    return (handler as any)[type](state, payload)
  }
  return state as State
}

// Allows the reducer to only return what has changed, rather than having to list every single key of the state object
export const createMergeReducer = <State, ActionCreators>(
  initialState: State,
  handler: PartialHandler<State, ActionCreators>,
): Reducer<State> => (
  state: Immutable<State> = initialState as Immutable<State>,
  { payload, type }: AnyAction,
): State => {
  if (handler.hasOwnProperty(type)) {
    const changedState: Partial<State> = (handler as any)[type](state, payload) // tslint:disable-line:no-any
    return {
      ...(state as {}),
      ...(changedState as {}),
    } as State
  }
  return state as State
}

// TODO create a class of functions dedicated to throwing on unhandled actions? Maybe a `strict` flag?
export class UnhandledActionError extends Error {
}
