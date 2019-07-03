import { ILoadBalancerModalProps } from '@spinnaker/core';

import { IAmazonLoadBalancerUpsertCommand } from '../../../amazon/src/domain';
import { CreateLambdaFunction } from '../../../amazon/src/function/CreateLambdaFunction';
export interface ICloseableLoadBalancerModal extends React.ComponentClass<ILoadBalancerModalProps> {
  show: (props: ILoadBalancerModalProps) => Promise<IAmazonLoadBalancerUpsertCommand>;
}

export interface IAmazonLoadBalancerConfig {
  type: string;
  label: string;
  sublabel: string;
  description: string;
  component: ICloseableLoadBalancerModal;
}

export const LoadBalancerTypes: IAmazonLoadBalancerConfig[] = [
  {
    type: 'aws',
    label: 'AWS',
    sublabel: 'Lambda',
    description: 'Highly configurable, application-focused balancer. HTTP and HTTPS only.',
    component: CreateLambdaFunction,
  },
  {
    type: 'something',
    label: 'Another Provider',
    sublabel: 'Gamma',
    description: '',
    component: CreateLambdaFunction,
  },
];
