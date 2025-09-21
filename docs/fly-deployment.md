# Fly.io Deployment Notes (Manual, Offline-First Prep)

Keep deployments intentional and human-driven. These steps assume you already
inspected the renderer locally by double-clicking `index.html`.

## 1. Install tooling locally
- Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) on your own
  workstation. Do not automate or script installs inside this repository.
- Log in from your machine with `flyctl auth login` when you are ready to
deploy.

## 2. First-time setup
- From the project root run `flyctl launch --no-deploy` and answer the prompts.
  - Use an app name that reflects your environment (e.g., `tesseract-bridge`).
  - Select the `fly.toml` in this repo when asked; it already references the
    static layout.
  - Decline volume creation and builders; this site stays static.
- Commit the generated secrets locally if any were created, but do not push
  them to version control.

## 3. Deployment
- Ensure the local files match the desired release. Re-run the renderer locally
  to confirm palettes and geometry look correct.
- Deploy with `flyctl deploy --config fly.toml`.
- After deployment finishes, use `flyctl status` to confirm the static machine is
  healthy.

## 4. Rollback or updates
- For updates, repeat the local verification and run `flyctl deploy` again.
- To rollback, redeploy the previous git tag from your local machine. Fly keeps
  release history so you can target earlier versions.

## ND-safe reminders
- Keep assets calm and layered; no animation or auto-playing media.
- Never enable CDN transformations that could flatten or recolor the geometry.
- Maintain parity between the offline canvas and the hosted version so sensory
  expectations remain stable.
