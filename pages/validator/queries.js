export const createQueryValidadorBonded = (timestamp, accountId) => `
    query validator_bonded {
        validator_bonded(
        where: { account_id: { _eq: "${accountId}" }, timestamp: { _gt: ${timestamp} } },
        order_by: {timestamp: desc}
        ) {
            account_id
            amount
            timestamp
            session_index
            block_number
        }
    }
`;

export const createQueryRewards = (timestamp, accountId) => `
    query rewards {
        rewards(
        where: { stash_id: { _eq: "${accountId}" }, timestamp: { _gt: ${timestamp} } },
        order_by: { timestamp: desc }
        ) {
            block_number
            commission
            era_index
            era_points
            era_rewards
            estimated_payout
            stake_info
            stash_id
            timestamp
        }
    }
`;

export const createQuerySlashes = (timestamp, accountId) => `
    query MyQuery {
        validator_slashes_era(where: {account_id: {_eq: "${accountId}"}, timestamp: {_gt: ${timestamp}}}, order_by: {timestamp: desc}) {
            account_id
            amount
            block_number
            era_index
            timestamp
        }
    }
`;

export const createQueryProducedBlocks = (timestamp, accountId) => `
    query MyQuery {
        block(where: {block_author: {_eq: "${accountId}"}, timestamp: {_gt: ${timestamp}}}, order_by: {timestamp: desc}) {
            timestamp
            block_number
        }
    }
`;
