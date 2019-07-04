import { module } from 'angular';
import { StateParams } from '@uirouter/angularjs';

import { INestedState, StateConfigProvider } from 'core/navigation';
import { APPLICATION_STATE_PROVIDER, ApplicationStateProvider } from 'core/application';
import { filterModelConfig } from 'core/function/filter/FunctionsFilterModel';
import { Function } from 'core/function/Function';

import { FunctionDetails } from './FunctionDetails';
// import { FunctionsFilters } from '../functions/filter/FunctionsFilters';

export const FUNCTION_STATES = 'spinnaker.core.functions.states';
module(FUNCTION_STATES, [APPLICATION_STATE_PROVIDER]).config([
  'applicationStateProvider',
  'stateConfigProvider',
  (applicationStateProvider: ApplicationStateProvider, stateConfigProvider: StateConfigProvider) => {
    const functionDetails: INestedState = {
      name: 'functionDetails',
      url: '/functionDetails/:provider/:accountId/:region/:vpcId/:name',
      params: {
        vpcId: {
          value: null,
          squash: true,
        },
      },
      views: {
        'detail@../insight': {
          component: FunctionDetails,
          $type: 'react',
        },
      },
      resolve: {
        accountId: ['$stateParams', ($stateParams: StateParams) => $stateParams.accountId],
        functions: [
          '$stateParams',
          ($stateParams: StateParams) => {
            return {
              name: $stateParams.name,
              accountId: $stateParams.accountId,
              region: $stateParams.region,
              vpcId: $stateParams.vpcId,
            };
          },
        ],
      },
      data: {
        pageTitleDetails: {
          title: 'Load Balancer Details',
          nameParam: 'name',
          accountParam: 'accountId',
          regionParam: 'region',
        },
        history: {
          type: 'functions',
        },
      },
    };

    const functions: INestedState = {
      url: `/functions?${stateConfigProvider.paramsToQuery(filterModelConfig)}`,
      name: 'functions',
      views: {
        nav: { component: FunctionDetails, $type: 'react' },
        master: { component: Function, $type: 'react' },
      },
      params: stateConfigProvider.buildDynamicParams(filterModelConfig),
      data: {
        pageTitleSection: {
          title: 'Functions Page',
        },
      },
      children: [],
    };

    applicationStateProvider.addInsightState(functions);
    applicationStateProvider.addInsightDetailState(functionDetails);
  },
]);
