<template>
  <div>
    <section>
      <b-container class="main pt-4">
        <b-alert show dismissible variant="info" class="text-center">
          Connected to chain <strong>{{system.chain}}</strong> using <strong>{{ system.client_name}}</strong> client version <strong>{{system.client_version}}</strong>
        </b-alert>
        <b-alert show dismissible variant="success" class="text-center">
          Total stake bonded in {{system.chain}} network is now <strong>{{ formatDot(totalStakeBonded) }}</strong>
        </b-alert>
        <p class="session text-right">Last block: <strong>#{{ formatNumber(bestblocknumber) }}</strong> | Session: <strong>{{ formatNumber(session.sessionProgress) }}/{{ formatNumber(session.sessionLength) }}</strong> | Era: <strong>{{ formatNumber(session.eraProgress) }}/{{ formatNumber(session.eraLength) }}</strong></p>
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-active-validators" data-toggle="tab" href="#active-validators" role="tab" aria-controls="nav-active-validators" aria-selected="true">VALIDATORS ({{ validators.length }})</a>
            <a class="nav-item nav-link" id="nav-intention-validators" data-toggle="tab" href="#intention-validators" role="tab" aria-controls="nav-intention-validators" aria-selected="false">INTENTIONS ({{ intentions.length }})</a>
            <a class="nav-item nav-link" id="nav-favorites" data-toggle="tab" href="#favorites" role="tab" aria-controls="nav-favorites" aria-selected="false"> <i class="far fa-star" style="color: rgb(241, 189, 35);"></i> FAVORITES ({{ favorites.length }})</a>
          </div>
        </nav>
        <div class="tab-content mb-2" id="nav-tabContent">
          <div class="tab-pane fade show active" id="active-validators" role="tabpanel" aria-labelledby="nav-active-validators">
            <div class="validator card mb-3" v-for="(validator, index) in validators" v-bind:key="validator.accountId">
              <div class="card-body">
                <p class="text-right mb-0">
                  <a class="favorite" v-on:click="toggleFavorite(validator.accountId)" v-b-tooltip.hover title="Mark as Favorite">
                    <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" v-b-tooltip.hover title="Unset as Favorite"></i>
                    <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                  </a>
                </p>
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasIdentity(validator.stashId)">
                      <div v-if="getIdentity(validator.stashId).logo !== ''">
                        <img v-bind:src="getIdentity(validator.stashId).logo" class="identity mt-2" />
                        <h4 class="mt-2 mb-2" v-if="getIdentity(validator.stashId).full_name !== ''">{{ getIdentity(validator.stashId).full_name }}</h4>
                      </div>
                      <div v-else>
                        <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                      </div>
                    </div>
                    <div v-else>
                      <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                    </div>
                    <p class="mt-3 mb-0 rank">
                      rank #{{ index+1 }}
                    </p>
                    <p v-if="validator.stakers.total > 0" class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }}</p>
                    <p v-else class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakingLedger.total) }}</p>
                    <p class="mb-0">
                      <small>
                        <span v-b-tooltip.hover title="Self bonded" v-if="validator.stakers.own > 0">{{ formatDot(validator.stakers.own) }}</span>
                        <span v-b-tooltip.hover title="Bonded by nominators" v-if="(validator.stakers.total - validator.stakers.own) > 0">(+{{ formatDot(validator.stakers.total - validator.stakers.own) }})</span>
                      </small>
                    </p>
                    <p v-b-tooltip.hover title="Total stake percentage">{{ getStakePercent(validator.stakers.total) }}% of total stake</p>
                  </div>
                  <div class="col-md-9">
                    <h4 class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                      <nuxt-link :to="{name: 'validator', query: { accountId: validator.accountId } }" title="Validator details">
                        <span v-if="hasNickname(validator.accountId)">
                          {{ getNickname(validator.accountId) }}
                        </span>
                        <span v-else>
                          {{ validator.accountId }}
                        </span>
                      </nuxt-link>
                    </h4>
                    <div class="row">
                      <div class="col-md-3 mb-1">
                        <strong>Controller</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" />
                        <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddress(validator.controllerId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-1">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon :value="validator.stashId" :size="20" :theme="'polkadot'" />
                        <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddress(validator.stashId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-1">
                        <strong>Comission</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatDot(validator.validatorPrefs.validatorPayment) }}
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-1">
                        <strong>Reward destination</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatRewardDest(validator.rewardDestination) }}
                      </div>
                    </div>

                    <div v-bind:id="'validator-info-' + index">
                      <template v-if="validator.stakers.others.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Stakers ({{ validator.stakers.others.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#current-session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'current-session-id-' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Current session ids ({{ validator.sessionIds.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'session-id-' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Next session ids ({{ validator.nextSessionIds.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'current-session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(sessionId, index) in validator.sessionIds" class="row" v-bind:key="index">
                            <div class="col-12 mb-1 who">
                              {{ index+1 }}.
                              <Identicon :value="sessionId" :size="20" :theme="'polkadot'" />                      
                              <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(sessionId, index) in validator.nextSessionIds" class="row" v-bind:key="index">
                            <div class="col-12 mb-1 who">
                              {{ index+1 }}.
                              <Identicon :value="sessionId" :size="20" :theme="'polkadot'" />                      
                              <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.stakers.others.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(staker, index) in validator.stakers.others" class="row" v-bind:key="index">
                            <div class="col-8 mb-1 who">
                              <Identicon :value="staker.who" :size="20" :theme="'polkadot'" />                      
                              <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddress(staker.who) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ staker.who }}</span>                        
                              </a>
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatDot(staker.value) }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade show" id="intention-validators" role="tabpanel" aria-labelledby="nav-intention-validators">
            <div class="validator card mb-3" v-for="(validator, index) in intentions" v-bind:key="validator.accountId">
              <div class="card-body">
                <p class="text-right mb-0">
                  <a class="favorite" v-on:click="toggleFavorite(validator.accountId)" v-b-tooltip.hover title="Mark as Favorite">
                    <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" v-b-tooltip.hover title="Unset as Favorite"></i>
                    <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                  </a>
                </p>
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasIdentity(validator.stashId)">
                      <div v-if="getIdentity(validator.stashId).logo !== ''">
                        <img v-bind:src="getIdentity(validator.stashId).logo" class="identity mt-2" />
                        <h4 class="mt-2 mb-2" v-if="getIdentity(validator.stashId).full_name !== ''">{{ getIdentity(validator.stashId).full_name }}</h4>
                      </div>
                      <div v-else>
                        <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                      </div>
                    </div>
                    <div v-else>
                      <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                    </div>
                    <p class="mt-3 mb-0 rank">
                      rank #{{ index+1 }}
                    </p>
                    <p class="bonded mb-0" v-b-tooltip.hover title="Active bonded">
                      {{ formatDot(validator.stakingLedger.active) }}
                    </p>
                    <p class="mb-0">
                      <small>
                        <span v-b-tooltip.hover title="Total bonded">
                          {{ formatDot(validator.stakingLedger.total) }}
                        </span>
                      </small>
                    </p>
                  </div>
                  <div class="col-md-9">
                    <h4 class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                      <nuxt-link :to="{name: 'intention', query: { accountId: validator.accountId } }" title="Validator intention details">
                        <span v-if="hasNickname(validator.accountId)">
                          {{ getNickname(validator.accountId) }}
                        </span>
                        <span v-else>
                          {{ validator.accountId }}
                        </span>
                      </nuxt-link>
                    </h4>
                    <div class="row">
                      <div class="col-md-3 mb-1">
                        <strong>Controller</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" />
                        <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddress(validator.controllerId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-1">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon :value="validator.stashId" :size="20" :theme="'polkadot'" />
                        <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddress(validator.stashId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-1">
                        <strong>Comission</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatDot(validator.validatorPrefs.validatorPayment) }}
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-1">
                        <strong>Reward destination</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatRewardDest(validator.rewardDestination) }}
                      </div>
                    </div>
                    <div v-bind:id="'validator-info-' + index">
                      <template v-if="validator.stakers.others.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Stakers ({{ validator.stakers.others.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#current-session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'current-session-id-' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Current session ids ({{ validator.sessionIds.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'session-id-' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Next session ids ({{ validator.nextSessionIds.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'current-session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(sessionId, index) in validator.sessionIds" class="row" v-bind:key="index">
                            <div class="col-12 mb-1 who">
                              {{ index+1 }}.
                              <Identicon :value="sessionId" :size="20" :theme="'polkadot'" />                      
                              <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(sessionId, index) in validator.nextSessionIds" class="row" v-bind:key="index">
                            <div class="col-12 mb-1 who">
                              {{ index+1 }}.
                              <Identicon :value="sessionId" :size="20" :theme="'polkadot'" />                      
                              <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.stakers.others.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(staker, index) in validator.stakers.others" class="row" v-bind:key="index">
                            <div class="col-8 mb-1 who">
                              <Identicon :value="staker.who" :size="20" :theme="'polkadot'" />                      
                              <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddress(staker.who) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ staker.who }}</span>                        
                              </a>
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatDot(staker.value) }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade show" id="favorites" role="tabpanel" aria-labelledby="nav-favorites">
            <template v-if="favorites.length == 0">
              <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                <strong>Hi there!</strong> You can click in the star icon <i class="fas fa-star"></i> of a validator to track it on this tab.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </template>
            <template  v-for="(validator, index) in intentions">
              <template v-if="isFavorite(validator.accountId)">
                <div class="validator card mb-3">
                  <p class="text-right mb-0">
                    <a class="favorite" v-on:click="toggleFavorite(validator.accountId)" v-b-tooltip.hover title="Mark as Favorite">
                      <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" v-b-tooltip.hover title="Unset as Favorite"></i>
                      <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                    </a>
                  </p>                 
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3 mb-2 text-center">
                        <div v-if="hasIdentity(validator.stashId)">
                          <div v-if="getIdentity(validator.stashId).logo !== ''">
                            <img v-bind:src="getIdentity(validator.stashId).logo" class="identity mt-2" />
                            <h4 class="mt-2 mb-2" v-if="getIdentity(validator.stashId).full_name !== ''">{{ getIdentity(validator.stashId).full_name }}</h4>
                          </div>
                          <div v-else>
                            <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                          </div>
                        </div>
                        <div v-else>
                          <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                        </div>
                        <p class="mt-3 mb-0 rank">
                          rank #{{ index+1 }}
                        </p>
                        <p class="bonded mb-0" v-b-tooltip.hover title="Active bonded">
                          {{ formatDot(validator.stakingLedger.active) }}
                        </p>
                        <p class="mb-0">
                          <small>
                            <span v-b-tooltip.hover title="Total bonded">
                              {{ formatDot(validator.stakingLedger.total) }}
                            </span>
                          </small>
                        </p>
                        <editable v-if="!hasIdentity(validator.stashId)" v-bind:favorites="favorites" v-model="favorites[getIndex(validator.accountId)].name"></editable>
                      </div>
                      <div class="col-md-9">
                        <h4 class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                          <nuxt-link :to="{name: 'intention', query: { accountId: validator.accountId } }" title="Validator details">
                            <span v-if="hasNickname(validator.accountId)">
                              {{ getNickname(validator.accountId) }}
                            </span>
                            <span v-else>
                              {{ validator.accountId }}
                            </span>
                          </nuxt-link>
                        </h4>
                        <div class="row">
                          <div class="col-md-3 mb-1">
                            <strong>Controller</strong>
                          </div>
                          <div class="col-md-9 mb-1">
                            <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" />
                            <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                              <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddress(validator.controllerId) }}</span>
                              <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                            </a>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-3 mb-1">
                            <strong>Stash</strong>
                          </div>
                          <div class="col-md-9 mb-1">
                            <Identicon :value="validator.stashId" :size="20" :theme="'polkadot'" />
                            <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                              <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddress(validator.stashId) }}</span>
                              <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                            </a>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-3 mb-1">
                            <strong>Comission</strong>
                          </div>
                          <div class="col-md-9 mb-1 fee">
                            {{ formatDot(validator.validatorPrefs.validatorPayment) }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-md-3 mb-1">
                            <strong>Reward destination</strong>
                          </div>
                          <div class="col-md-9 mb-1 fee">
                            {{ formatRewardDest(validator.rewardDestination) }}
                          </div>
                        </div>
                        <div v-bind:id="'validator-info-' + index">
                          <template v-if="validator.stakers.others.length > 0">
                            <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                              <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Stakers ({{ validator.stakers.others.length }})</h6>
                            </a>
                          </template>
                          <template v-if="validator.sessionIds.length > 0">
                            <a class="" data-toggle="collapse" v-bind:href="'#current-session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'current-session-id-' + index">
                              <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Current session ids ({{ validator.sessionIds.length }})</h6>
                            </a>
                          </template>
                          <template v-if="validator.nextSessionIds.length > 0">
                            <a class="" data-toggle="collapse" v-bind:href="'#session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'session-id-' + index">
                              <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Next session ids ({{ validator.nextSessionIds.length }})</h6>
                            </a>
                          </template>
                          <template v-if="validator.sessionIds.length > 0">
                            <div class="nominator collapse pt-2 pb-3"  v-bind:id="'current-session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                              <div v-for="(sessionId, index) in validator.sessionIds" class="row" v-bind:key="index">
                                <div class="col-12 mb-1 who">
                                  {{ index+1 }}.
                                  <Identicon :value="sessionId" :size="20" :theme="'polkadot'" />                      
                                  <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                    <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                    <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-if="validator.nextSessionIds.length > 0">
                            <div class="nominator collapse pt-2 pb-3"  v-bind:id="'session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                              <div v-for="(sessionId, index) in validator.nextSessionIds" class="row" v-bind:key="index">
                                <div class="col-12 mb-1 who">
                                  {{ index+1 }}.
                                  <Identicon :value="sessionId" :size="20" :theme="'polkadot'" />                      
                                  <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                    <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                    <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-if="validator.stakers.others.length > 0">
                            <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index" v-bind:data-parent="'#validator-info-' + index">
                              <div v-for="(staker, index) in validator.stakers.others" class="row" v-bind:key="index">
                                <div class="col-8 mb-1 who">
                                  <Identicon :value="staker.who" :size="20" :theme="'polkadot'" />                      
                                  <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                                    <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddress(staker.who) }}</span>
                                    <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ staker.who }}</span>                        
                                  </a>
                                </div>
                                <div class="col-4 text-right value">
                                  {{ formatDot(staker.value) }}
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <p>&nbsp;</p>
          </div>
        </div>
        <p>&nbsp;</p>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import axios from 'axios';
