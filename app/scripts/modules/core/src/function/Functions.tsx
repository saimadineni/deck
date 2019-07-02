import * as React from 'react';
import { UISref, UISrefActive } from '@uirouter/react';

import { Application } from 'core/application/application.model';
import { CloudProviderRegistry } from 'core/cloudProvider';
import { IFunctions, IServerGroup } from 'core/domain';

// import { HealthCounts } from 'core/healthCounts/HealthCounts';
import { EntityNotifications } from 'core/entityTag/notifications/EntityNotifications';

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
      <div className="pod-subgroup">
        <div className="sticky-header-2">Functions is kinda working !</div>
      </div>
    );
  }
}
