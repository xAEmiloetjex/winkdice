/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

import confetti from 'canvas-confetti';
import axios from 'axios';
// import './global.module.scss'
import { IReturns, html } from './framework';

let state = {
  count: 0,
  count2: 0,
  fetchRetries: 0,
  exampleData: [
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    {
      name: "Ebola",
      desc: "Corona"
    },
    
  ]
};

html(`:root`).env(async ({ set, on, get, add, attr }: IReturns) => {
  attr("data-theme").set("light")
  attr("data-colorscheme").set("blue")
})

html('main#main').env(async ({ set, on, get, add, attr }: IReturns) => {
    set(`
    <button class="request btn">Click to fetch data</button>
    <button class="count btn">Count: 0</button>
    <div class="response-container" hidden>
      <h3 class="resp-title">Response:</h1>
      <div class="response"></div>
    </div>
    <div class="cont2">
      <span class="field-label"></span>
      <div class="holder"></div>
    </div>
  `);
});
html('.request').on('click', async ({ set, on, get, add, attr }: IReturns) => {
  attr('disabled').set('0');

  set(`Loading . . .`);

  // setTimeout(incr, 1000);

  await axios({
    method: 'post',
    url: 'http://127.0.0.1:3000/api/posts/get',
  }).then((res) => {
    const data = res.data;
    DefaultState();
    html('.response').set(`${JSON.stringify(data)}`);
    html('.response-container').attr('hidden').remove();
  }).catch((e) => {
    DefaultState();
    html('.resp-title').env(({ set, on, get, add, attr }: IReturns) => {
      set("Error: (Retrying in 3 seconds) (retry: " + state.fetchRetries +")")
      attr("style").set("background:#EA3A3A")
    })
    html('.response').set(`${JSON.stringify(e)}`);
    html('.response-container').attr('hidden').remove();

    setTimeout(() => {
      state.fetchRetries++
      html(".request").get()?.click()
    }, 3000)
  });

  function DefaultState() {
    attr('disabled').remove();
    set(`Click to fetch Data`);
    html('.resp-title').env(({ set, on, get, add, attr }: IReturns) => {
      set("Response:")
      attr("style").remove()
    })
  }
});

html('.count').on('click', async ({ set, on, get, add, attr }: IReturns) => {
  attr('disabled').set('0');
  set(`Loading . . .`);

  setTimeout(incr, 1000);

  function incr() {
    attr('disabled').remove();
    state.count++;
    set(`Count: ${state.count}`);
  }
});

html('.cont2').env(async ({ set, on, get, add, attr }: IReturns) => {
  // setInterval(() => {
  //   add(state.count2)
  //   state.count2++
  // }, 100)
  let state2 = {
    r: 0,
    g: 0,
    b: 0,
  };

  setInterval(() => {
    const color = randomcolor()
    attr("style").set(`min-height:300px;background:${color};`)
    html(`.cont2 > .field-label`).set(color)
  }, 150)



  function randomcolor() {
    const random = Math.round(Math.random() * 255);
    const val = Math.round(Math.random() * 3);

    if (val == 0 || val == 1) state2.r = random;
    if (val == 2) state2.g = random;
    if (val == 3) state2.b = random;

    return `rgb(${state2.r},${state2.g},${state2.b})`;
  }
});

html(`.cont2 > .holder`).env(async ({ set, on, get, add, attr }: IReturns) => {
  state.exampleData.forEach((item: typeof state.exampleData[0], index:number) => {
    add(`
      <div class="item item-${index}">
        <span class="item-name">${item.name}</span>
        <span class="item-desc">${item.desc}</span>
      </div>
    `)
  })
})
