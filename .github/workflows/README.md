# CI/CD Workflow

This document explains our CI/CD process, how code gets tested, built, and deployed to production.

## Overview

We use GitHub Actions to automate our CI/CD pipeline. The workflow consists of three main jobs:

1. **Test**: Run all tests against the codebase
2. **Build**: Create a production build if tests pass
3. **Deploy**: Deploy the built application to our production server (only for the `deploy` branch)

## Workflow Diagram

[Code Push] → [Tests] → [Build] → [Deploy (deploy branch only)]

## Branch Strategy

- **Feature branches**: Used for development work
- **Main branch**: Integration branch, triggers tests and builds, but not deployment
- **Deploy branch**: Production deployment branch, triggers the full pipeline including deployment

## How to Deploy to Production

1. Ensure your changes are merged to `main` and working as expected
2. Merge `main` into the `deploy` branch:

   ```bash
   git checkout deploy
   git merge main
   git push
   ```

3. The GitHub Actions workflow will automatically:

- Run all tests
- Build the application
- Deploy the build to the EC2 production server

## Monitoring Deployments

1. You can monitor the deployment status in the GitHub Actions tab
2. The workflow will show as "in progress" while deploying
3. A green checkmark indicates successful deployment
4. You can click on the workflow run to see detailed logs

## Environment Variables and Secrets

The CI/CD pipeline uses several secrets stored in GitHub:

- `SSH_PRIVATE_KEY`: SSH key for accessing the EC2 instance
- `EC2_HOST`: Hostname/IP of the EC2 server
- `EC2_USERNAME`: Username for SSH access to EC2

These values are stored as GitHub repository secrets and should not be committed to code.

## Troubleshooting

Common Issues:

1. **Deployment failed**: Check the GitHub Actions logs for error messages
2. **Tests passing locally but failing in CI**: Ensure environment variables are properly set in the workflow

### Manual Deployment

In case you need to deploy manually:

1. Build the application locally: `npm run build`
2. Copy the build files to the server:

```bash
rsync -avz --delete dist/ username@hostname:~/tessera/dist/
rsync -avz package.json package-lock.json username@hostname:~/tessera/
```

3. Install dependencies and restart the application:

```bash
ssh username@hostname 'cd ~/tessera/ && npm ci --production && pm2 restart tessera || pm2 start npm --name "tessera" -- start'
```

## Making Changes to the CI/CD Pipeline

To modify the CI/CD workflow:

1. Edit the .github/workflows/ci-cd.yml file
2. Follow [GitHub Actions syntax documentation](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
3. Commit and push your changes to test the updated workflow
