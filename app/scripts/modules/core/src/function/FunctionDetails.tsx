import * as React from 'react';
import { Overridable, IOverridableProps } from 'core/overrideRegistry';
// import { FirewallLabels } from 'core/securityGroup/label/FirewallLabels';

export interface ISecurityGroupDetailsProps extends IOverridableProps {}

@Overridable('functions.details')
export class FunctionDetails extends React.Component<ISecurityGroupDetailsProps> {
  public render() {
    // return <h3>{FirewallLabels.get('Firewalls')} Details</h3>;
    return <h3> Hello Man</h3>;
  }
}
