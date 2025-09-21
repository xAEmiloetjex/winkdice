export function html(location: string) {
  let elem: HTMLElement | null = document.querySelector(location);

  const returns: IReturns = { set, on, get, add, attr, env };
  if (elem == null) elem=document.body

  function attr(name: string) {
    function set(value: string) {
      return elem?.setAttribute(name, value);
    }
    function get() {
      return elem?.getAttribute(name);
    }
    function remove() {
      return elem?.removeAttribute(name);
    }
    return { set, remove, get };
  }
  function set(code: string) {
    return {
      el:(elem.innerHTML = code),
      _: returns
    };
  }
  function add(code: string) {
    return (elem.innerHTML += code);
  }
  function get() {
    return elem;
  }
  function on<K extends keyof HTMLElementEventMap>(
    event: K,
    cb: Function,
  ): any {
    return elem?.addEventListener(
      event,
      (ev) => ( cb({...returns, ev})),
    );
  }
  function env(cb: Function): any {
    return cb(returns);
  }
  return returns;
}

export interface IReturns {
  set: (code: string) => string;
  on: <K extends keyof HTMLElementEventMap>(event: K, cb: Function) => any;
  get: () => HTMLElement | null;
  add: (code: string) => string;
  attr: (name: string) => {
    set: (value: string) => void;
    get: () => string;
    remove: () => void;
  };
  env: (cb: Function) => any;
}
