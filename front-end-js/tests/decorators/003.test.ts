type Task = {
  name: string,
  level: 'low' | 'medium' | 'complicated'
}

class Manager {

  @withTask({
    name: 'Some Task 1',
    level: 'low'
  })
  @withTask({
    name: 'Some Task 2',
    level: 'medium'
  })
  @withTask({
    name: 'Some Task 3',
    level: 'complicated'
  })
  tasks: Task[] = []

  @withComplicatedTask()
  extraTasks: Task[] = []
}

export function run() {
  console.log(
    '\n----------------------\n',
    'Starting 003.test',
    '\n----------------------\n',
  )  

  const manager = new Manager()
  console.log(manager)
}

function withTask(task: Task) {
  return function<T,V extends Task[]>(target: undefined, context: ClassFieldDecoratorContext<T,V>) {
    return function (args: V) {
      args.push(task)
      return args
    }
  }
}

function withComplicatedTask() {
  return withTask({
    name: 'Some Complicated Task',
    level: 'complicated'
  })
}