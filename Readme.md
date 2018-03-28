# create-reducer-extra

[![CircleCI](https://circleci.com/gh/Dean177/create-reducer-extra.svg?style=shield)](https://circleci.com/gh/Dean177/create-reducer-extra)
[![codecov](https://codecov.io/gh/Dean177/create-reducer-extra/branch/master/graph/badge.svg)](https://codecov.io/gh/Dean177/create-reducer-extra)
[![Greenkeeper badge](https://badges.greenkeeper.io/Dean177/create-reducer-extra.svg)](https://greenkeeper.io/)
[![Npm](https://badge.fury.io/js/create-reducer-extra.svg)](https://www.npmjs.com/package/create-reducer-extra)

A few helpful utilities for creating boilerplate-free [Redux](https://redux.js.org/introduction) reducers with first class support for [Typescript](https://www.typescriptlang.org/)


## Installation

`yarn add create-reducer-extra`

Or using npm

`npm install --save create-reducer-extra`

## Usage

```js
// actions.ts
import { action } from 'create-reducer-extra'

export const actionA = (someNumber) => ({ type: 'A', payload: someNumber })
export const actionB = (someString) => ({ type: 'B', payload: someString })
export const actionC = (someBool) => action('C', someBool)

// reducer.ts
import { createReducer } from 'create-reducer-extra'

const initialState = { counter: 0 }

export const reducer = createReducer<State, HandledActions>(initialState, {
  A: (state, payload) => ({ counter: state.counter + payload[0] }),
  B: (state, payload) => ({ counter: state.counter + Number(payload) }),
  C: (state, payload) => ({ counter: payload ? state.counter + 1 : state.counter - 1 }),
})
```

## API

Note that all of the createReducer functions:
- Expects actions to be of the form `{ type: string, payload: any }`
- Your your handler functions will be called directly with the *payload* of the action

### `action`

A tiny utility for creating actions in the format `createReducer` expects

```js
// actions.ts
import { action } from 'create-reducer-extra'

const changeName = (name) => action('ChangeName', { newName: name })

changeName('Fluffy') // { type: 'ChangeName', payload: { newName: 'Fluffy' } }
```

### `createMergeReducer`

Allows you to only specify what has changed in your reducing function, e.g

```js
import { createMergeReducer } from 'create-reducer-extra'

const initialState = {
  animals: ['ant', 'bat'],
  counter: 2,
}

const reducer = createMergeReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  NewAnimals: ({ animals }, newAnimals) => ({ animals: [...animals, ...newAnimals] }),    
})

reducer(initialState, { payload: 5, type: 'Add' })
// { counter: 7, animals: ['ant', 'bat'] }

reducer(initialState, { payload: ['cat', 'dog'], type: 'NewAnimals' })
// { counter: 2, animals: ['ant', 'bat', 'cat', 'dog] }

```

### `createReducer`

For when you want to specify exactly what the next state will be


```js
import { createReducer } from 'create-reducer-extra'

const initialState = {
  animals: ['ant', 'bat'],
  counter: 2,
}

const reducer = createReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  NewAnimals: ({ animals, counter }, newAnimals) => ({ animals: [...animals, ...newAnimals], counter }),    
})

reducer(initialState, { payload: 3, type: 'Add' })
// { counter: 5 }
// Note the missing 'animals' property

```

### `createResettableReducer`

Provides the ability to *reset* a reducer to its initial state.

This can be useful for handling things such as a logout in a single page app.

The *ResetState* can be overridden in the handler to provide custom behaviour.

```js
import { createResettableReducer, resetState } from 'create-reducer-extra'

const initialState = { animals: ['ant', 'bat'], counter: 2 }

const reducer = createResettableReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  NewAnimals: ({ animals }, newAnimals) => ({ animals: [...animals, ...newAnimals] }),    
})

const nextState = reducer(initialState, { payload: 5, type: 'Add' })
// { counter: 7, animals: ['ant', 'bat'] }

reducer(nextState, resetState())
// { animals: ['ant', 'bat'], counter: 2 } === initialState
```

### `createResetMergeReducer`

Combines the functionality of createMergeReducer and createResettableReducer.

Note that if the *ResetState* action is handled by the reducer, the result returned will be merged into the *current* state e.g.

```js
import { createResetMergeReducer, resetState } from 'create-reducer-extra'

const initialState = { animals: ['ant', 'bat'], counter: 2 }

const reducer = createResetMergeReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  [ResetState]: ({ animals }) => ({ animals: [] }),    
})

const nextState = reducer(initialState, resetState())
// { counter: 2, animals: [] }
```

## Usage with Typescript

This library leverages some new features introduced in Typescript 2.8 to provide complete type safety with minimal boilerplate. To take advantage of completely type-safe reducers you need to:

1. Define your action creators

  ```typescript
  // actions.ts
  import { action, Action } from 'create-reducer-extra'

  const actionA = (param: Array<number>): Action<'A', Array<number>> =>
    ({ type: 'A', payload: param })

  const actionB = (param: string): Action<'B', string> => ({ type: 'B', payload: param })

  const actionC = () => action('C', false)
  ```

2. In your reducer create:
  - A type to represent the state of the reducer
  - A type to represent the actions your reducer should handled

3. Provide those as type parameters to your reducer-creator of choice:

  ```typescript
  // reducer.ts
  import { createReducer } from 'create-reducer-extra'
  import * as actions from './actions'

  type State = { counter: number }
  type HandledActions = typeof actions

  const reducer = createReducer<State, HandledActions>(initialState, {
    A: (state, payload) => ({ counter: state.counter + payload[0] }),
    B: (state, payload) => ({ counter: state.counter + Number(payload) }),
    C: (state, payload) => ({ counter: payload ? state.counter + 1 : state.counter - 1 }),
  })
  ```

Voila, everything is type-safe!
