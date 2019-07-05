import * as React from 'react';

import { FunctionLists } from 'core/function/functionlist';

export class FunctionImport extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div>
        <h1>functions</h1>
      </div>
    );
  }
}

// class Contentold extends React.Component<{}, IContentState> {

//       const [functions, setFunctions] = React.useState([]);

//       componentDidMount() {
//         fetch('https://cynhong.mockit.io/functions')
//         .then(res => res.json())
//         .then((data) => {
//           this.setState({ functions: data })
//         })
//         .catch(console.log)
//       }
//     render() {
//       return (
//          // <FunctionLists functions={this.state.functions} />
//          <p>Some content</p>

//       );
//    }
// }

const Content: React.FC = () => {
  const [functions, setFunctions] = React.useState([]);

  React.useEffect(() => {
    //similar to componentDidMount
    fetch('ghghj')
      // .then(res => res.json())
      .then(data => {
        console.log(data);
        setFunctions(data);
      })
      .catch(console.log);
  });

  return <FunctionLists functions={functions} />;
};

const fetch = async (url: String) => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        account: 'mylambda',
        codeSha256: 'rHHd9Lk3j7h6MMZKqb3lQzAHKO1eWrmW8Wh/QP1+KuE=',
        codeSize: 7011514,
        description: 'sample',
        eventSourceMappings: [],
        functionArn: 'arn:aws:lambda:us-west-2:<acctno>:function:mylambdafunctiontwo',
        functionName: 'mylambdafunctiontwo',
        functionname: 'aws:lambdaFunctions:mylambda:us-west-2:mylambdafunctiontwo',
        handler: 'lambda_function.lambda_handler',
        lastModified: '2019-03-29T15:52:33.054+0000',
        layers: [],
        memorySize: 512,
        region: 'us-west-2',
        revisionId: '58cb0acc-4a20-4e57-b935-cc97ae1769fd',
        revisions: {
          '58cb0acc-4a20-4e57-b935-cc97ae1769fd': '$LATEST',
          'ee17b471-d6e3-47a3-9e7b-8cae9b92c626': '2',
        },
        role: 'arn:aws:iam::<acctno>:role/service-role/test',
        runtime: 'python3.6',
        timeout: 60,
        tracingConfig: {
          mode: 'PassThrough',
        },
        version: '$LATEST',
      },
      {
        account: 'mylambda2',
        codeSha256: 'rHHd9Lk3j7h6MMZKqb3lQzAHKO1eWrmW8Wh/QP1+KuE=',
        codeSize: 7011514,
        description: 'sample',
        eventSourceMappings: [],
        functionArn: 'arn:aws:lambda:us-west-2:<acctno>:function:mylambdafunctionone',
        functionName: 'mylambdafunctionone',
        functionname: 'aws:lambdaFunctions:mylambda:us-west-2:mylambdafunctionone',
        handler: 'lambda_function.lambda_handler',
        lastModified: '2019-03-29T15:46:04.995+0000',
        layers: [],
        memorySize: 512,
        region: 'us-west-2',
        revisionId: '73e5500a-3751-4073-adc0-877dfc3c720d',
        revisions: {
          '1e280c63-1bcd-4840-92dc-bef5f1b46028': '1',
          '73e5500a-3751-4073-adc0-877dfc3c720d': '$LATEST',
        },
        role: 'arn:aws:iam::<acctno>:role/service-role/test',
        runtime: 'python3.6',
        timeout: 68,
        tracingConfig: {
          mode: 'PassThrough',
        },
        version: '$LATEST',
      },
      {
        account: 'mylambda',
        codeSha256: 'rHHd9Lk3j7h6MMZKqb3lQzAHKO1eWrmW8Wh/QP1+KuE=',
        codeSize: 7011514,
        description: 'sample',
        eventSourceMappings: [],
        functionArn: 'arn:aws:lambda:us-west-2:<acctno>:function:mylambdafunctiontwo',
        functionName: 'mylambdafunctiontwo',
        functionname: 'aws:lambdaFunctions:mylambda:us-west-2:mylambdafunctiontwo',
        handler: 'lambda_function.lambda_handler',
        lastModified: '2019-03-29T15:52:33.054+0000',
        layers: [],
        memorySize: 512,
        region: 'us-west-1',
        revisionId: '58cb0acc-4a20-4e57-b935-cc97ae1769fd',
        revisions: {
          '58cb0acc-4a20-4e57-b935-cc97ae1769fd': '$LATEST',
          'ee17b471-d6e3-47a3-9e7b-8cae9b92c626': '2',
        },
        role: 'arn:aws:iam::<acctno>:role/service-role/test',
        runtime: 'python3.6',
        timeout: 60,
        tracingConfig: {
          mode: 'PassThrough',
        },
        version: '$LATEST',
      },
    ]);
  });
};
