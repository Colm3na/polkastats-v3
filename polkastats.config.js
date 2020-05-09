/* PolkaStats app configuration params */
export const unit = `KSM`;
export const decimals = 12;
export const backendBaseURL = `https://polkastats.io/api/v2`;
export const blockExplorer = {
  block: `https://polkascan.io/pre/kusama-cc3/block/`,
  account: `https://polkascan.io/pre/kusama-cc3/account/`
};

export const numItemsTableValidatorOptions = [10, 20, 90, 180, 225];
export const numItemsTableOptions = [10, 20, 50, 100];

// Breakpoints
export const mobileBreakpoint = 415;
export const mediumBreakpoint = 765;
