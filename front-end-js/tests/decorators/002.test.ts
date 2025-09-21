type Task = {
  name: string,
  level: 'low' | 'medium' | 'complicated'
}

class Manager {

  @withComplicatedTask
  tasks: Task[] = []
}

export function run() {
  console.log(
    '\n----------------------\n',
    'Starting 002.test',
    '\n----------------------\n',
  )

  const manager = new Manager()
  console.log(manager)
}

function withComplicatedTask<T,V extends Task[]>(target: undefined, context: ClassFieldDecoratorContext<T,V>) {
  return function (args: V) {
    args.push({
      name: 'Some Task',
      level: 'complicated'
    })
    return args
  }
}