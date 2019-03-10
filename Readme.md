# create-reducer-extra

[![CircleCI](https://circleci.com/gh/Dean177/create-reducer-extra.svg?style=shield)](https://circleci.com/gh/Dean177/create-reducer-extra)
[![codecov](https://codecov.io/gh/Dean177/create-reducer-extra/branch/master/graph/badge.svg)](https://codecov.io/gh/Dean177/create-reducer-extra)
[![Npm](https://badge.fury.io/js/create-reducer-extra.svg)](https://www.npmjs.com/package/create-reducer-extra)

A few helpful utilities for creating boilerplate-free reducers with first class support for [Typescript](https://www.typescriptlang.org/).

Works great with [useReducer]() or [Redux](https://redux.js.org/introduction) 


## Installation

`yarn add create-reducer-extra`

Or using npm

`npm install --save create-reducer-extra`

## Usage

As a convenience all reducing functions are called directly with the actions *payload* property

```typescript
// actions.ts
import { action } from 'create-reducer-extra'

export const actionA = (someNumber) => ({ type: 'A', payload: someNumber })
export const actionB = (someString) => ({ type: 'B', payload: someString })
export const actionC = (someBool) => action('C', someBool)

// reducer.ts
import { createReducer } from 'create-reducer-extra'
import * as actions from './actions'

type State = { counter: number }
const initialState: State = { counter: 0 }

type Actions = typeof actions


export const reducer = createReducer<State, Actions>(initialState, {
  A: (state, someNumber) => ({ counter: state.counter + someNumber }),
  B: (state, someString) => ({ counter: state.counter + Number(someString) }),
  C: (state, payload) => ({ counter: payload ? state.counter + 1 : state.counter - 1 }),
})
```

## API

Note that all of the `createReducer` functions:
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

## Usage with React & useReducer

## Usage with Redux
