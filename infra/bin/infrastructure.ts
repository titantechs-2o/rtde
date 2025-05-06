#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RealtimeDocStack } from '../lib/appsync-stack';

const app = new cdk.App();
// Only two arguments—that matches your current constructor signature:
new RealtimeDocStack(app, 'RealtimeDocStack');