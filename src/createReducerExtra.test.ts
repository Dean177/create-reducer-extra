import {
  action,
  createMergeReducer,
  createReducer,
  createResetMergeReducer,
  createResetReducer,
  ResetState,
  resetState,
} from './createReducerExtra'
import Mock = jest.Mock

type MockState = { a: string , b: number }
const initialState: MockState = { a: 'a', b: 1 }
const mockNextState: MockState = { a: 'z', b: 100 }

const mockActionCreator =
  (payload: number) => action('MockActionType', payload)

const handledActions = { mockActionCreator }

describe('action', () => {
  it('create a flux standard action from its arguments', () => {
    const type = 'T'
    const payload = { p: 'p'}
    expect(action(type, payload).type).toBe(type)
    expect(action(type, payload).type).toBe(type)
  })
})

describe('resetState', () => {
  it('is an action creator', () => {
    expect(resetState().type).toBe(ResetState)
  })
})

describe('createMergeReducer' , () => {
  it('returns the state if no handler for the action type is provided', () => {
    const somePartialState = { b: 5 }
    const spy = jest.fn()
    const mergeReducer = createMergeReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (s, p) => {
        spy(s, p)
        return s
      },
    })

    const nextState = mergeReducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBe(true)
  })

  it('provides initial state to the reducer', () => {
    const spy = jest.fn()
    const somePartialState = { b: 5 }
    const mergeReducer = createMergeReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (s, p) => {
        spy(s, p)
        return somePartialState
      },
    })

    mergeReducer(undefined as any, mockActionCreator(5)) // tslint:disable-line:no-any
    expect(spy).toHaveBeenCalledWith(initialState, 5)
  })

  it('merges the object returned from its action handler into the state to produce the new state', () => {
    const somePartialState = { b: 5 }
    const spy = jest.fn()

    const mergeReducer = createMergeReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (s, p) => {
        spy(s, p)
        return somePartialState
      },
    })

    const nextState = mergeReducer(initialState, mockActionCreator(8))
    expect(nextState.a).toBe(initialState.a)
    expect(nextState.b).toBe(somePartialState.b)
  })
})

describe('createReducer', () => {
  let spy: Mock<Function>
  beforeEach(() => spy = jest.fn())

  it('returns the state if no handler for the action type is provided', () => {
    const reducer = createReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (s, p) => mockNextState
    })
    const nextState = reducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    const reducer = createReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (state, payload) => {
        spy(state, payload)
        return mockNextState
      },
    })

    reducer(undefined as any, mockActionCreator(3)) // tslint:disable-line:no-any
    expect(spy).toHaveBeenCalledWith(initialState, 3)
  })

  it('is called with the state and actions payload', () => {
    const reducer = createReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (state, payload) => {
        spy(state, payload)
        return state
      },
    })
    reducer(initialState, mockActionCreator(9))

    expect(spy).toHaveBeenCalledWith(initialState, 9)
  })
})

describe('createResetMergeReducer' , () => {
  let spy: Mock<Function>
  beforeEach(() => spy = jest.fn())

  const somePartialState: Partial<MockState> = { b: 5 }
  const resetMergeReducer = createResetMergeReducer<MockState, typeof handledActions>(initialState,  {
    MockActionType: (s, p) => {
      spy(s, p)
      return somePartialState
    }
  })

  it('returns the state if no handler for the action type is provided', () => {
    const nextState = resetMergeReducer(initialState, { type: 'UnhandledAction', payload: 7 })
    expect(nextState).toEqual(initialState)
    expect(nextState === initialState).toBeTruthy()
  })

  it('provides initial state to the reducer', () => {
    resetMergeReducer(undefined as any, mockActionCreator(17)) // tslint:disable-line:no-any
    expect(spy).toHaveBeenCalledWith(initialState, 17)
  })

  it('returns the initial state when it encounters a Reset action', () => {
    const nextState = resetMergeReducer(initialState, { type: ResetState })
    expect(nextState).toBe(initialState)
  })

  it('can handle the reset action itself to return a different state', () => {
    const resetStateChange = {
      a: '',
    }
    const actions = { resetState }
    const testResetMergeReducer = createResetMergeReducer<MockState, typeof actions>(initialState, {
      [ResetState]: (s, p) => {
        spy(s, p)
        return resetStateChange
      }
    })

    const nextState = testResetMergeReducer(initialState, { type: ResetState })

    expect(spy).toBeCalled()
    expect(nextState).toEqual({...initialState, ...resetStateChange})
  })

  it('merges the object returned from its action handler into the state to produce the new state', () => {
    const nextState = resetMergeReducer(initialState, mockActionCreator(3))
    expect(nextState.a).toBe(initialState.a)
    expect(nextState.b).toBe(somePartialState.b)
  })
})

describe('createResetReducer', () => {
  let spy: Mock<Function>
  beforeEach(() => spy = jest.fn())
  const resettableReducer = createResetReducer<MockState, typeof handledActions>(initialState,  {
    MockActionType: (s, p) => {
      spy(s, p)
      return { a: p.toLocaleString(), b: s.b + p }
    }
  })

  it('looks for the actions type in its action handler map to determine the new state', () => {
    const nextState = resettableReducer(initialState, mockActionCreator(12))
    expect(spy).toHaveBeenCalledWith(initialState, 12)
    expect(nextState).toEqual({ a: '12', b: 13 })
  })

  it('provides initial state to the reducer', () => {
    resettableReducer(undefined as any, mockActionCreator(15)) // tslint:disable-line:no-any
    expect(spy).toHaveBeenCalledWith(initialState, 15)
  })
  
  it('returns the initial state when it encounters a Reset action', () => {
    const nextState = resettableReducer(initialState, { type: ResetState })
    expect(nextState).toBe(initialState)
  })

  it('can handle the reset action itself to return a different state', () => {
    const postResetState: MockState = { a: '', b: 0 }
    const reducer = createResetReducer<MockState, { resetState: typeof resetState }>(initialState, {
      [ResetState]: (s, p) => {
        spy(s, p)
        return postResetState
      }
    })

    const nextState = reducer(initialState, { type: ResetState })

    expect(spy).toBeCalled()
    expect(nextState).toBe(postResetState)
  })

  it('returns its current state when it encounters an action with a type not in its action handler', () => {
    const nextState = resettableReducer(initialState, { type: 'SomeOtherType' })
    expect(nextState).toBe(initialState)
  })
})
