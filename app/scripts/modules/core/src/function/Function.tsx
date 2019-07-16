import * as React from 'react';
// import { UISref, UISrefActive } from '@uirouter/react';
import { Application } from 'core/application/application.model';
// import { CloudProviderRegistry } from 'core/cloudProvider';
// import { IFunctions, IServerGroup } from 'core/domain';
import { CreateFunctionButton } from 'core/function/CreateFunctionButton';
import { FunctionImport } from './functionImport';
// import { HealthCounts } from 'core/healthCounts/HealthCounts';
// import { EntityNotifications } from 'core/entityTag/notifications/EntityNotifications';

export interface IFunctionProps {
  app: Application;
}

interface IFunctionState {
  isFunctionShowing: boolean;
}

export class Function extends React.Component<IFunctionProps, IFunctionState> {
  // public static defaultProps: Partial<IFunctionProps> = {
  //   showServerGroups: true,
  //   showInstances: false,
  // };
  constructor(props: IFunctionProps) {
    super(props);

    this.state = {
      isFunctionShowing: false,
    };
  }
  public render(): React.ReactElement<Function> {
    // const { application, functions } = this.props;
    // const config = CloudProviderRegistry.getValue(functions.provider || functions.cloudProvider, 'functions');

    // const params = {
    //   application: application.name,
    //   region: functions.region,
    //   accountId: functions.account,
    //   name: functions.name,
    //   vpcId: functions.vpcId,
    //   provider: functions.cloudProvider,
    // };
    const params = {};

    return (
      // tslint:disable-next-line: ban-comma-operator
      <div className="main-content functions">
        <div className="header row header-clusters">
          <div className="col-lg-8 col-md-10">
            <button
              onClick={() => {
                this.setState(state => {
                  return { isFunctionShowing: !state.isFunctionShowing };
                });
              }}
            >
              list functions
            </button>
            {this.state.isFunctionShowing && <FunctionImport />}
            <FunctionImport />
          </div>
          <div className="col-lg-4 col-md-2">
            <div className="form-inline clearfix filters" />
            <div className="application-actions">
              <CreateFunctionButton app={this.props.app} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
