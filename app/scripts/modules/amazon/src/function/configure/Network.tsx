import * as React from 'react';
import { IPromise } from 'angular';
import {
  Application,
  FormikFormField,
  IWizardPageComponent,
  IVpc,
  ISubnet, // adding this because there is an IVpc, might remove later
  ISecurityGroup, // adding this because there is an IVpc, might remove later
  HelpField,
  TextInput,
  ReactSelectInput,
} from '@spinnaker/core';

import { FormikErrors, FormikProps, Field } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction, ITargetTrackingConfiguration } from 'amazon/domain';
import { VpcReader } from 'amazon/vpc';
import { SubnetSelectField } from 'amazon/subnet';

export interface INetworkProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  app: Application;
}

export interface INetworkState {
  vpcOptions: Array<{}>;
  account: {};
}

export class Network extends React.Component<INetworkProps, INetworkState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  constructor(props: INetworkProps) {
    super(props);
    this.getAllVpcs();
  }

  public state: INetworkState = {
    vpcOptions: [],
    account: null,
  };
  private getAllVpcs(): void {
    VpcReader.listVpcs().then(Vpcs => {
      this.state.vpcOptions = Vpcs;
    });
    // console.log(this.state.vpcOptions);
  }
  public validate(): FormikErrors<IAmazonFunctionUpsertCommand> {
    return {};
  }

  public render() {
    const { vpcOptions, account } = this.state;
    const { errors, values } = this.props.formik;

    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            {values.credentials && (
              <FormikFormField
                name="vpcId"
                label="VPC Id"
                help={<HelpField id="aws.function.execution.role" />}
                fastField={false}
                input={props => (
                  <ReactSelectInput
                    inputClassName="cloudfoundry-react-select"
                    {...props}
                    stringOptions={vpcOptions
                      .filter((v: IVpc) => v.account === values.credentials)
                      .map((v: IVpc) => v.name + ' (' + v.id + ')')}
                    clearable={false}
                  />
                )}
                // onChange={this.accountChanged}
                required={false}
              />
            )}
          </div>
          <div className="sp-margin-m-bottom">
            {values.credentials && (
              <FormikFormField
                name="subnetId"
                label="Subnet Id"
                help={<HelpField id="aws.function.execution.role" />}
                fastField={false}
                input={props => (
                  <ReactSelectInput
                    inputClassName="cloudfoundry-react-select"
                    {...props}
                    stringOptions={vpcOptions
                      .filter((v: IVpc) => v.account === values.credentials)
                      .map((v: IVpc) => v.name + ' (' + v.id + ')')}
                    clearable={false}
                  />
                )}
                // onChange={this.accountChanged} Don't need this because we are using a Formik field
                required={false}
              />
            )}
          </div>
          <div className="sp-margin-m-bottom">
            {values.credentials && (
              <FormikFormField
                name="securityGroupId"
                label="Security Group Id"
                help={<HelpField id="aws.function.execution.role" />}
                fastField={false}
                input={props => (
                  <ReactSelectInput
                    inputClassName="cloudfoundry-react-select"
                    {...props}
                    stringOptions={vpcOptions
                      .filter((v: IVpc) => v.account === values.credentials)
                      .map((v: IVpc) => v.name + ' (' + v.id + ')')}
                    clearable={false}
                  />
                )}
                // onChange={this.accountChanged} Don't need this because we are using a Formik field
                required={false}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
