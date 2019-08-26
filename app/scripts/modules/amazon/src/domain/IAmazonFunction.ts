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
  publish: boolean;
  description: string;
  tags: [{}];
  memorySize: number;
  timeout: number;
  envVariables: {};
  tracingConfig: {
    mode: string;
  };
  deadLetterConfig: {
    targetArn: string;
  };
  KMSKeyArn: string;
}

export interface IAmazonFunctionUpsertCommand extends IFunctionUpsertCommand {
  role?: string;
  runtime: string;
  s3bucket: string;
  s3key: string;
  handler: string;
  tags: [{}];
  memorySize: number;
  timeout: number;
  vpcId?: string;
  envVariables: {};
  publish: boolean;
  tracingConfig: {
    mode: string;
  };
  deadLetterConfig: {
    targetArn: string;
  };
  KMSKeyArn: string;
}

export interface IAmazonFunctionDeleteCommand extends IFunctionDeleteCommand {
  cloudProvider: string;
  functionName: string;
  region: string;
  credentials: string;
}
