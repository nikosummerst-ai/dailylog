---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Terraform

## What It Does
Infrastructure as Code (IaC) tool for provisioning and managing cloud infrastructure.

## How We Use It
- Engineering manages [[Google Cloud Platform]] IAM roles and infrastructure as code
- Infrastructure changes reviewed and applied via Terraform plans

## Access
- CLI tool used locally and in [[GitHub Actions]] pipelines

## Used By
- Engineering — IaC for GCP infrastructure and IAM management

## Notes
- Primary use case is GCP IAM role management
- Infrastructure changes tracked in version control like code
