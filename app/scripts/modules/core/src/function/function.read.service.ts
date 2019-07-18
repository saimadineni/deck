import { IPromise, IQService, module } from 'angular';

import { API } from 'core/api/ApiService';
import { IComponentName, NameUtils } from 'core/naming';
import { IFunctionSourceData, IFunction } from 'core/domain';

export interface IFunctionByAccount {
  name: string;
  accounts: Array<{
    name: string;
    regions: Array<{
      name: string;
      functions: IFunctionSourceData[];
    }>;
  }>;
}

export class FunctionReader {
  public static $inject = ['$q', 'functionTransformer'];
  public constructor(private $q: IQService, private functionTransformer: any) {}


  public loadFunctions(applicationName: string): IPromise<IFunctionSourceData[]> {
    console.log('Function Reader in the read service: ' + applicationName);

    return (
      API.all('functions')
      .withParams({ region: 'us-west-2' })
      .getList().then((functions: IFunctionSourceData) => {
        console.log('FUNCTIONS returned: ', functions);
        // functions = this.functionTransformer.normalizeFunctionSet(functions);
        // return this.$q.all(functions.map(fn => this.normalizeFunction(fn)));
        return functions;
      })
    );
  }

  public getFunctionDetails(
    cloudProvider: string,
    account: string,
    region: string,
    name: string,
  ): IPromise<IFunctionSourceData[]> {
    return API.all('functions')
      .all(account)
      .all(region)
      .all(name)
      .withParams({ provider: cloudProvider })
      .get();
  }

  public listFunctions(cloudProvider: string): IPromise<IFunctionByAccount[]> {
    console.log('List Functions with: ' + cloudProvider);

    return API.all('functions')
      .withParams({ provider: cloudProvider })
      .getList();
  }

  private normalizeFunction(functionDef: IFunctionSourceData): IPromise<IFunction> {
    console.log('*************** functionDef source data');
    console.log(functionDef);
    return this.functionTransformer.normalizeFunction(functionDef).then((fn: IFunction) => {
      const nameParts: IComponentName = NameUtils.parseFunctionName(fn.name);
      fn.name = nameParts.freeFormDetails
      fn.cloudProvider = fn.provider || fn.cloudProvider;
      return fn;
    });
  }
}

export const FUNCTION_READ_SERVICE = 'spinnaker.core.function.read.service';

module(FUNCTION_READ_SERVICE, [require('./function.transformer').name]).service(
  'functionReader',
  FunctionReader,
);
