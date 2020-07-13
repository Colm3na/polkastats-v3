/* PolkaStats app configuration params */
export const unit = `DOT`;
export const decimals = 12;
export const addressPrefix = 0;
export const nodeURL = "wss://rpc.polkadot.io";
export const blockExplorer = {
  block: `https://polkascan.io/polkadot-cc1/block/`,
  account: `https://polkascan.io/polkadot-cc1/account/`
};

export const networks = [
  {
    id: "polkadot-cc1",
    name: "Polkadot",
    denom: "DOT",
    decimalPlaces: 12,
    addressPrefix: 0,
    nodeWs: "wss://rpc.polkadot.io",
    backendWs: "wss://polkastats.io/api/v3"
  },
  {
    id: "kusama-cc3",
    name: "Kusama",
    denom: "KSM",
    decimalPlaces: 12,
    addressPrefix: 2,
    nodeWs: "wss://kusama-rpc.polkadot.io",
    backendWs: "wss://kusama.polkastats.io/api/v3"
  }
];

// Selected network
export const network = networks.find(({ name }) => name === `Polkadot`);

export const numItemsTableValidatorOptions = [10, 20, 50, 100];
export const numItemsTableOptions = [10, 20, 50, 100];

// Breakpoints
export const mobileBreakpoint = 415;
export const mediumBreakpoint = 765;
