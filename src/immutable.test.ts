// tslint:disable
import { Immutable } from './immutable'

type DeepTestType = Immutable<{
  a: string
  b: Array<number>
  c: { d: string, e: Array<number>, f: [number, { g: string, h: number }] }
  i: [number, string, boolean]
  j: { id: number, name: string }[]
  k: Set<number>
  l: Map<{ id: number, name: string }, { age: number }>
  n: Symbol
  o: Promise<void>
  p: Promise<{ q: { r: number } }>
  m(): void
}>

const record = { id: 123, name: 'zxc' }

const deepTest: DeepTestType = {
  a: 'asdf',
  b: [123, 234],
  c: { d: 'zxc', e: [1, 2, 3], f: [1, { g: 'iop', h: 789 }] },
  i: [1, 'a', true],
  j: [{ id: 1, name: 'c' }],
  k: new Set([1, 2, 3]),
  l: new Map([
    [record, { age: 789 }],
  ]),
  m() {
  },
  n: Symbol(),
  o: Promise.resolve(),
  p: Promise.resolve({ q: { r: 2 } }),
}

console.log(deepTest.a) // pass
deepTest.a = 'zxcv' // fail

console.log(deepTest.b[0]) // pass
deepTest.b[0] = 789 // fail
deepTest.b[1] = 890 // fail

console.log(deepTest.c.d) // pass
deepTest.c.d = 'asd' // fail

console.log(deepTest.c.f[0]) // pass
deepTest.c.f[0] = 'asd' // fail

console.log(deepTest.c.f[1].g) // pass
deepTest.c.f[1].g = 'zxc' // fail

console.log(deepTest.i[1]) // pass
console.log(Math.pow(deepTest.i[0], 1))  // pass (doesn't union tuple)
deepTest.i[1] = 'zxc' // fail

console.log(deepTest.j[0].id) // pass
deepTest.j[0].id = 789 // fail

console.log(deepTest.k) // pass
deepTest.k.add(789) // fail

console.log(deepTest.l.get(record).age) // pass
deepTest.l.get(record).age = 1 // fail
deepTest.l.set({ id: 789, name: 'blah' }, { age: 567 }) // fail
let keys = deepTest.l.keys()
let key = keys.next()
while (key) {
  console.log(key.value.name) // pass
  key.value.name = 'zxc' // fail
  key = keys.next()
}

deepTest.m() // pass
deepTest.m = () => console.log('n says nnn') // fail

console.log(deepTest.n) // pass
deepTest.n = Symbol() // fail

deepTest.o.then(() => console.log('hello')) // pass
deepTest.o = Promise.resolve() // fail
deepTest.p.then((obj) => console.log(obj)) // pass
deepTest.p.then((obj) => obj.q = 2)
) // fail