import bootstrap from 'bootstrap';
import Identicon from '../components/identicon.vue';
import editable from '../components/editable.vue';
import { formatBalance, isHex } from '@polkadot/util';
import BN from 'bn.js';
import { decimals, unit, backendBaseURL, blockExplorer} from '../polkastats.config.js';

formatBalance.setDefaults({ decimals, unit });

export default {
  head () {
    return {
      title: 'PolkaStats - Polkadot network statistics',
      meta: [
        { hid: 'description', name: 'description', content: 'Polkadot network statistics' }
      ]
    }
  },
  data: function() {
    return {
      system: {
        chain: "",
        client_name: "",
        client_version: "",
        timestamp: 0
      },
      blockExplorer,
      backendBaseURL,
      favorites: [],
      polling: null,
      bestblocknumber: 0,
      session: {  
        currentEra: 0,
        currentIndex: 0,
        eraLength: 0,
        eraProgress: 0,
        lastEraLengthChange: 0,
        lastLengthChange: 0,
        sessionLength: 0,
        sessionsPerEra: 0,
        sessionProgress: 0
      }
    }
  },
  computed: {
    validators () {
      return this.$store.state.validators.list
    },
    totalStakeBonded () {
      return this.$store.state.validators.totalStakeBonded
    },
    intentions () {
      return this.$store.state.intentions.list
    },
    identities() {
      return this.$store.state.identities.list
    },
    nicknames() {
      return this.$store.state.nicknames.list
    }
  },
  created: function () {
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get('favorites')) {
      this.favorites = this.$cookies.get('favorites');
    }

    // First time
    this.getSystemData();
    this.getChainData();
    
    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch('validators/update');
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch('identities/update');
    }

    // Force update of nicknames list if empty
    if (this.$store.state.nicknames.list.length == 0) {
      vm.$store.dispatch('nicknames/update');
    }

    // Force update of intention validators list if empty
    if (this.$store.state.intentions.list.length == 0) {
      vm.$store.dispatch('intentions/update');
    }

    /* Update validators, intention validators, best block and session info every 10 seconds */
    this.polling = setInterval(() => {
      vm.$store.dispatch('validators/update');
      vm.$store.dispatch('intentions/update');
      this.getChainData();
    }, 10000);

  },
  beforeDestroy: function () {
    clearInterval(this.polling);
    clearInterval(this.sessionPolling);
  },
  methods: {
    getSystemData: function () {
      var vm = this;
      axios.get(`${backendBaseURL}/system`)
        .then(function (response) {
          vm.system = response.data;
        })
    },
    getChainData: function () {
      var vm = this;
      axios.get(`${backendBaseURL}/chain`)
        .then(function (response) {
          vm.bestblocknumber = response.data.block_height;
          vm.session = response.data.session;
        });
    },
    formatNumber(n) {
      if (isHex(n)) {
        return (parseInt(n, 16).toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      } else {
        return (n.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
    },
    formatDot(amount) {
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
    thousandsSeparator(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    toggleFavorite(validator) {
      // Receives validator accountId
      if (this.isFavorite(validator)) {
        this.favorites.splice(this.getIndex(validator), 1);
      } else {
        this.favorites.push({ accountId: validator, name: 'Edit validator name...'});
      }
      return true;
    },
    isFavorite(validator) {
      // Receives validator accountId
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
          return true;
        }
      }
      return false;
    },
    getIndex(validator) {
      // Receives validator accountId
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
          return i;
        }
      }
      return false;
    },
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    },
    formatRewardDest(rewardDestination) {
      if (rewardDestination === 0) {
        return `Stash account (increase the amount at stake)`;
      }
      if (rewardDestination === 1) {
        return `Stash account (do not increase the amount at stake)`;
      }
      if (rewardDestination === 2) {
        return `Controller account`;
      }
      return rewardDestination;
    },
    hasIdentity(stashId) {
      return this.$store.state.identities.list.some(obj => {
        return obj.stashId === stashId;
      });
    },
    getIdentity(stashId) {
      let filteredArray =  this.$store.state.identities.list.filter(obj => {
        return obj.stashId === stashId
      });
      return filteredArray[0];
    },
    hasNickname(accountId) {
      return this.$store.state.nicknames.list.some(obj => {
        return obj.accountId === accountId;
      });
    },
    getNickname(accountId) {
      let filteredArray =  this.$store.state.nicknames.list.filter(obj => {
        return obj.accountId === accountId
      });
      return filteredArray[0].nickname;
    },
    getStakePercent(amount) {
      let bn;
      if (isHex(amount)) {
        bn = new BN(amount.substring(2, amount.length), 16);
      } else {
        bn = new BN(amount.toString(), 10);
      }
      bn = bn.mul(new BN('100', 10));
      return bn.div(this.totalStakeBonded);
    }
  },
  watch: {
    favorites: function (val) {
      //console.log(val);
      this.$cookies.set('favorites', val, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }
  },
  components: {
    editable,
    Identicon
  }
}
</script>
<style>
body {
  font-size: 0.9rem;
}
.favorite {
  cursor: pointer;
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  z-index: 10;
  font-size: 1.1rem;
}
.validator .bg-offline {
  background-color: rgba(239, 57, 74, 0.12) !important;
}
.validator .bg-candidate {
  background-color: rgba(21, 240, 86, 0.12) !important;
}
.rank {
  font-size: 1.6rem;
  color: #7d7378;
}
.account {
  color: #670d35;
}
.bonded {
  color: #d75ea1;
  font-weight: 700;
  font-size: 1.3rem;
}
[data-toggle="collapse"] .fas:before {   
  content: "\f078";
}
[data-toggle="collapse"][aria-expanded="false"] .fas:before {
  content: "\f054";
}
.nominators {
  color: #670d35;
}
.nominator {
  font-size: 0.9rem;
}
.nominator .value {
  color: #d75ea1;
  font-weight: 700;
}
.fee, .unstake {
  color: #d75ea1;
  font-weight: 700;
}
.block {
  color: #d75ea1;
  font-weight: bold;
}
.block:hover {
  color: #d75ea1;
}
.tab-content .validator:nth-child(1) {
  border-top: 0;
}
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
.validator .col-md-9 .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
.validator .col-md-9 .identicon div {
  display: inline;
}
.identity {
  max-width: 80px;
}
</style>