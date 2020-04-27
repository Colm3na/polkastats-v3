// import {
//   web3Accounts,
//   web3Enable,
//   web3FromAddress,
//   web3ListRpcProviders,
//   web3UseRpcProvider
// } from "@polkadot/extension-dapp";
// import { ApiPromise, WsProvider } from "@polkadot/api";

// const wsProvider = new WsProvider("ws://v3dev1.polkastats.io:9944");
// console.log("PROVIDER: ", wsProvider);
// const api = ApiPromise.create({ provider: wsProvider }).then(response => {
//   console.log("API: ", response);
//   return response;
// });

// web3Enable("Polkastats").then(response => {
//   console.log("ALLINJECTED: ", response);
//   console.log("ALLINJECTED-ALLACOUNTS: ", response[0].accounts);
//   // console.log("API: ", api);
//   // returns an array of { address, meta: { name, source } }
//   // meta.source contains the name of the extension that provides this account
//   web3Accounts().then(response => {
//     console.log("ALLACCOUNTS: ", response);
//     const { address } = response[0];

//     // web3FromAddress().then(response => {
//     //   console.log("Injector: ", response);
//     // });
//   });
// });
