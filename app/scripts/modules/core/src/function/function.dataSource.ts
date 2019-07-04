import { module, IQService } from 'angular';

import { ApplicationDataSourceRegistry } from 'core/application/service/ApplicationDataSourceRegistry';
import { INFRASTRUCTURE_KEY } from 'core/application/nav/defaultCategories';
import { Application } from 'core/application/application.model';
import { EntityTagsReader } from 'core/entityTag/EntityTagsReader';
import { IFunctions } from 'core/domain';
import { FUNCTIONS_READ_SERVICE, FunctionsReader } from 'core/function/function.read.service';

export const FUNCTION_DATA_SOURCE = 'spinnaker.core.functions.dataSource';
console.log('DataSource module.ts loaded');
module(FUNCTION_DATA_SOURCE, [FUNCTIONS_READ_SERVICE]).run([
  '$q',
  'functionsReader',
  ($q: IQService, functionsReader: FunctionsReader) => {
    console.log('In the FunctionsReader');

    const functions = (application: Application) => {
      console.log('In the FunctionsReader Application:' + application);
      return functionsReader.loadFunction(application.name);
    };

    const addFunctions = (_application: Application, functionss: IFunctions[]) => {
      return $q.when(functionss);
    };

    const addTags = (application: Application) => {
      //  EntityTagsReader.addTagsToFunctions(application);
    };

    ApplicationDataSourceRegistry.registerDataSource({
      key: 'functions',
      label: 'Functions',
      sref: '.insight.functions',
      category: INFRASTRUCTURE_KEY,
      optional: true,
      icon: 'fa fa-xs fa-fw icon-sitemap',
      loader: functions,
      onLoad: addFunctions,
      afterLoad: addTags,
      providerField: 'cloudProvider',
      credentialsField: 'account',
      regionField: 'region',
      description: 'Traffic distribution management between servers',
    });
  },
]);
