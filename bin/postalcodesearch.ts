#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PostalcodesearchStack } from "../lib/postalcodesearch-stack";

const app = new cdk.App();
new PostalcodesearchStack(app, "PostalcodesearchStack");
