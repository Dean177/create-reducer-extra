export type Primitive =
  | boolean
  | null
  | number
  | string
  | undefined
  | Function

export type Immutable<T> =
  T extends Primitive ? T :
    // Adding support for tuples breaks the type-checker: see https://github.com/Microsoft/TypeScript/issues/29566
    // Type extends [infer A] ? ImmutableObject<[A]> :
    // Type extends [infer A, infer B] ? ImmutableObject<[A, B]> :
    // Type extends [infer A, infer B, infer C] ? ImmutableObject<[A, B, C]> :
    // Type extends [infer A, infer B, infer C, infer D] ? ImmutableObject<[A, B, C, D]> :
    // Type extends [infer A, infer B, infer C, infer D, infer E] ? ImmutableObject<[A, B, C, D, E]> :
    // Type extends [infer A, infer B, infer C, infer D, infer E, infer F] ? ImmutableObject<[A, B, C, D, E, F]> :
    // Type extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G] ? ImmutableObject<[A, B, C, D, E, F, G]> :
    T extends Array<infer U> ? ImmutableArray<U> :
      T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
        T extends Set<infer U> ? ReadonlySet<ImmutableObject<U>> :
          T extends Promise<infer U> ? Promise<ImmutableObject<U>> :
            ImmutableObject<T>

export interface ImmutableArray<T> extends ReadonlyArray<Immutable<T>> {
}

export interface ImmutableMap<K, V> extends ReadonlyMap<Immutable<K>, Immutable<V>> {
}

export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> }
