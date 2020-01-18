import { decimals, unit } from '../polkastats.config.js';
import { formatBalance, isHex } from '@polkadot/util';
formatBalance.setDefaults({ decimals, unit });
import BN from 'bn.js';

export default {
  methods: {
    formatNumber(number) {
      if (isHex(number)) {
        return (parseInt(number, 16).toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      } else {
        return (number.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
      return (address).substring(0,5) + ' .... ' + (address).substring(address.length - 5);
    },
    shortSessionId(sessionId) {
      return (sessionId).substring(0,10) + ' .... ' + (sessionId).substring(sessionId.length - 10);
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
      let amountBN;
      if (isHex(amount)) {
        amountBN = new BN(amount.substring(2, amount.length), 16);
      } else {
        amountBN = new BN(amount.toString(), 10);
      }
      amountBN = amountBN.mul(new BN('100000', 10));
      let result = amountBN.div(totalStakeBonded);
      return this.formatNumber(parseInt(result.toString(10), 10) / 1000);
    }
  }
}