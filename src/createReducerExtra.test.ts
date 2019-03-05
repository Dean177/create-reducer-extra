// tslint:disable
import { action, createMergeReducer, createReducer } from './createReducerExtra'

type MockState = { a: string; b: number }
const initialState: MockState = { a: 'a', b: 1 }
const mockNextState: MockState = { a: 'z', b: 100 }

const mockActionCreator = (payload: number) => action('MockActionType', payload)

const handledActions = { mockActionCreator }

describe('action', () => {
  it('create a standard action from its arguments', () => {
    const type = 'T'
    const payload = { p: 'p' }
    expect(action(type, payload).type).toBe(type)
    expect(action(type, payload).payload).toBe(payload)
  })
})

describe('createReducer', () => {
  let spy: jest.Mock<Function>
  beforeEach(() => (spy = jest.fn()))

  it('returns the state if no handler for the action type is provided', () => {
    const reducer = createReducer<MockState, typeof handledActions>(initialState, {
      MockActionType: (s, p) => mockNextState,
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

    reducer(undefined as any, mockActionCreator(3))
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

describe('createMergeReducer', () => {
  it('returns the state if no handler for the action type is provided', () => {
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
