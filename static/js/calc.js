import axios from "/js/lib/axios.min.js";

import * as mfm from "/js/lib/mfm-js/index.js";

import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  _utils,
} from "./lib/Utils.js";

import "./_globals.js";
import { socket } from "./_globals.js";

// document.addEventListener("DOMContentLoaded", function () {
    const display = document.getElementById('calc-display');
    const buttons = document.getElementsByClassName('btn');
  
    let currentValue = "";
  
    function evaluateResult() {
      console.log('currentValue:', currentValue)
      const convertedValue = currentValue
        .replaceAll("|",",")
        .replaceAll("x", "*")
        .replaceAll("÷", "/")
        .replaceAll('%', '*0.01')
        .replaceAll('sin', 'Math.sin')
        .replaceAll('cos', 'Math.cos')
        .replaceAll('ln', 'Math.log')
        .replaceAll('π', 'Math.PI')
        .replaceAll('log', 'Math.log10')
        .replaceAll('e', 'Math.E')
        .replaceAll('tan', 'Math.tan')
        .replaceAll('√', 'Math.sqrt')
        .replaceAll("^", "Math.pow");
      
      console.log('convertedValue:', convertedValue)
      const result = eval(convertedValue);
      currentValue = result.toString();
      display.value = currentValue;
    }
  
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      button.addEventListener('click', function() {
        const value = button.innerText;

        try {
            if (value == "AC") {
              currentValue = "";
              display.value = currentValue;
            } else if (value == "DEL") {
              const val = currentValue;
              const val2 = val.split("");
              const val3 = val2.splice(0,val2.length -1);
              currentValue = val3.join("");
              display.value = currentValue;
            } else if(value == "=") {
              evaluateResult();
            } else {
              currentValue += value;
              display.value = currentValue;
            }
        } catch (error) {
            console.error(error);
            currentValue = "ERROR";
            display.value = currentValue;
        }

        
      })
      
    }
  
  
//   });