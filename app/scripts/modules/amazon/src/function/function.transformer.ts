import { AWSProviderSettings } from 'amazon/aws.settings';
import { Application } from '@spinnaker/core';

import { IAmazonFunctionUpsertCommand, IAmazonFunction } from 'amazon/domain';

export class AwsFunctionTransformer {
  public static convertFunctionForEditing(functionDef: IAmazonFunction): IAmazonFunctionUpsertCommand {
    /* TODO */
    return null;
  }

  public static constructNewAwsFunctionTemplate(application: Application): IAmazonFunctionUpsertCommand {
    const defaultCredentials = application.defaultCredentials.aws || AWSProviderSettings.defaults.account,
      defaultRegion = application.defaultRegions.aws || AWSProviderSettings.defaults.region;

    return {
      role: '',
      runtime: '',
      s3bucket: '',
      s3key: '',
      handler: '',
      functionName: '',
      tags: [{}],
      description: '',
      vpcId: '',
      credentials: defaultCredentials,
      cloudProvider: 'aws',
      detail: '',
      region: defaultRegion,
      environment: {
        variables: {},
      },
    };
  }
}
