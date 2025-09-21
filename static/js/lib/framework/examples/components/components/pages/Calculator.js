import { html } from '../../../../index.js';
export function CalcPage(parent) {
    html(parent).set(`
    <style>
    @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");
:root {
  --side-margin: 10%;
}

form > *, .form > * {
  margin: 0;
}

.calculator {
  background-color: #DDD;
  margin-left: var(--side-margin);
  margin-right: var(--side-margin);
}
.calculator .display {
  width: 100%;
  height: 4.5rem;
  background-color: #114433;
  color: #DDD;
  font-family: "VT323", monospace;
  font-size: xx-large;
}
.calculator .btn-group .row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  align-content: center;
  text-align: center;
  justify-content: center;
}
.calculator .btn-group .row button {
  margin-top: 10px;
  width: calc(25% - 10px);
  height: 2rem;
  padding: 0;
  font-weight: bold;
}
.calculator .btn-group .row button.num {
  background-color: var(--theme-accent-1);
}
.calculator .btn-group .row button.ac {
  background-color: var(--red_5);
}
.calculator .btn-group .row button.eq {
  background-color: var(--green_5);
}

@media only screen and (max-width: 600px) {
  :root {
    --side-margin: 0%;
  }
}
    </style>
    <div class="form calculator-container">
      <h1>Calculator</h1>
      <hr />
      <div class="form calculator">
        <input
          id="calc-display"
          DISBALE::readonly
          class="display"
          type="text"
          aria-label=".form-control-lg example"
        />
        <div class="btn-group">
          <div class="row">
            <button class="btn">(</button>
            <button class="btn">)</button>
            <button class="btn">%</button>
            <button class="btn ac">AC</button>
          </div>
          <div class="row">
            <button class="btn num">7</button>
            <button class="btn num">8</button>
            <button class="btn num">9</button>
            <button class="btn ac">DEL</button>
          </div>
          <div class="row">
            <button class="btn num">4</button>
            <button class="btn num">5</button>
            <button class="btn num">6</button>
            <button class="btn">+</button>
          </div>
          <div class="row">
            <button class="btn num">1</button>
            <button class="btn num">2</button>
            <button class="btn num">3</button>
            <button class="btn">-</button>
          </div>
          <div class="row">
            <button class="btn">.</button>
            <button class="btn num">0</button>
            <button class="btn eq">=</button>
            <button class="btn">x</button>
          </div>
          <div class="row">
            <button class="btn">sin</button>
            <button class="btn">cos</button>
            <button class="btn">tan</button>
            <button class="btn">÷</button>
          </div>
          <div class="row">
            <button class="btn">log</button>
            <button class="btn">e</button>
            <button class="btn">ln</button>
            <button class="btn">^</button>
          </div>
          <div class="row">
            <button class="btn">π</button>
            <button class="btn">√</button>
            <button class="btn" disabled style="background:var(--light_5)"></button>
            <button class="btn">|</button>
          </div>
        </div>
      </div>
    </div>
    `);
    return "";
}
