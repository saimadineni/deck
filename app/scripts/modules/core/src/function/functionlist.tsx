import * as React from 'react';

interface IFunctionListProps {
  functions: Array<Function>;
}

interface Function {
  account: String;
  codeSha256: String;
  codeSize: number;
  description: String;
  eventSourceMappings: Array<any>;
  functionArn: String;
  functionName: String;
  functionname: String;
  handler: String;
  lastModified: String;
  layers: Array<any>;
  memorySize: number;
  region: String;
  revisionId: String;
  revisions: any;
  role: String;
  runtime: String;
  timeout: number;
  tracingConfig: {
    mode: String;
  };
  version: String;
}

export const FunctionLists: React.FC<IFunctionListProps> = ({ functions }) => {
  return (
    <div>
      <h1>Function List by</h1>
      {functions.map(f => (
        <div>
          <div>
            <h5>{f.account}</h5>
            <h6>{f.functionName}</h6>
            <p>{f.region}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
