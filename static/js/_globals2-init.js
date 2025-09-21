import { html } from "./lib/framework/index.js";
import { lifesteal_ad_banner_horizontal_img } from "./lib/svg_banners/projects/horizontal/001.js";
export function init() {
  if(document.querySelector('.ad_container_1') !== null)
    html(".ad_container_1").set(`<div class="advert_id_001 advert"><a href="https://discord.gg/mWd6pRwmW6" class="attr_link">${lifesteal_ad_banner_horizontal_img}</a></div>`)

sessionStorage.setItem("allowAds", "false")
}
init()
// let fred;

// window.tdiff = []; fred = function(a,b){return a-b;};
// window.document.onload = function(e){ 
//     console.log("document.onload", e, Date.now() ,window.tdiff,  
//     (window.tdiff[0] = Date.now()) && window.tdiff.reduce(fred) ); 
// }
// window.onload = function(e){ 
//     console.log("window.onload", e, Date.now() ,window.tdiff, 
//     (window.tdiff[1] = Date.now()) && window.tdiff.reduce(fred) ); 
// }

// onload()
// document.onload()