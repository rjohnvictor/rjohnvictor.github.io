This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Profile README Sync

This repository is the source of truth for profile README content and layout.

### Source of truth

- Content: `messages/en.json` and `src/data/portfolio/**`
- Layout template: `templates/github-readme.template.md`
- Generator: `scripts/generate-github-readme.mjs`
- Generated output: `GITHUB_README.md`

### Local commands

```bash
npm run generate:github-readme
npm run check:github-readme
```

### Portfolio repo automation

Workflow: `.github/workflows/generate-github-readme.yml`

- Regenerates `GITHUB_README.md` when source content or template changes
- Commits generated output on `main`
- Validates no drift on pull requests

### Profile repo automation (pull-based + PR review)

In profile repository `rjohnvictor/rjohnvictor`, create:

`.github/workflows/sync-from-portfolio-pr.yml`

```yaml
name: Sync README from Portfolio (PR)

on:
	workflow_dispatch:
	schedule:
		- cron: "*/30 * * * *"

permissions:
	contents: write
	pull-requests: write

jobs:
	sync:
		runs-on: ubuntu-latest
		steps:
			- name: Checkout profile repo
				uses: actions/checkout@v4

			- name: Download generated README from portfolio
				run: |
					curl -fsSL https://raw.githubusercontent.com/rjohnvictor/rjohnvictor.github.io/main/GITHUB_README.md -o README.md.new

			- name: Update file when changed
				run: |
					if cmp -s README.md.new README.md; then
						echo "changed=false" >> $GITHUB_ENV
						rm README.md.new
						exit 0
					fi
					mv README.md.new README.md
					echo "changed=true" >> $GITHUB_ENV

			- name: Create PR
				if: env.changed == 'true'
				uses: peter-evans/create-pull-request@v6
				with:
					commit-message: "chore: sync profile README from portfolio"
					title: "chore: sync profile README from portfolio"
					body: "Automated pull-based sync from portfolio generated README."
					branch: chore/sync-profile-readme
					delete-branch: true
```

### Portfolio-triggered PR option

This repo can also open a PR directly in the profile repo when `GITHUB_README.md` changes:

- `.github/workflows/create-profile-readme-pr.yml`

This path still uses `PROFILE_REPO_PAT` because it writes to another repository.
