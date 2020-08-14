import { network } from "../polkastats.config.js";
import { formatBalance, isHex } from "@polkadot/util";
formatBalance.setDefaults({
  decimals: network.decimalPlaces,
  unit: network.denom
});
import BN from "bn.js";

export default {
  methods: {
    formatNumber(number) {
      if (isHex(number)) {
        return parseInt(number, 16)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    },
    formatAmount(amount) {
      let bn;
      if (isHex(amount)) {
        bn = new BN(amount.substring(2, amount.length), 16);
      } else {
        bn = new BN(amount.toString());
      }
      return formatBalance(bn.toString(10));
    },
    shortAddress(address) {
      return (
        address.substring(0, 5) + "…" + address.substring(address.length - 5)
      );
    },
    shortHash(hash) {
      return `${hash.substr(0, 6)}…${hash.substr(hash.length - 4, 4)}`;
    },
    shortSessionId(sessionId) {
      return (
        sessionId.substring(0, 10) +
        "…" +
        sessionId.substring(sessionId.length - 10)
      );
    },
    formatRewardDest(rewardDestination) {
      if (rewardDestination === 0) {
        return `Stash account (increase stake)`;
      }
      if (rewardDestination === 1) {
        return `Stash account (don't increase stake)`;
      }
      if (rewardDestination === 2) {
        return `Controller account`;
      }
      return rewardDestination;
    },
    getImOnlineMessage(validator) {
      let message = "";
      if (validator.imOnline.isOnline) {
        message = "Active with ";
      } else {
        message = "Inactive with ";
      }
      message = `${message} ${validator.imOnline.blockCount} blocks authored, `;
      if (validator.imOnline.hasMessage) {
        message = message + "has heartbeat message!";
      } else {
        message = message + "no heartbeat message";
      }
      return message;
    },
    getStakePercent(amount, totalStakeBonded) {
      if (isHex(totalStakeBonded)) {
        totalStakeBonded = new BN(
          totalStakeBonded.substring(2, totalStakeBonded.length),
          16
        );
      } else {
        totalStakeBonded = new BN(totalStakeBonded.toString(), 10);
      }
      if (amount === 0 || totalStakeBonded.eq(new BN("0", 10))) {
        return `0`;
      }
      let amountBN;
      if (isHex(amount)) {
        amountBN = new BN(amount.substring(2, amount.length), 16);
      } else {
        amountBN = new BN(amount.toString(), 10);
      }
      const percent = amountBN
        .mul(new BN("100000", 10))
        .div(totalStakeBonded)
        .toString(10);
      return this.formatNumber(parseFloat(percent) / (1000).toFixed(3));
    }
  }
};
