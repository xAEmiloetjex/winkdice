// import {
//   Client,
//   Account,
//   ID,
// } from "./Appwrite_Lib.min.js";

import {
    Client,
    Account,
    ID,
  } from "https://cdn.jsdelivr.net/npm/appwrite@11.0.0/+esm";

const client = new Client();

client
  .setEndpoint("http://localhost:8083/v1")
  .setProject("644bd815164baa9f22a2");


export default client;
