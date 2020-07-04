export const createQueryValidadorBonded = (timestamp, accountId) => `
    query validator {
        validator(
        where: { account_id: { _eq: "${accountId}" }, timestamp: { _gt: ${timestamp} } },
        order_by: {timestamp: desc}
        ) {
            account_id
            exposure_total
            timestamp
            session_index
            block_height
        }
    }
`;

export const createQueryRewards = accountId => `
    query validator_era_staking {
        validator_era_staking(
        where: { stash_id: { _eq: "${accountId}" } },
        order_by: { era_index: asc }
        ) {
            commission
            era_index
            era_points
            era_rewards
            estimated_payout
            stake_info
            stash_id
        }
    }
`;

export const createQuerySlashes = (timestamp, accountId) => `
    query slashes {
        validator_era_slash(where: {account_id: {_eq: "${accountId}"}, timestamp: {_gt: ${timestamp}}}, order_by: {timestamp: desc}) {
            account_id
            amount
            era_index
            timestamp
        }
    }
`;

export const createQueryProducedBlocks = (timestamp, accountId) => `
    query produced_blocks {
        validator(where: {account_id: {_eq: "${accountId}"}, timestamp: {_gt: ${timestamp}}}, order_by: {timestamp: desc}) {
            account_id
            produced_blocks
            session_index
            timestamp
        }
    }
`;
