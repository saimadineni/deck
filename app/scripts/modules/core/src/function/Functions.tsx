import * as React from 'react';
// import { UISref, UISrefActive } from '@uirouter/react';
// import { Application } from 'core/application/application.model';
// import { CloudProviderRegistry } from 'core/cloudProvider';
// import { IFunctions, IServerGroup } from 'core/domain';
import { CreateFunctionsButton } from 'core/function/CreateFunctionsButton';


// import { HealthCounts } from 'core/healthCounts/HealthCounts';
// import { EntityNotifications } from 'core/entityTag/notifications/EntityNotifications';

export interface IFunctionProps {
  // application: Application;
  // functions: IFunctions;
}

export class Functions extends React.Component<IFunctionProps> {
  // public static defaultProps: Partial<IFunctionProps> = {
  //   showServerGroups: true,
  //   showInstances: false,
  // };

  public render(): React.ReactElement<Functions> {
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
          <div className="col-lg-8 col-md-10">Testing</div>
          <div className="col-lg-4 col-md-2">
            <div className="form-inline clearfix filters" />
            <div className="application-actions">
              <CreateFunctionsButton app={this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
