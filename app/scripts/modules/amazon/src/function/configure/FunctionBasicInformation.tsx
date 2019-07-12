import * as React from 'react';

import {
  FormikFormField,
  AccountService,
  IAccount,
  IWizardPageComponent,
  HelpField,
  TextInput,
  ReactSelectInput,
} from '@spinnaker/core';

import { FormikProps, Field, FormikErrors } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';
import { FunctionReader, IFunctionByAccount } from 'core/function/function.read.service';
import { Subject } from 'rxjs';
import * as classNames from 'classnames';
const availableRuntimes = [
  'nodejs',
  'nodejs4.3',
  'nodejs6.10',
  'nodejs8.10',
  'nodejs10.x',
  'java8',
  'python2.7',
  'python3.6',
  'python3.7',
  'dotnetcore1.0',
  'dotnetcore2.0',
  'dotnetcore2.1',
  'nodejs4.3-edge',
  'go1.x',
  'ruby2.5',
  'provided',
];

export interface IFunctionProps {
  app: Application;
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IFunctionState {
  existingFunctionNames: IFunctionByAccount[];
  accounts: IAccount[];
}

export class FunctionBasicInformation extends React.Component<IFunctionProps, IFunctionState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  public state: IFunctionState = {
    accounts: [],
    existingFunctionNames: [],
  };

  constructor(props: IFunctionProps) {
    super(props);

    AccountService.listAccounts('aws').then((acc: IAccount) => {
      this.state.accounts = acc;
      this.state.existingFunctionNames = [];
    });
  }

  private props$ = new Subject<IFunctionProps>();
  private destroy$ = new Subject<void>();

  public validate(values: IAmazonFunctionUpsertCommand): FormikErrors<IAmazonFunctionUpsertCommand> {
    const errors = {} as any;
    return errors;
  }

  public componentDidUpdate() {
    this.props$.next(this.props);
  }

  public componentWillUnmount(): void {
    this.destroy$.next();
  }

  private handleFunctionNameChange = (value: string): void => {
    this.props.formik.setFieldValue('functionName', value);
    console.log('in handleFunctionNameChange ******* ');
    console.log(this.props.formik.values.functionName);
  };

  private handleRegionChange = (value: string): void => {
    this.props.formik.setFieldValue('region', value);
    console.log('region changed: ', value);
  };

  private handleRuntimeChange = (value: string): void => {
    this.props.formik.setFieldValue('runtime', value);
    console.log('runtime changed: ', value);
  };

  private handleS3BucketChange = (value: string): void => {
    this.props.formik.setFieldValue('s3bucket', value);
    console.log('s3 bucket changed: ', value);
  };

  private handleS3FunctionFileChange = (value: string): void => {
    this.props.formik.setFieldValue('s3key', value);
    console.log('s3 key changed: ', value);
  };

  private handleHandlerChange = (value: string): void => {
    this.props.formik.setFieldValue('handler', value);
    console.log('handler changed: ', value);
  };

  private handleAccountChange = (value: string): void => {
    this.props.formik.setFieldValue('credentials', value);
    console.log('Account changed: ', value);
  };

