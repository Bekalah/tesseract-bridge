# Fly.io Deployment Notes (Manual, Offline-First Prep)

Keep deployments intentional and human-driven. These steps assume you already
tested the API locally with `npm start`.

## 1. Install tooling locally
- Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) on your own
  workstation. Do not automate or script installs inside this repository.
- Log in from your machine with `flyctl auth login` when you are ready to
deploy.

## 2. First-time setup
- From the project root run `flyctl launch --no-deploy` and answer the prompts.
  - Use an app name that reflects your environment (e.g., `tesseract-bridge`).
  - Select the `fly.toml` in this repo when asked; it builds the Node API
    Docker image.
  - Decline volume creation and builders; the service is stateless JSON.
- Commit the generated secrets locally if any were created, but do not push
  them to version control.

## 3. Deployment
- Ensure the local files match the desired release. Re-run `npm start` in one
  terminal and use `curl` or your preferred HTTP client to confirm `/registry`
  and `/sync` respond as expected.
- Deploy with `flyctl deploy --config fly.toml`.
- After deployment finishes, use `flyctl status` to confirm the static machine is
  healthy.

## 4. Rollback or updates
- For updates, repeat the local verification and run `flyctl deploy` again.
- To rollback, redeploy the previous git tag from your local machine. Fly keeps
  release history so you can target earlier versions.

## ND-safe reminders
- Keep data calm and layered; no surprise schema changes without updating the
  registry manifest and docs.
- Maintain parity between local file data and the hosted API responses so
  sensory expectations remain stable.
