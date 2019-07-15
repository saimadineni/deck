import * as React from 'react';

import {
  FormikFormField,
  AccountService,
  IAccount,
  IRegion,
  IWizardPageComponent,
  HelpField,
  TextInput,
  ReactSelectInput,
  RegionSelectField,
} from '@spinnaker/core';

import { FormikProps, Field, FormikErrors } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';
import { FunctionReader, IFunctionByAccount } from 'core/function/function.read.service';
import { Subject, Observable } from 'rxjs';
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
  //existingFunctionNames: IFunctionByAccount[];
  accounts: IAccount[];
  regions: IRegion[];
}

export class FunctionBasicInformation extends React.Component<IFunctionProps, IFunctionState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  public state: IFunctionState = {
    accounts: [],
    //existingFunctionNames: [],
    regions: [],
  };

  constructor(props: IFunctionProps) {
    super(props);

    AccountService.listAccounts('aws').then((acc: IAccount) => {
      this.state.accounts = acc;
      //this.state.existingFunctionNames = [];
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

  /* ******** */
  public componentDidMount(): void {
    const formValues$ = this.props$.map(props => props.formik.values);
    const appName$ = this.props$.map(props => props.app.name).distinctUntilChanged();

    const form = {
      account$: formValues$.map(x => x.credentials).distinctUntilChanged(),
      region$: formValues$.map(x => x.region).distinctUntilChanged(),
      functionName$: formValues$.map(x => x.functionName).distinctUntilChanged(),
      runtime$: formValues$.map(x => x.runtime).distinctUntilChanged(),
      s3bucket$: formValues$.map(x => x.s3bucket).distinctUntilChanged(),
      s3key$: formValues$.map(x => x.s3key).distinctUntilChanged(),
      handler$: formValues$.map(x => x.handler).distinctUntilChanged(),
    };

    const allAccounts$ = Observable.fromPromise(AccountService.listAccounts('aws')).shareReplay(1);

    // combineLatest with allAccounts to wait for accounts to load and be cached
    const accountRegions$ = Observable.combineLatest(form.account$, allAccounts$)
      .switchMap(([currentAccount, _allAccounts]) => AccountService.getRegionsForAccount(currentAccount))
      .shareReplay(1);

    // const allFunctions$ = this.props.app.getDataSource('functions').data$ as Observable<IAmazonFunction[]>;
    // const regionfunctions$ = Observable.combineLatest(allFunctions$, form.account$, form.region$)
    // .map(([allFunctions, currentAccount, currentRegion]) => {
    //   return allFunctions
    //     .filter(fn => fn.account === currentAccount && fn.region === currentRegion)
    //     .map(fn => fn.functionName);
    // })
    // .shareReplay(1);

    accountRegions$
      .withLatestFrom(form.region$)
      .takeUntil(this.destroy$)
      .subscribe(([accountRegions, selectedRegion]) => {
        // If the selected region doesn't exist in the new list of regions (for a new acct), select the first region.
        if (!accountRegions.some(x => x.name === selectedRegion)) {
          this.props.formik.setFieldValue('region', accountRegions[0] && accountRegions[0].name);
        }
      });

    Observable.combineLatest(allAccounts$, accountRegions$)
      .takeUntil(this.destroy$)
      .subscribe(([accounts, regions]) => {
        return this.setState({ accounts, regions });
      });
  }
  /* ******** */

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
    const { accounts, regions } = this.state;

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
                  {/* Region
                  <HelpField id="aws.function.region" />
                  <TextInput
                    type="text"
                    className="form-control"
                    name="region"
                    value={values.region}
                    onChange={(evt: any) => this.handleRegionChange(evt.target.value)}
                  /> */}
                  <RegionSelectField
                    labelColumns={3}
                    component={values}
                    field="region"
                    account={values.credentials}
                    onChange={this.handleRegionChange}
                    regions={regions}
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
