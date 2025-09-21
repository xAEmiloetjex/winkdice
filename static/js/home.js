import axios from "/js/lib/axios.min.js";

// import * as mfm from "/js/lib/mfm-js/main.min.js";

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

window.console.warn = (e) => cWarn(e, "home.js");
window.console.error = (e) => cError(e, "home.js");
document.onerror = (e) => cError(e, "home.js");
window.onerror = (e) => cError(e, "home.js");
document.onwarn = (e) => cWarn(e, "home.js");
window.onwarn = (e) => cWarn(e, "home.js");

const postTarget = _utils.$utils.getDomElement(".postTarget")


socket.on("homeReloadPosts", () => String(postTarget.value).startsWith("id:") ? () => {} : loadPosts(true));

// MFM.JS BYPASS //START
const mfm = {
  toString: (_) => _,
  parse: (_) => _ 
}
//END

async function loadPosts(requestAll) {

  let likes_ = await axios({
    method: "GET",
    url: "/api/posts/likes"
  }).then(resp => resp.data.posts)

  likes_ == null ? likes_ = [] : likes_ = likes_

  const likes = likes_

  console.log(likes)

  const postsSect = _utils.$utils.getDomElement(".posts");
  //   postsSect.innerHTML = "";
  if (String(postTarget.value).startsWith("id:")) {
    const targ = String(postTarget.value).split(":")
    const targ_id = targ[1]

    await axios({
      method: "POST",
      url: "/api/posts/getSpec/",
      data: {data: {post: {id: targ_id}}},
      headers: {
        axiosRequest: true
      }
    }).then((resp) => {
      const res = resp.data;
      console.log(res);

      let post = res.post

      post["likes"] = []

      const likesMap = findMap(likes, "post_id", post.id);
      if(likesMap == null) post["likes"] = []
      else post["likes"] = likes[likesMap]["likes"]

      const pChild = document.createElement("div");
      pChild.className = "post form singlePost";
      // pChild.style = "height:100vh;"
      pChild.innerHTML = `
        <span class="button-label">${post.poster}</span>
        <span class="post-Status-${post.id}">Waiting for the renderer to apply the functions to the buttons...</span>
        <hr/>
        <div class="form" style="padding:0.5rem;background-color:var(--theme-bg);overflow-x:scroll;max-height:calc(100% - 75px);height:100%;">
            <h4 class="postTitle">${mfm.toString(mfm.parse(post.title))}</h4>
            <p class="postContent" style="max-height:100%;">
              ${mfm.toString(mfm.parse(post.content))}
            </p>
        </div>
        <hr/>
        <div class="form post-controls" style="padding:0;">
          <!-- <div>
            <button class="like-${post.id} likebtn postctrlBtn" style="" title="W.I.P">
            <span class="likecount likes-${post.id}"></span> <iconify-icon data-icon icon="mdi:heart" />
            </button>
          </div> -->
          <div class="dropdown dropdwn-${post.id}" style="padding:0;">
            <button data-icon class="dropbtn dropdwn-btn-${post.id} postctrlBtn" style="">
              <iconify-icon data-icon icon="mdi:dots-vertical" />
            </button>
            <div id="myDropdown" class="dropdown-content dropdwn-cont-${post.id}"style="">
            <!-- <a href="/post/${post.id}">Open in new tab!</a> -->
            ${(() => {
              if (post.poster == _utils.$cookies.Get("UsrName")) {
                return `<button class="deletePost-${post.id}" data-colorscheme="red">Delete</button>`;
              } else return ''
            })()}
            </div>
          </div> 
        </div>
        `;
      postsSect.appendChild(pChild);
      addListeners(post)

      _utils.$utils.getDomElement(".posts").classList.add("singlePost")
    });
  }
  else {
  await axios({
    method: "POST",
    url: "/api/posts/get",
  }).then((resp) => {
    const res = resp.data;
    console.log(res);
    if (requestAll == false) res.posts = res.posts.slice(0, 1);
    if (requestAll == true) postsSect.innerHTML = "";

    if(res.posts.length==0) return postsSect.innerHTML = `
      <div class="post form">
      <span class="button-label" data-colorscheme="red">There are no posts to display here!</span>
      </div>
    `

    res.posts.forEach((post) => {
      const pChild = document.createElement("div");

      post["likes"] = []

      const likesMap = findMap(likes, "post_id", post.id);
      if(likesMap == null) post["likes"] = []
      else post["likes"] = likes[likesMap]["likes"]

      pChild.className = "post form";
      pChild.innerHTML = `
        <span class="button-label">${post.poster}</span>
        <span class="post-Status-${post.id}">Waiting for the renderer to apply the functions to the buttons...</span>
        <hr/>
        <div class="form" style="padding:0.5rem;background-color:var(--theme-bg);overflow-x:scroll;max-height:15rem;">
            <h4 class="postTitle">${mfm.toString(mfm.parse(post.title))}</h4>
            <p class="postContent">
              ${mfm.toString(mfm.parse(post.content))}
            </p>
        </div>
        <hr/>
        <div class="form post-controls" style="padding:0;">

          <!-- <div>
            <button class="like-${post.id} likebtn postctrlBtn" style="" title="W.I.P">
              <span class="likecount likes-${post.id}"></span> <iconify-icon data-icon icon="mdi:heart" />
            </button>
          </div> -->

          <div class="dropdown dropdwn-${post.id}" style="padding:0;">
            <button data-icon class="dropbtn dropdwn-btn-${post.id} postctrlBtn" style="">
              <iconify-icon data-icon icon="mdi:dots-vertical" />
            </button>
            <div id="myDropdown" class="dropdown-content dropdwn-cont-${post.id}"style="">
            <a href="/post/${post.id}">Open in new tab!</a>
            ${(() => {
              if (post.poster == _utils.$cookies.Get("UsrName")) {
                return `<button class="deletePost-${post.id}" data-colorscheme="red">Delete</button>`;
              } else return ''
            })()}
            </div>
          </div> 
        </div>
        `;
      postsSect.appendChild(pChild);
      addListeners(post)
    });
  });
  }

}
// document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
// });


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show-dropdwn')) {
        openDropdown.classList.remove('show-dropdwn');
      }
    }
  }
} 

