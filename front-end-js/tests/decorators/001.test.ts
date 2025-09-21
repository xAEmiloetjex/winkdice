// @someOtherDeco
@withEmploymentDate
class Manager {
  task:     string = 'Simple task'
  project:  string = 'Simple project'

  constructor() {
    console.log('Initializing the Manager class')
  }
}

export function run() {
  console.log(
    '\n----------------------\n',
    'Starting 001.test',
    '\n----------------------\n',
  )
  
  const manager = new Manager()
  console.log(manager)
}

function withEmploymentDateOnPrototype(value: Function, context: ClassDecoratorContext) {
  value.prototype.withEmploymentDateOnPrototype = new Date().toISOString()
}

function withEmploymentDate<T extends {new(...argsd:any[]):{}}>(baseClass:T, context: ClassDecoratorContext) {
  return class extends baseClass {
    employmentDate = new Date().toISOString()
    constructor(...args:any[]) {
      super(...args);
      console.log('Adding employment date to ' + baseClass.name)
    }
  }
}

// function someOtherDeco<T extends {new(...argsd:any[]):{}}>(baseClass:T, context: ClassDecoratorContext) {
//   return class extends baseClass {
//     someOtherDeco_value = 'someOtherDeco was here!'
//     constructor(...args:any[]) {
//       super(...args);
//       console.log('Adding someOtherDeco to ' + baseClass.name)
//     }
//   }
// }

// function printDecoratorData(value: Function, context: ClassDecoratorContext) {
//   console.log('Value:\n', value)
//   console.log('Context:\n', context)
//   context.addInitializer(() => {
//     console.log('Initialized class ' + context.name)
//   })
// }