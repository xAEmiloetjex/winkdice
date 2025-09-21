import {prompt as _prompt} from "enquirer"
import axios from "axios"

import {User} from "./src/entity/User";

try {
_prompt([
    {type: "input", name: "usrname", message: "What is the user's username"},
    {type: "input", name: "email", message: "What is the user's email"},
    {type: "password", name: "pass", message: "What is the user's password"},
    {type: "password", name: "passconf", message: "Confirm the user's password"},
    {type: "confirm", name: "IsAdmin", message: "Should this user be an admin?"}
  ]).then(async resp_ => {
      const reg: IReg = (resp_ as unknown as IReg)
      if (reg.usrname == "") return console.log("Username invalid")
      if (reg.pass == "") return console.log("Password invalid")
      if (reg.email == "") return console.log("Email invalid")
      var emailValidation = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (emailValidation.test(reg.email) == false) return console.log("Email invalid")
    
      await axios({
        method: "POST",
        url: "http://127.0.0.1:3000/api/users/get",
        data: {
          data: {
            username: reg.usrname
          }
        }
      }).then(async resp => {
        console.log(resp)
        if (resp.data.shortcode == 902) {
          await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/users/create",
            data: {
              data: {
                username: reg.usrname,
                password: reg.pass,
                email: reg.email
              }
            }
          }).then(async () => { 
            await new Promise((resolve) => setTimeout(resolve, 1000))         
            if (reg.IsAdmin) return await axios({
              method: "POST",
              url: "http://127.0.0.1:3000/api/users/get",
              data: {
                data: {
                  username: reg.usrname
                }
              }
            }).then(async resp => {
              const code: typeof User = JSON.parse(JSON.stringify(resp.data.data)) // this might seem ineficient and  stuff but is have my ways and you have yours
              code["roles"] = ["default","admin"]
              await axios({
                method: "POST",
                url: "http://127.0.0.1:3000/api/users/setRawData",
                data: {
                    data: JSON.stringify(code)
                }
            })
            })
          })
        } else if (resp.data.shortcode == 102) {
			console.log("User exists")
        } else {
			console.log("There was an error, please try again")
        }
      })
    });
} catch (e) {
	console.log(e)
}
interface IReg {
	usrname: string;
	pass: string;
	passconf: string;
	email: string;
	IsAdmin: boolean;
}