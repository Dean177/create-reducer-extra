# create-reducer-extra

Provides some extras for creating boilerplate-free reducers

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
// { counter: 7, favoriteFoods: ['chocolate', 'pizza'] }

reducer(initialState, { payload: ['cat', 'dog'], type: 'NewAnimals' })
// { counter: 2, favoriteFoods: ['ant', 'bat', 'cat', 'dog] }

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

## createResetReducer
Provides the ability to reset a reducer to its initial state

```js
import { createResetReducer, ResetState } from 'create-reducer-extra'

const initialState = { animals: ['ant', 'bat'], counter: 2 }

const reducer = createMergeReducer(initialState, {
  Add: ({ counter }, incrementAmount) => ({ counter: counter + incrementAmount}),
  NewAnimals: ({ animals }, newAnimals) => ({ animals: [...animals, ...newAnimals] }),    
})

const nextState = reducer(initialState, { payload: 5, type: 'Add' })
// { counter: 7, favoriteFoods: ['chocolate', 'pizza'] }

reducer(nextState, { type: ResetState })
// { animals: ['ant', 'bat'], counter: 2 } === initialState

```
