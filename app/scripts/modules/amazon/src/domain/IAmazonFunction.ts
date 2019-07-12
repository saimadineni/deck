import { IFunction, IFunctionDeleteCommand, IFunctionUpsertCommand } from '@spinnaker/core';
import { string } from 'prop-types';

export interface IAmazonFunction extends IFunction {
  credentials?: string;
  role?: string;
  runtime: string;
  s3bucket: string;
  s3key: string;
  handler: string;
  functionName: string;
  description: string;
  tags: [{}];
}

export interface IAmazonFunctionUpsertCommand extends IFunctionUpsertCommand {
  role?: string;
  runtime: string;
  s3bucket: string;
  s3key: string;
  handler: string;
  tags: [{}];
  vpcId?: string;
  environment: {
    variables: {};
  };
}

export interface IAmazonFunctionDeleteCommand extends IFunctionDeleteCommand {
  runtime: string;
}
