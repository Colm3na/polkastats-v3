// Selected network
// const selectedNetwork = `Polkadot`;
// const selectedNetwork = `Kusama`;
const selectedNetwork = `Westend`;

// Substrate networks
export const networks = [
  {
    id: "polkadot-cc1",
    name: "Polkadot",
    denom: "DOT",
    coinGeckoDenom: "polkadot-iou",
    decimalPlaces: 12,
    addressPrefix: 0,
    nodeWs: "wss://rpc.polkadot.io",
    backendWs: "wss://polkastats.io/api/v3",
    backendHttp: "http://polkastats.io/api/v3",
    erasPerDay: 1,
    lockUpPeriod: 28,
    validator: "15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t"
  },
  {
    id: "kusama-cc3",
    name: "Kusama",
    denom: "KSM",
    coinGeckoDenom: "kusama",
    decimalPlaces: 12,
    addressPrefix: 2,
    nodeWs: "wss://kusama-rpc.polkadot.io",
    backendWs: "wss://kusama.polkastats.io/api/v3",
    backendHttp: "http://kusama.polkastats.io/api/v3",
    erasPerDay: 4,
    lockUpPeriod: 7,
    validator: "GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY"
  },
  {
    id: "westend",
    name: "Westend",
    denom: "WND",
    coinGeckoDenom: undefined,
    decimalPlaces: 12,
    addressPrefix: 42,
    nodeWs: "wss://westend-rpc.polkadot.io",
    backendWs: "wss://v3dev2.polkastats.io/api/v3",
    backendHttp: "http://v3dev2.polkastats.io/api/v3",
    erasPerDay: 4,
    lockUpPeriod: 7,
    validator: undefined
  }
];

export const network = networks.find(({ name }) => name === selectedNetwork);

// Pagination options
export const paginationOptions = [10, 20, 50, 100];

// Breakpoints
export const mobileBreakpoint = 415;
export const mediumBreakpoint = 765;
