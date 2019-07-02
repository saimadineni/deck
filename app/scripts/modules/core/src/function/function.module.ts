import { module } from 'angular';

import { FUNCTION_DATA_SOURCE } from './function.dataSource';
import { FUNCTION_STATES } from './function.states';
// import './FunctionsSearchResultType';

export const FUNCTIONS_MODULE = 'spinnaker.core.function';

module(FUNCTIONS_MODULE, [FUNCTION_DATA_SOURCE, FUNCTION_STATES]);
console.log('Functions module.ts loaded');
