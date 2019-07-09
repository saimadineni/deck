import * as React from 'react';
import { IPromise } from 'angular';
import {
  Application,
  FormikFormField,
  IWizardPageComponent,
  IVpc,
  HelpField,
  TextInput,
  ReactSelectInput,
} from '@spinnaker/core';

import { FormikProps, Field } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';
import { VpcReader } from 'amazon/vpc';

export interface INetworkProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  roleName: string;
  app: Application;
  functionDef: IAmazonFunction;
}

export interface INetworkState {
  vpcOptions: Array<{}>;
}

export class Network extends React.Component<INetworkProps, INetworkState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  constructor(props: INetworkProps) {
    super(props);
    this.getAllVpcs();
  }

  public state: INetworkState = {
    vpcOptions: [],
  };
  private getAllVpcs(): void {
    VpcReader.listVpcs().then(Vpcs => {
      this.state.vpcOptions = Vpcs;
      console.log(Vpcs);
    });
  }

  public render() {
    const { vpcOptions } = this.state;
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="VPC"
              label="VPC"
              help={<HelpField id="aws.function.execution.role" />}
              fastField={false}
              input={props => (
                <ReactSelectInput
                  inputClassName="cloudfoundry-react-select"
                  {...props}
                  stringOptions={vpcOptions.map((v: IVpc) => v.name + ' | ' + v.id)}
                  clearable={false}
                />
              )}
              //onChange={this.accountChanged}
              required={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
