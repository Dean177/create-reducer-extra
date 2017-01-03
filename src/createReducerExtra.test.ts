import { Reducer } from 'redux'
import {
  createMergeReducer,
  createReducer,
  createResetMergeReducer,
  createResettableReducer,
  ResetState,
} from './createReducerExtra'

interface MockState { a: string , b: number }
const initialState: MockState = { a: 'a', b: 1 }
const mockNextState: MockState = { a: 'z', b: 100 }
const mockAction = { payload: 1, type: 'SomeActionType' }

describe('createMergeReducer' , () => {
  const somePartialState = { b: 5 }
  const partialActionHandler = { SomeActionType: jest.fn(() => somePartialState) }
  const mergeReducer = createMergeReducer(initialState, partialActionHandler)

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = mergeReducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    const nextState = mergeReducer(undefined, mockAction)
    expect(partialActionHandler.SomeActionType).toHaveBeenCalledWith(initialState, mockAction.payload)
  })

  it('merges the object returned from its action handler into the state to produce the new state', () => {
    const nextState = mergeReducer(initialState, mockAction)
    expect(nextState.a).toBe(initialState.a)
    expect(nextState.b).toBe(somePartialState.b)
  })
})

const spyActionHandler = { SomeActionType: jest.fn(() => mockNextState) }
describe('createReducer', () => {
  const reducer = createReducer(initialState, spyActionHandler)

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = reducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    reducer(undefined, mockAction)
    expect(spyActionHandler.SomeActionType).toHaveBeenCalledWith(initialState, mockAction.payload)
  })

  it('is called with the state and actions payload', () => {
    const handledAction = { payload: '', type: 'SomeActionType' }
    reducer(initialState, handledAction)

    expect(spyActionHandler.SomeActionType).toHaveBeenCalledWith(initialState, handledAction.payload)
  })
})

describe('createResetMergeReducer' , () => {
  const somePartialState = { b: 5 }
  const partialActionHandler = { SomeActionType: jest.fn(() => somePartialState) }
  const resetMergeReducer = createResetMergeReducer(initialState, partialActionHandler)

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = resetMergeReducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    const nextState = resetMergeReducer(undefined, mockAction)
    expect(partialActionHandler.SomeActionType).toHaveBeenCalledWith(initialState, mockAction.payload)
  })

  it('returns the initial state when it encounters a Reset action', () => {
    const nextState = resetMergeReducer(initialState, { type: ResetState })
    expect(nextState).toBe(initialState)
  })

  it('can handle the reset action itself to return a different state', () => {
    const resetStateChange = { reset: true };
    const resetActionHandler = { [ResetState]: jest.fn(() => resetStateChange) }
    const resetMergeReducer = createResetMergeReducer(initialState, resetActionHandler)

    const nextState = resetMergeReducer(initialState, { type: ResetState })

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
  const reducer = createResettableReducer(initialState, spyActionHandler)

  it('looks for the actions type in its action handler map to determine the new state', () => {
    const reducer: Reducer<MockState> = createResettableReducer(initialState, spyActionHandler)

    const nextState = reducer(initialState, mockAction)
    expect(spyActionHandler.SomeActionType).toHaveBeenCalledWith(initialState, mockAction.payload)
    expect(nextState).toBe(mockNextState)
  })

  it('provides initial state to the reducer', () => {
    reducer(undefined, mockAction)
    expect(spyActionHandler.SomeActionType).toHaveBeenCalledWith(initialState, mockAction.payload)
  })
  
  it('returns the initial state when it encounters a Reset action', () => {
    const nextState = reducer(initialState, { type: ResetState })
    expect(nextState).toBe(initialState)
  })

  it('can handle the reset action itself to return a different state', () => {
    const resetState = { reset: true }
    const resetActionHandler = { [ResetState]: jest.fn(() => resetState)}
    const reducer = createResettableReducer(initialState, resetActionHandler)

    const nextState = reducer(initialState, { type: ResetState })

    expect(resetActionHandler[ResetState]).toBeCalled()
    expect(nextState).toBe(resetState)
  })

  it('returns its current state when it encounters an action with a type not in its action handler', () => {
    const nextState = reducer(initialState, { type: 'SomeOtherType' })
    expect(nextState).toBe(initialState)
  })
})

