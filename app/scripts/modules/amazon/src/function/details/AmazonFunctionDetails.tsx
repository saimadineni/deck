// import * as React from 'react';
// import { IOverridableProps, Overrides } from 'core/overrideRegistry';
// import {
//   Application,
//   ApplicationReader,
//   FunctionWriter,
//   SETTINGS,
//   NgReact,
//   ReactInjector,
//   HelpField,
// } from '@spinnaker/core';
// import { IAmazonFunction } from 'amazon/domain';
// import { IFunctionFromStateParams } from './functionDetails.controller';

// export interface IFunctionDetailsProps extends IOverridableProps {
//   app: Application;
//   functionDef: IAmazonFunction;
//   functionFromParams: IFunctionFromStateParams;
// }

// export interface IFunctionDetailsState {
//   application: Application;
// }

// @Overrides('function.details', 'aws')
// export class FunctionDetails extends React.Component<IFunctionDetailsProps> {
//   public render() {
//     return <h3>AWS hhhh Function Details</h3>;
//   }
// }

import * as React from 'react';
import { IOverridableProps, Overrides } from 'core/overrideRegistry';

import {
  Details,
  CollapsibleSection,
  IFunction,
  Application,
  AccountTag,
  FunctionReader,
  timestamp,
} from '@spinnaker/core';

import { IAmazonFunctionSourceData } from 'amazon/domain';
//import { FunctionActions } from './FunctionActions';
import { VpcTag } from 'amazon/vpc/VpcTag';

export interface IAmazonFunctionDetailsProps extends IOverridableProps {
  app: Application;
  func: IFunction;
}

@Overrides('function.details', 'aws')
export class AmazonFunctionDetails extends React.Component<IAmazonFunctionDetailsProps, any> {
  constructor(props: IAmazonFunctionDetailsProps) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  public extractFunction(): void {
    const { app, func: functionFromProps } = this.props;
    const func = app.functions.data.find((test: IFunction) => {
      return (
        test.name === functionFromProps.name &&
        test.region === functionFromProps.region &&
        test.account === functionFromProps.account
      );
    });

    if (func) {
      FunctionReader.getFunctionDetails(
        'aws',
        functionFromProps.account,
        functionFromProps.region,
        functionFromProps.name,
      ).then((details: IAmazonFunctionSourceData[]) => {
        if (details.length) {
          console.log('EXTRACT FUNCTION details: ', details);
          this.setState({
            functionDef: func,
            loading: false,
          });
        }
      });
    }
  }

  public componentDidMount(): void {
    const { app } = this.props;
    const dataSource = app.functions;
    dataSource.ready().then(() => {
      const dataSourceUnsubscribe = dataSource.onRefresh(null, () => this.extractFunction());
      this.setState({ dataSourceUnsubscribe });
      this.extractFunction();
    });
  }

  public componentWillUnmount() {
    this.state.dataSourceUnsubscribe && this.state.dataSourceUnsubscribe();
  }

  public render() {
    //const { app, func, functionFromParams } = this.props;
    const { loading, functionDef } = this.state;
    if (loading) {
      // Don't bother computing any children if we're loading
      return <Details loading={loading} />;
    }

    // const functionDetails = (
    //   <>
    //     <dl className="dl-horizontal dl-flex">
    //       <dt>Last Modified</dt>
    //       <dd>{timestamp(functionDef.lastModified)}</dd>
    //       <dt>In</dt>
    //       <dd>
    //         <AccountTag account={functionDef.account} /> {functionDef.region}
    //       </dd>
    //       <dt>VPC</dt>
    //       <dd>
    //         <VpcTag vpcId={functionDef.vpcId} />
    //       </dd>
    //       <dt>Function ARN</dt>
    //       <dd>
    //         {functionDef.functionArn} />
    //       </dd>
    //       <dt>Revision</dt>
    //       <dd>
    //         {functionDef.revisionId} />
    //       </dd>
    //     </dl>
    //   </>
    // );

    // const functionDetailsSection = (
    //   <CollapsibleSection heading="Function Details">{functionDetails}</CollapsibleSection>
    // );

    return (
      <Details loading={this.state.loading}>
        <Details.Header icon={<i className="fa icon-sitemap" />} name={this.state.functionDef.name}>
          <div className="actions">
            Hello 123
            {/*<FunctionActions app={app} functionDef={functionDef} functionFromParams={functionFromParams} />*/}
          </div>
        </Details.Header>
        {/*loadBalancer.entityTags && <ManagedResourceDetailsIndicator entityTags={loadBalancer.entityTags} />*/}
        {/*functionDetailsSection*/}
      </Details>
    );
  }
}
