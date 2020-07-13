// Selected network
const selectedNetwork = `Polkadot`;

// Substrate networks
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

export const network = networks.find(({ name }) => name === selectedNetwork);

// Pagination options
export const paginationOptions = [10, 20, 50, 100];

// Breakpoints
export const mobileBreakpoint = 415;
export const mediumBreakpoint = 765;
