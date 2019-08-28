import * as React from 'react';
import { Option } from 'react-select';
import { IPromise } from 'angular';
import { Observable, Subject } from 'rxjs';
import { forOwn } from 'lodash';

import {
  Application,
  FormikFormField,
  IWizardPageComponent,
  IVpc,
  ISubnet,
  ISecurityGroup,
  HelpField,
  IAccount,
  IRegion,
  ISubnet,
  ReactSelectInput,
  TetheredSelect,
  SubnetReader,
  ISecurityGroupSummary,
  ISecurityGroupsByAccount,
  ISecurityGroup,
  ReactInjector,
  IReaderSecurityGroup,
  ISecurityGroupsByAccountSourceData,
} from '@spinnaker/core';
import { FormikErrors, FormikProps } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { VpcReader } from 'amazon/vpc';
import { SubnetSelectInput, SubnetSelectField } from 'amazon/subnet';

export interface ISubnetOption {
  subnetId: string;
  vpcId: string;
}

export interface INetworkProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  app: Application;
}

export interface INetworkState {
  vpcOptions: Array<{}>;
  accounts: IAccount[];
  regions: IRegion[];
  subnets: ISubnetOption[];
  securityGroups: ISecurityGroupsByAccountSourceData;
}

export class Network extends React.Component<INetworkProps, INetworkState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  constructor(props: INetworkProps) {
    super(props);
    this.getAllVpcs();
    // this.getAllSubnets();
  }

  public state: INetworkState = {
    vpcOptions: [],
    accounts: null,
    regions: [],
    subnets: [],
    securityGroups: null,
  };
  private props$ = new Subject<INetworkProps>();
  private destroy$ = new Subject<void>();

  private getAllVpcs(): void {
    VpcReader.listVpcs().then(Vpcs => {
      this.state.vpcOptions = Vpcs;
    });
  }
  // private getAllSubnets(): void {
  //   SubnetSelectInput.componentDidUpdate.then(Subnets => {
  //     this.state.subnetOptions = Subnets;
  //   });
  //   // console.log(this.state.subnetOptions);
  // }

  public validate(): FormikErrors<IAmazonFunctionUpsertCommand> {
    return {};
  }

  private getAvailableSubnets(): IPromise<ISubnet[]> {
    return SubnetReader.listSubnetsByProvider('aws');
  }

  private getAvailableSecurityGroups(): IPromise<ISecurityGroupsByAccountSourceData> {
    return ReactInjector.securityGroupReader.getAllSecurityGroups();
  }
  private makeSubnetOptions(availableSubnets: ISubnet[]): ISubnetOption[] {
    const subOptions: ISubnetOption[] = [];
    availableSubnets.forEach(s => {
      const opt: ISubnetOption = {
        subnetId: s.id,
        vpcId: s.vpcId,
      };
      subOptions.push(opt);
    });
    // we have to filter out any duplicate options
    const uniqueSubOptions = Array.from(new Set(subOptions.map(a => a.subnetId))).map(subnetId => {
      return subOptions.find(a => a.subnetId === subnetId);
    });
    return uniqueSubOptions;
  }

  public componentDidUpdate() {
    this.props$.next(this.props);
  }

  public componentWillUnmount(): void {
    this.destroy$.next();
  }

  public componentDidMount(): void {
    const subnets$ = Promise.resolve(this.getAvailableSubnets())
      .then((subnets: ISubnet[]) => {
        subnets.forEach((subnet: ISubnet) => {
          subnet.label = subnet.id;
          subnet.deprecated = !!subnet.deprecated;
          if (subnet.deprecated) {
            subnet.label += ' (deprecated)';
          }
        });
        return subnets.filter(s => s.label);
      })
      .then((subnets: ISubnet[]) => {
        return this.makeSubnetOptions(subnets);
      });

    const secGroups$ = Promise.resolve(this.getAvailableSecurityGroups());
    Observable.combineLatest(subnets$, secGroups$)
      .takeUntil(this.destroy$)
      .subscribe(([subnets, securityGroups]) => {
        return this.setState({ subnets, securityGroups });
      });
  }

  private handleSubnetUpdate = (options: Array<Option<string>>) => {
    const subnetsSelected = options.map(o => o.value);
    this.props.formik.setFieldValue('vpcConfig.subnetIds', subnetsSelected);
  };

  private handleSecurityGroupsUpdate = (options: Array<Option<string>>) => {
    const sgSelected = options.map(o => o.value);
    this.props.formik.setFieldValue('vpcConfig.securityGroupIds', sgSelected);
  };

  private handleVpcChange = (vpcId: string): void => {
    this.props.formik.setFieldValue('vpcConfig.vpcId', vpcId);
    const { subnets } = this.state;
    const subs = subnets.filter(function(s: ISubnetOption) {
      return s.vpcId.includes(vpcId);
    });
    // console.log('%%%%%%%%%%: subnets: ', subs);
    this.setState({ subnets: subs });
  };

  private toSubnetOption = (value: ISubnetOption): Option<string> => {
    return { value: value.subnetId, label: value.subnetId };
  };

  private getSecurityGroupsByVpc = (sgs: ISecurityGroupsByAccountSourceData): Option<string>[] => {
    const { values } = this.props.formik;
    const sgOptions: Option<string>[] = [];
    forOwn(sgs, function(sgByAccount, acc) {
      if (acc === values.credentials) {
        forOwn(sgByAccount, function(sgByRegion, provider) {
          if (provider === 'aws') {
            forOwn(sgByRegion, function(groups, region) {
              if (region === values.region) {
                groups.forEach(function(group) {
                  if (group.vpcId === values.vpcConfig.vpcId) {
                    sgOptions.push({ value: group.id, label: group.name });
                  }
                });
              }
            });
          }
        });
      }
    });
    // console.log(' %%%%%%%%%%%%%%%%%%%%% ', sgOptions);
    return sgOptions;
  };

  public render() {
    const { vpcOptions, subnets, securityGroups } = this.state;
    const { values } = this.props.formik;
    const subnetOptions = (subnets || []).map(this.toSubnetOption);
    // console.log('securityGroupoptions: ', securityGroups ? securityGroups : 'NOT YET');
    const sgOptions = securityGroups ? this.getSecurityGroupsByVpc(securityGroups) : [];
    // console.log('securityGroupoptions: ', sgOptions);
    // console.log('**********vpcOptions: ', vpcOptions);
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            {values.credentials && (
              <FormikFormField
                name="vpcConfig.vpcId"
                label="VPC Id"
                help={<HelpField id="aws.function.vpc.id" />}
                fastField={false}
                input={props => (
                  <ReactSelectInput
                    inputClassName="cloudfoundry-react-select"
                    {...props}
                    stringOptions={vpcOptions
                      .filter((v: IVpc) => v.account === values.credentials)
                      .map((v: IVpc) => v.id)}
                    clearable={true}
                    value={values.vpcConfig.vpcId}
                  />
                )}
                onChange={this.handleVpcChange}
                required={false}
              />
            )}
          </div>
          <div className="form-group">
            <div className="col-md-4 sm-label-right">
              <b>Subnets </b>
              <HelpField id="aws.function.subnet" />
            </div>
            <div className="col-md-7">
              {subnetOptions.length === 0 && (
                <div className="form-control-static">No subnets found in the selected account/region/VPC</div>
              )}
              {values.vpcConfig.vpcId ? (
                <TetheredSelect
                  multi={true}
                  options={subnetOptions}
                  value={values.vpcConfig.subnetIds}
                  onChange={this.handleSubnetUpdate}
                />
              ) : null}
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-4 sm-label-right">
              <b>Security Groups </b>
              <HelpField id="aws.function.subnet" />
            </div>
            <div className="col-md-7">
              {sgOptions.length === 0 && (
                <div className="form-control-static">No security groups found in the selected account/region/VPC</div>
              )}
              {values.credentials && values.credentials !== 'test' && values.vpcConfig.vpcId ? (
                <TetheredSelect
                  multi={true}
                  options={sgOptions}
                  value={values.vpcConfig.securityGroupIds}
                  onChange={this.handleSecurityGroupsUpdate}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}