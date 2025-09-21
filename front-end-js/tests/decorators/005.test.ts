class Manager {
  @watchChange
  accessor project: string = 'Simple Project'
}

function watchChange<T,V>(
  accessor: {get:(this:T)=>V,set:(this:T,v:V)=>void},
  context: ClassAccessorDecoratorContext<T,V>
) {
  return {
    get: function (this:T) {
      return accessor.get.call(this)
    },
    set: function(this:T, value:V) {
      console.log(`setting ${context.name.toString()} to ${value}`)
      accessor.set.call(this,value)
    }
  }
}

export function run() {
  console.log(
    '\n----------------------\n',
    'Starting 005.test',
    '\n----------------------\n',
  )

  const manager = new Manager()
  manager.project = 'Complicated project'
  manager.project = 'Super Complicated project'
}