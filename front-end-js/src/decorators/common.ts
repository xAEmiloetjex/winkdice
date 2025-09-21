export function watcher(callbacks: {
  get?: (this_context, context?) => void,
  set?: (this_context, value, context?) => void,
}) {
  return function watchChange<T,V>(
    accessor: {get:(this:T)=>V,set:(this:T,v:V)=>void},
    context: ClassAccessorDecoratorContext<T,V>
  ) {
    return {
      get: function (this:T) {
        if(callbacks.get !== undefined) callbacks.get(this, context)
        return accessor.get.call(this)
      },
      set: function(this:T, value:V) {
        if(callbacks.set !== undefined) callbacks.set(this, value, context)
        return accessor.set.call(this,value)
      }
    }
  }
}