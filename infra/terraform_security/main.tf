provider "aws" {

    #Set region if this is different
  region = "us-east-1"
}

#guard duty
resource "aws_guardduty_detector" "main" {
  enable = true
}

#WAF
resource "aws_wafv2_web_acl" "amplify_acl" {
  name        = "amplify-waf"
  description = "WAF for Amplify CloudFront"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "amplify-waf"
    sampled_requests_enabled   = true
  }

  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    override_action {
      none {}
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "common-rule"
      sampled_requests_enabled   = true
    }
  }
}


data "aws_amplify_app" "app" {
    #Enter aomplify id
  app_id = "<YOUR_AMPLIFY_APP_ID>"
}