  public render() {
    const { app } = this.props;
    const { errors, values } = this.props.formik;

    const className = classNames({
      'col-md-12': true,
      well: true,
      'alert-danger': errors.name,
      'alert-info': !errors.name,
    });

    const { accounts } = this.state;

    return (
      <div className="container-fluid form-horizontal">
        <div className="modal-body">
          <div className="form-group">
            <div className="sp-margin-m-bottom">
              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  Account
                  <HelpField id="aws.function.name" />
                  <ReactSelectInput
                    inputClassName="cloudfoundry-react-select"
                    stringOptions={accounts.map((acc: IAccount) => acc.name)}
                    clearable={true}
                    value={values.credentials}
                    onChange={(evt: any) => this.handleAccountChange(evt.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  Function Name
                  <HelpField id="aws.function.name" />
                  <TextInput
                    type="text"
                    className={`form-control input-sm no-spel ${errors.functionName ? 'invalid' : ''}`}
                    name="name"
                    value={values.functionName}
                    onChange={(evt: any) => this.handleFunctionNameChange(evt.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  Region
                  <HelpField id="aws.function.region" />
                  <TextInput
                    type="text"
                    className="form-control"
                    name="region"
                    value={values.region}
                    onChange={(evt: any) => this.handleRegionChange(evt.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  Runtime
                  <HelpField id="aws.function.runtime" />
                  <ReactSelectInput
                    inputClassName="aws-react-select"
                    stringOptions={availableRuntimes}
                    clearable={false}
                    value={values.runtime}
                    onChange={(evt: any) => this.handleRuntimeChange(evt.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  S3 Bucket
                  <HelpField id="aws.function.region" />
                  <TextInput
                    type="text"
                    className="form-control"
                    name="s3Bucket"
                    value={values.s3bucket}
                    onChange={(evt: any) => this.handleS3BucketChange(evt.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  S3 Function File
                  <HelpField id="aws.function.region" />
                  <TextInput
                    type="text"
                    className="form-control"
                    name="s3FunctionFile"
                    value={values.s3key}
                    onChange={(evt: any) => this.handleS3FunctionFileChange(evt.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="scol-md-3 sm-label-left">
                  Lambda Handler
                  <HelpField id="aws.function.region" />
                  <TextInput
                    type="text"
                    className="form-control"
                    name="handler"
                    value={values.handler}
                    onChange={(evt: any) => this.handleHandlerChange(evt.target.value)}
                  />
                </div>
              </div>

              {/* {accounts && (
            <div className="sp-margin-m-bottom">
              <FormikFormField
                name="Region"
                label="Region"
                help={<HelpField id="aws.function.region" />}
                input={props => (
                  <TextInput {...props} 
                    type="text" 
                    className="form-control input-sm no-spel" 
                    name="name" 
                    value={values.region}
                    />
                )}
                onChange={(evt: any) => this.handleRegionChange(evt.target.value)}
              />
            </div>)}
          
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="Runtime"
              label="Runtime"
              help={<HelpField id="aws.function.runtime" />}
              fastField={false}
              input={props => (
                <ReactSelectInput
                  inputClassName="cloudfoundry-react-select"
                  {...props}
                  stringOptions={availableRuntimes}
                  clearable={false}
                />
              )}
              onChange={(evt: any) => this.handleRuntimeChange(evt.target.value)}
              required={true}
            />
          </div>

          <FormikFormField
              name="s3bucket"
              label="S3 Bucket"
              help={<HelpField id="aws.function.name" />}
              input={() => (
                <TextInput
                type="text"
                className="form-control"
                name="s3bucket"
                value={values.s3bucket}
                //onChange={(evt: any) => this.handleFunctionNameChange(evt.target.value)}
              />
              )}
              onChange={(evt: any) => this.handleFunctionNameChange(evt.target.value)}
              required={true}
            />

            <FormikFormField
              name="s3FunctionFile"
              label="S3 Function File"
              help={<HelpField id="aws.function.name" />}
              input={() => (
                <TextInput
                type="text"
                className="form-control"
                name="s3functionfile"
                value={values.s3key}
                //onChange={(evt: any) => this.handleFunctionNameChange(evt.target.value)}
              />
              )}
              onChange={(evt: any) => this.handleS3FunctionFileChange(evt.target.value)}
              required={true}
            />

          <div className="sp-margin-m-bottom">
              <FormikFormField
                name="lambdaHandler"
                label="Lambda Handler"
                help={<HelpField id="aws.function.region" />}
                input={props => (
                  <TextInput {...props} 
                    type="text" 
                    className="form-control input-sm no-spel" 
                    name="handler" 
                    value={values.handler}
                  />
                )}
                onChange={(evt: any) => this.handleHandlerChange(evt.target.value)}
              />
            </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
