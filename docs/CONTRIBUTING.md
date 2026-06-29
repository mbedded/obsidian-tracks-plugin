# Contributing

Thank you for your contribution!
This guide helps you to get an overview of the contribution process
and how to contribute to this project.

## Check before doing anything

Is there already an issue or Pull-Request (PR) existing?
Maybe the issue is fixed but not merged (and published) yet.
If you think that some details are missing, please comment on the issue or the PR. 
If it's missing: Create an issue and describe the fix or feature.

We want to avoid duplicates and keep the issues as clean as possible.

## Getting Started

- Fork and clone the repository.
- Commit your fixes.
- Push the changes and create a PR.
- Use a meaningful title for the PR like `fix: handle case XY when doing TASK`.
  Please ensure that the origin (issue) is linked like in the following screenshot.
![Example screenshot of contribution](/docs/img/contribute_example_pr.png)
- If you want to add additional information or questions about your PR, feel free to add them.

Additional information can be found in the GitHub-Guide: 
[Contributing to a project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)

## Commit Guidelines

This repo uses [Conventional Commits](https://www.conventionalcommits.org/).
Commit message should be structured as follows:

```
feat: Add button to delete user
fix: Handle NULL error when deleting user
```

To make the commit history more readable, try to keep the commit messages concise and focused on the changes made.
If a commit introduces multiple changes, consider breaking it down into smaller commits that each address a specific aspect of the change.

## Issue and Pull Request Guidelines

Before opening a new issue:

- Search first: check existing issues/PRs (open and closed) to avoid duplicates.
- One topic per issue: if you have multiple unrelated problems, open separate issues.
- Provide enough context so others can reproduce and fix it.

Before opening a PR:

- Prefer creating/linking an issue first for non-trivial changes.
- Keep PRs small and focused (one feature/fix per PR).
- Avoid unrelated refactors, formatting, or drive-by changes unless agreed upon.

> [!NOTE]
> Minor issues and trivial changes like fixing typos or adding translations
> can be pushed directly via a PR without creating an issue first.
