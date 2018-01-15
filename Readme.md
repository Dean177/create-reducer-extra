# create-reducer-extra

[![CircleCI](https://circleci.com/gh/Dean177/create-reducer-extra.svg?style=shield)](https://circleci.com/gh/Dean177/create-reducer-extra)
[![codecov](https://codecov.io/gh/Dean177/create-reducer-extra/branch/master/graph/badge.svg)](https://codecov.io/gh/Dean177/create-reducer-extra)
[![Greenkeeper badge](https://badges.greenkeeper.io/Dean177/create-reducer-extra.svg)](https://greenkeeper.io/)
[![Npm](https://badge.fury.io/js/create-reducer-extra.svg)](https://www.npmjs.com/package/create-reducer-extra)

A few helpful utilities for creating boilerplate-free redux reducers

## Usage

As a convenience* all reducing functions are called directly with the actions *payload* property
```js
const actionHandler = {
  ActionType: (state, payload) => { ... },
  SomeOtherActionType(state, payload) { ... },
}

```

## createMergeReducer

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

## createReducer

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

## createResettableReducer

Provides the ability to *reset* a reducer to its initial state.

This can be useful for handling things such as a logout in a single page app.

The *ResetState* can be overridden in the handler to provide custom behaviour. 

```js
import { createResettableReducer, ResetState } from 'create-reducer-extra'

const initialState = { animals: ['ant', 'bat'], counter: 2 }

const reducer = createMergeReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  NewAnimals: ({ animals }, newAnimals) => ({ animals: [...animals, ...newAnimals] }),    
})

const nextState = reducer(initialState, { payload: 5, type: 'Add' })
// { counter: 7, animals: ['ant', 'bat'] }

reducer(nextState, { type: ResetState })
// { animals: ['ant', 'bat'], counter: 2 } === initialState

```

## createResetMergeReducer
Combines the functionality of createMergeReducer and createResettableReducer.

Note that if the *ResetState* action is handled by the reducer, the result returned will be merged into the *current* state e.g.
 
```js
import { createResetMergeReducer, ResetState } from 'create-reducer-extra'

const initialState = { animals: ['ant', 'bat'], counter: 2 }

const reducer = createResetMergeReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  [ResetState]: ({ animals }) => ({ animals: [] }),    
})

const nextState = reducer(initialState, { type: ResetState })
// { counter: 2, animals: [] }
```
