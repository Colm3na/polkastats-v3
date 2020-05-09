<template>
  <div role="tablist">
    <b-card no-body class="mb-2 info">
      <b-button v-b-toggle.accordion-1 block href="#" variant="info"
        >Delegators rewards. How does it work</b-button
      >
      <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
        <b-card-body class="pt-3 pb-1">
          <ul>
            <li>
              There are 225 slots currently, as there are 225 validators.
            </li>
            <li>
              An slot is the group of accounts that includes the validator
              account and its delegator accounts.
            </li>
            <li>
              Validators accumulate points for their activity. They have to sign
              validity statments and produce blocks to gain points.
            </li>
            <li>
              At the end of an era (6 epochs of 600 blocks each) the total
              reward is divided among the 225 slots based on their accumulated
              points.
            </li>
            <li>
              Once each slots gets its reward, the commission of the validator
              is subtracted from the slot earnings.
            </li>
            <li>
              The rest of the slot earnings is distributed among the delegators
              based in their percentaje of stake of in the slot.
            </li>
          </ul>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-2 info">
      <b-button v-b-toggle.accordion-2 block href="#" variant="info"
        >Risks</b-button
      >
      <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          According to the game rules, you may think that the most profitable
          validator is the one occuping the slot with less total stake. This is
          partially true, but you better consider the folowing risks. Last slot
          of the list (number 225 currently) has great chances of being out of
          the list in the next epoch. When a validator gets out of the list that
          validator and its nominators stop receiving rewards and its slot is
          occupied by a new validator. Slashing is a different kind of risk you
          may consider. When a validator misbehaves it suffers an slashing
          event. Slashing is the punishment for failing to follow the protocol.
          The punishment is applied to the validator and all delegators of its
          slot. Downtimes and equivocations (bad signing) are the most common
          reasons that trigger a slashing event. The only way to protect
          yourself from slashing events is to carefully chose the validators you
          are nominating. Studing its history, setup and reputation may help you
          when selecting the validators where you are depositing your trust
          (your stake)
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<style scoped>
.info {
  border-radius: 0.6rem;
}
</style>
