import {watcher} from "../../src/decorators/common.js";
class Employee {
  name: string;
  salary: number;
  gender: 'male' | 'female' | 'other'
  role: 'developer' | 'manager'
}

@withEmploymentDate
class Developer_001 extends Employee {
  constructor() {
    super()
    this.name = 'henk';
    this.salary = 420
    this.gender = 'male'
    this.role = 'developer'
  }

  @withTask({
    name: 'make contact page',
    level: 'medium'
  })
  tasks: Task[] = []
}
@withEmploymentDate
class Developer_002 extends Employee {
  constructor() {
    super()
    this.name = 'Maya';
    this.salary = 420
    this.gender = 'female'
    this.role = 'developer'

  }

  @withTask({
    name: 'Fix bug #0A0005',
    level: 'complicated'
  })
  tasks: Task[] = []
}

@withEmploymentDate
class ProjectManager extends Employee {
  constructor() {
    super()
    this.name = 'Amy';
    this.salary = 69420
    this.gender = 'other'
    this.role = 'manager'
  }

  @withTask({
    name: 'Telling the devs what to do',
    level: 'low'
  })
  tasks: Task[] = []
}

const workers = {
  Henk: new Developer_001(),
  Maya: new Developer_002(),
  Amy: new ProjectManager()
}

class Project {

  public workers = workers

  @watcher({
    set: (_t,_v,_c) => {
      console.log({
        status: 'changed',
        entry: _c.name,
        value: _v
      })
    }
  })
  accessor budget: number = 70260

  // @watcher({
  //   get: (_t, _c) => console.log('GET\n',_t,_c),
  //   set: (_t,_v,_c) => console.log('SET\n',_t,_v,_c)
  // })
  accessor _ = ''

  @watchChange
  accessor latestStatus = 'nothing happened yet'

  @withBudget(workers.Henk.salary)
  ContactPage() {
    console.log(`${workers.Henk.name}(${workers.Henk.role})`,'made contact page and earned', workers.Henk.salary, 'the task was level of medium', `their gender is ${workers.Henk.gender}`)
  }

  @withBudget(workers.Maya.salary)
  BugFix() {
    console.log(`${workers.Maya.name}(${workers.Maya.role})`,'fixed a bug and earned', workers.Maya.salary, 'the task was level of complicated', `their gender is ${workers.Maya.gender}`)
  }

  @withBudget(workers.Amy.salary)
  SitAroundAndDoNothing() {
    console.log(`${workers.Amy.name}(${workers.Amy.role})`,'Sat around and did nothing and earned', workers.Amy.salary, 'the task was level of low', `their gender is ${workers.Amy.gender}`)
  }
}

export function run() {
  console.log(
    '\n----------------------\n',
    'Starting 006.test',
    '\n----------------------\n',
  )

  const proj = new Project()
  proj.ContactPage()
  proj.latestStatus = 'Henk made the contact page!';
  proj.BugFix()
  proj.latestStatus = 'Maya fixed a bug!';
  proj.SitAroundAndDoNothing()
  proj.latestStatus = 'Amy sat around and did nothing!'
  proj.BugFix()
  proj.latestStatus = 'Maya wanted to fix another bug but there wasn\'t enough funding!';

  console.log(proj)

  // console.log(proj._)
  // proj._ = 'peanits'
  // console.log(proj._)

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

function withTask(task: Task) {
  return function<T,V extends Task[]>(target: undefined, context: ClassFieldDecoratorContext<T,V>) {
    return function (args: V) {
      args.push(task)
      return args
    }
  }
}

function withBudget(actionBudget: number) {
  return function<T extends {budget: number}>(target: Function, context: ClassMethodDecoratorContext<T>) {
    return function(...args: any) {
      const instance = this as T
      if (instance.budget >= actionBudget) {
        instance.budget = instance.budget - actionBudget

        target.apply(instance, args)
      } else {
        console.error(`Insufficient budget for ${context.name.toString()}. Required ${actionBudget}, available ${instance.budget}!`)
      }
      return target
    }
  }
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
      console.log(JSON.parse(`{"${context.name.toString()}": "${value}"}`))
      accessor.set.call(this,value)
    }
  }
}

type Task = {
  name: string,
  level: 'low' | 'medium' | 'complicated'
}