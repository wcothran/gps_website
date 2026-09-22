# GPS Navigator Hub

Public support website for Teacher Navigator and Administrator Navigator. The next release runs as static HTML, CSS, JavaScript, and local pictures on GitHub Pages. Visitors need no website account. All 18 resources remain available.

The first review changes clarify Guides, Pathways, and Demos; reduce repeated Home entrances; make resource and Navigator cards full links; improve footer contrast; keep guides inside the Hub navigation; add subsection questions; and pair the ADA tour explanation with a numbered screenshot marker and an enlargement dialog. The stock collaboration photograph is credited as illustrative. It does not depict SCDE staff.

Feedback, assistance, and facilitated exploration use email drafts addressed to gps@ed.sc.gov. The website does not send or store those messages, generate receipts, or confirm bookings. The live Navigator systems retain their own access rules.

## Build and preview

Node 22 or later is sufficient. The static build and its tests require no package installation.

```sh
npm run build
npm test
npm run preview
```

Preview at http://127.0.0.1:4173/GPS_website/ to verify a GitHub project path. Publish only `dist/pages`. Three interactive downloads include embedded pictures for offline use; the other HTML guides are already standalone. Source pictures are stored locally, and guide Google Fonts requests have been removed.

## GitHub Pages publication

Destination repository: `SC-DEPARTMENT-OF-EDUCATION/GPS_website`. Its existing remote history is a separate initial README commit; do not force-push the older local pilot history over it. Add the reviewed source files to a checkout of the remote branch, preserving unrelated changes.

The included `.github/workflows/pages.yml` builds and tests on pushes to main, uploads only dist/pages, and deploys through the github-pages environment. Select GitHub Actions as the Pages source. Normal updates need no visitor authentication or server secrets.

On September 18, 2026, the signed-in repository Pages screen displayed “Upgrade or make this repository public to enable Pages.” The repository is private. Publication is pending Wyatt's decision about repository visibility or an upgraded plan. Making the repository public requires approval because it exposes its contents and history. The release ZIP contains only public website assets, not service state or private submissions.

After deployment, verify the published URL anonymously and through an agency or district network before sending reviewer invitations. Local testing does not establish network access.

## Preserved service history

`worker/`, `db/`, `drizzle/`, the earlier Worker tests, `.openai/hosting.json`, and `legacy/` preserve the previous Sites implementation. They are outside the static release and are not active dependencies of this website. Existing hosted database records have not been changed or removed. The archived Worker build is historical, not the public release command.

The original supplied ZIP and feedback DOCX have been preserved. See VERIFICATION.md for the scope of this release's checks.
