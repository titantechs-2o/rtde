# Security Overview

## AWS WAF

- AWS WAF is used to protect the application's public endpoints from common web exploits and malicious traffic. It is attached to the CloudFront distribution serving the app, allowing for custom rules that address threats specific to the app's authentication flows, APIs, and user interactions.
- WAF rules are maintained to block suspicious requests and enforce security policies relevant to the app's business logic and user data.

## AWS GuardDuty

- GuardDuty continuously monitors AWS resources supporting the application, including backend services, APIs, and data stores, for signs of unauthorized access, reconnaissance, or other threats.
- Findings from GuardDuty are reviewed to detect and respond to suspicious activity that could impact the application's security or data integrity.

## AWS Shield

- AWS Shield Standard provides automatic DDoS protection for the application's public endpoints, including those served via CloudFront and API Gateway.
- Shield Advanced, if enabled, offers additional detection and response capabilities for large-scale attacks targeting the application's availability.

## Application Security Practices

- Authentication is enforced using Amazon Cognito, ensuring only authorized users can access protected features and data.
- API and data access are restricted by user authentication and fine-grained authorization rules, minimizing exposure of sensitive operations.

## Security Operations

- Security controls are managed at the AWS infrastructure level and are regularly reviewed to ensure they address the evolving threat landscape for the application.
- The team monitors alerts and findings from AWS security services and updates policies and rules as needed to maintain a strong security posture for the application.

## Security Management

- All WAF, GuardDuty, and Shield configurations are managed outside of this codebase, either manually in the AWS Console or through infrastructure-as-code tools.
- This repository does not contain or deploy any WAF, GuardDuty, or Shield configuration. Security controls must be reviewed and updated by the project team as part of AWS account management.

## Project Team Actions

- Ensure a WAF Web ACL is associated with the app's CloudFront distribution and rules are kept up to date for this app's needs.
- Monitor GuardDuty findings for activity related to this app's AWS resources.
- Confirm Shield protections are active for all public endpoints used by this app.
- Review IAM permissions and keep dependencies updated to minimize risk.

## Manual vs. Code-based Security

- WAF, GuardDuty, and Shield are managed outside of this codebase, either manually in the AWS Console or via infrastructure-as-code (CDK, CloudFormation, Terraform).
- This repository does not directly configure or deploy these services.
- Security best practices and configuration steps should be documented and reviewed regularly.

## Recommendations

- Regularly review and update WAF rules.
- Monitor GuardDuty findings and respond to threats.
- Consider Shield Advanced for critical production workloads.
- Keep dependencies up to date and review IAM permissions for least privilege.