// event listener function
async function addListeners(post) {


  // _utils.$utils.getDomElement(`.likes-${post.id}`).innerHTML=post.likes.length

  // _utils.$utils.getDomElement(`.like-${post.id}`).style.color="var(--dark_5)"
  // if (post.likes.includes(_utils.$cookies.Get("UsrName"))) _utils.$utils.getDomElement(`.like-${post.id}`).style.color="var(--red-pink_1)"
  // _utils.$utils.getDomElement(`.like-${post.id}`).addEventListener("click", async (ev) => {
  //   ev.preventDefault()

  //   if (post.likes.includes(_utils.$cookies.Get("UsrName"))) {
  //     await axios({
  //       method: "POST",
  //       url: "/api/posts/like",
  //       data: {
  //         data: {
  //           post,
  //           user: {
  //             name: _utils.$cookies.Get("UsrName"),
  //             token: _utils.$cookies.Get("UsrToken"),
  //           },
  //           filter: "remove"
  //         },
  //       },
  //     }).then(resp => {
  //       console.log(resp)
  //       window.location.reload()
  //     })
  //   } else {
  //     await axios({
  //       method: "POST",
  //       url: "/api/posts/like",
  //       data: {
  //         data: {
  //           post,
  //           user: {
  //             name: _utils.$cookies.Get("UsrName"),
  //             token: _utils.$cookies.Get("UsrToken"),
  //           },
  //           filter: "add"
  //         },
  //       },
  //     }).then(resp => {
  //       console.log(resp)
  //       window.location.reload()
  //     })
  //   }
  // })

  _utils.$utils.getDomElement(`.dropdwn-btn-${post.id}`).addEventListener("click", (ev) => {
    _utils.$utils.getDomElement(`.dropdwn-cont-${post.id}`).classList.toggle("show-dropdwn");
  })

  if (_utils.$utils.getDomElement(`.deletePost-${post.id}`) != null) {
    _utils.$utils
      .getDomElement(`.deletePost-${post.id}`)
      .addEventListener("click", async () => {
        const isSure = confirm("Are you sure you want to delete the post?");
        if (isSure) {
          await axios({
            method: "POST",
            url: "/api/posts/delete",
            data: {
              data: {
                post,
                user: {
                  name: _utils.$cookies.Get("UsrName"),
                  token: _utils.$cookies.Get("UsrToken"),
                },
              },
            },
          }).then((res) => {});
        } else return;
      });
  }

  _utils.$utils.getDomElement(`.post-Status-${post.id}`).innerHTML=""
  // console.log(_utils.$utils.getDomElement(`.post-Status-${post.id}`).style.display)
}


function findMap(array, client, id) {
  let Target = null;
  array.forEach((item, index) => {
    if (item[client] == id) return (Target = index);
    else return;
  });
  return Target;
}
