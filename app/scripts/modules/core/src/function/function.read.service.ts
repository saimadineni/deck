import { IPromise, module } from 'angular';

import { API } from 'core/api/ApiService';
// import { IComponentName, NameUtils } from 'core/naming';
import { IFunctionSourceData } from 'core/domain';

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
  // public static $inject = ['$q', 'functionsTransformer'];
  // public constructor(private $q: IQService, private functionsTransformer: any) {}

  public loadFunctions(applicationName: string): IPromise<IFunctionSourceData[]> {
    console.log('Function Reader in the read service: ' + applicationName);
    return (
      API.one('applications', applicationName)
        // TODO: replace with functions endpoint.
        .all('loadBalancers')
        .getList()
        .then((functionsReturned: any) => {
          console.log('Temporary Fix, until /functions endpoint is created in gate');
          return functionsReturned;
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
}

export const FUNCTION_READ_SERVICE = 'spinnaker.core.function.read.service';

console.log('Read Service module.ts loaded');
module(FUNCTION_READ_SERVICE, []).service('functionReader', FunctionReader);
