import { Reducer } from 'redux'
import {
  ActionHandler,
  createMergeReducer,
  createReducer,
  createResetMergeReducer,
  createResettableReducer, PartialActionHandler, PartialPayloadReducer, PayloadReducer,
  ResetState,
} from './createReducerExtra'

type MockState = { a: string , b: number }
const initialState: MockState = { a: 'a', b: 1 }
const mockNextState: MockState = { a: 'z', b: 100 }
const MockActionType = 'MockActionType'
const mockAction = { payload: 1, type: MockActionType }
const spyActionHandler: ActionHandler<MockState> = {
  [MockActionType]: (jest.fn(() => mockNextState) as PayloadReducer<MockState>),
}

describe('createMergeReducer' , () => {
  const somePartialState = { b: 5 }
  const partialActionHandler = {
    [MockActionType]: jest.fn(() => somePartialState) as PartialPayloadReducer<MockState>,
  }
  const mergeReducer = createMergeReducer(initialState, partialActionHandler)

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = mergeReducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBe(true)
  })

  it('provides initial state to the reducer', () => {
    mergeReducer(undefined, mockAction)
    expect(partialActionHandler[MockActionType]).toHaveBeenCalledWith(initialState, mockAction.payload)
  })

  it('merges the object returned from its action handler into the state to produce the new state', () => {
    const nextState = mergeReducer(initialState, mockAction)
    expect(nextState.a).toBe(initialState.a)
    expect(nextState.b).toBe(somePartialState.b)
  })
})

describe('createReducer', () => {
  const reducer = createReducer(initialState, spyActionHandler)

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = reducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    reducer(undefined, mockAction)
    expect(spyActionHandler[MockActionType]).toHaveBeenCalledWith(initialState, mockAction.payload)
  })

  it('is called with the state and actions payload', () => {
    const handledAction = { payload: '', type: MockActionType }
    reducer(initialState, handledAction)

    expect(spyActionHandler[MockActionType]).toHaveBeenCalledWith(initialState, handledAction.payload)
  })
})

describe('createResetMergeReducer' , () => {
  const somePartialState = { b: 5 }
  const partialActionHandler: PartialActionHandler<MockState> = {
    [MockActionType]: (jest.fn(() => somePartialState) as PartialPayloadReducer<MockState>),
  }
  const resetMergeReducer = createResetMergeReducer(initialState, partialActionHandler)

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = resetMergeReducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    const nextState = resetMergeReducer(undefined, mockAction)
    expect(partialActionHandler[MockActionType]).toHaveBeenCalledWith(initialState, mockAction.payload)
  })

  it('returns the initial state when it encounters a Reset action', () => {
    const nextState = resetMergeReducer(initialState, { type: ResetState })
    expect(nextState).toBe(initialState)
  })

  it('can handle the reset action itself to return a different state', () => {
    const resetStateChange = { reset: true }
    const resetActionHandler: PartialActionHandler<MockState> = {
      [ResetState]: (jest.fn(() => resetStateChange) as PartialPayloadReducer<MockState>),
    }
    const testResetMergeReducer = createResetMergeReducer(initialState, resetActionHandler)

    const nextState = testResetMergeReducer(initialState, { type: ResetState })

    expect(resetActionHandler[ResetState]).toBeCalled()
    expect(nextState).toEqual({...initialState, ...resetStateChange})
  })

  it('merges the object returned from its action handler into the state to produce the new state', () => {
    const nextState = resetMergeReducer(initialState, mockAction)
    expect(nextState.a).toBe(initialState.a)
    expect(nextState.b).toBe(somePartialState.b)
  })
})

describe('createResettableReducer', () => {
  const resettableReducer = createResettableReducer(initialState, spyActionHandler)

  it('looks for the actions type in its action handler map to determine the new state', () => {
    const reducer: Reducer<MockState> = createResettableReducer(initialState, spyActionHandler)

    const nextState = reducer(initialState, mockAction)
    expect(spyActionHandler[MockActionType]).toHaveBeenCalledWith(initialState, mockAction.payload)
    expect(nextState).toBe(mockNextState)
  })

  it('provides initial state to the reducer', () => {
    resettableReducer(undefined, mockAction)
    expect(spyActionHandler[MockActionType]).toHaveBeenCalledWith(initialState, mockAction.payload)
  })
  
  it('returns the initial state when it encounters a Reset action', () => {
    const nextState = resettableReducer(initialState, { type: ResetState })
    expect(nextState).toBe(initialState)
  })

  it('can handle the reset action itself to return a different state', () => {
    const resetState = { reset: true }
    const resetActionHandler = { [ResetState]: (jest.fn(() => resetState) as PartialPayloadReducer<MockState>)}
    const reducer = createResettableReducer(initialState, resetActionHandler)

    const nextState = reducer(initialState, { type: ResetState })

    expect(resetActionHandler[ResetState]).toBeCalled()
    expect(nextState).toBe(resetState)
  })

  it('returns its current state when it encounters an action with a type not in its action handler', () => {
    const nextState = resettableReducer(initialState, { type: 'SomeOtherType' })
    expect(nextState).toBe(initialState)
  })
})
