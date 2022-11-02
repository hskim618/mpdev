import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';


export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // 아래 내용을 추가합니다
    const fn = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/')
    });
    
    
    // Agent Layer 추가
    const agentArn = 'arn:aws:lambda:ap-northeast-1:800880067056:layer:CloudOne-ApplicationSecurity-nodejs14_x:1';
    const agentLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'TrendMicroAgent', agentArn);
    fn.addLayers(agentLayer)
    
    // 환경 변수 추가
    fn.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '/opt/trend_app_protect');
    fn.addEnvironment('TREND_AP_HELLO_URL', 'https://agents.jp-1.application.cloudone.trendmicro.com/');
    fn.addEnvironment('TREND_AP_KEY', 'bedb1304-9176-4191-97d9-1972d4112303');
    fn.addEnvironment('TREND_AP_SECRET', 'aef3dc4a-07b7-4a50-be8b-27a987ca8a0d');
    
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
