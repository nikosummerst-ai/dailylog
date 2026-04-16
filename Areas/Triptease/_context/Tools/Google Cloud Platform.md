---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Google Cloud Platform

## What It Does
Google's cloud infrastructure platform for compute, storage, and managed services.

## How We Use It
- Cloud Run for serverless container deployments
- Kubernetes for orchestrated workloads
- Artifact Registry for container image storage
- IAM managed via [[Terraform]] for access control

## Access
- Console: https://console.cloud.google.com (Triptease GCP project)

## Used By
- Engineering — primary cloud platform used across multiple squads

## Notes
- Primary cloud platform alongside [[AWS S3]] for object storage
- IAM roles and infrastructure managed as code via [[Terraform]]
- Cloud Run preferred for serverless container workloads
