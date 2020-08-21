// Selected network
const selectedNetwork = `Polkadot`;
// const selectedNetwork = `Kusama`;
// const selectedNetwork = `Westend`;

// Substrate networks
export const networks = [
  {
    id: "polkadot-cc1",
    name: "Polkadot",
    denom: "New DOT",
    coinGeckoDenom: "polkadot",
    decimalPlaces: 10,
    addressPrefix: 0,
    nodeWs: "wss://rpc.polkadot.io",
    backendWs: "wss://polkastats.io/api/v3",
    backendHttp: "http://polkastats.io/api/v3",
    erasPerDay: 1,
    lockUpPeriod: 28,
    validator: "15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t",
    phragmenEnabled: true,
    googleAnalytics: "UA-144344973-1"
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
    validator: "GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY",
    phragmenEnabled: true,
    googleAnalytics: "UA-172854168-1"
  },
  {
    id: "westend",
    name: "Westend",
    denom: "WND",
    coinGeckoDenom: undefined,
    decimalPlaces: 12,
    addressPrefix: 42,
    nodeWs: "wss://westend-rpc.polkadot.io",
    backendWs: "wss://westend.polkastats.io/api/v3",
    backendHttp: "http://westend.polkastats.io/api/v3",
    erasPerDay: 4,
    lockUpPeriod: 7,
    validator: undefined,
    phragmenEnabled: false,
    googleAnalytics: "UA-175653321-1"
  }
];

export const network = networks.find(({ name }) => name === selectedNetwork);

// Pagination options
export const paginationOptions = [10, 20, 50, 100];

// Breakpoints
export const mobileBreakpoint = 415;
export const mediumBreakpoint = 765;
