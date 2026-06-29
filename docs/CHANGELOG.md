# Changelog

This document records changes, updates, fixes and improvements made to the project over time.
It serves as a reference for tracking version history and release details.

[See the latest release in GitHub.](https://github.com/mbedded/obsidian-web-task-dashboard/releases/latest)

## Version 1.x

### Upcoming

#### Features

- Add command: "Reload" to reload all contexts and tasks which refresh the dashboard.
- Add command: "Create new task" to create a new task via command line and dialog.
- Add "reload" button when the dashboard shows an error message.
- Improve error messages when service is not available or when no contexts exist.

### [1.0.1](https://github.com/mbedded/obsidian-web-task-dashboard/releases/tag/1.0.1)

- Minor code changes to satisfy Obsidian ESLint requirements for listing this plugin in the official plugin repository. 

### [1.0.0](https://github.com/mbedded/obsidian-web-task-dashboard/releases/tag/1.0.0)

#### Features

- Initial release of this plugin.
- Localization added for DE and EN.
- Basic functionality to show contexts and tasks. Tasks can be created, deleted and marked as done.
- **Only [Tracks](https://github.com/TracksApp/tracks) is currently supported.**

#### CI

- Setup of a CI pipeline using Github-Actions.
