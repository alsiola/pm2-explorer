![Build Status](https://travis-ci.com/alsiola/pm2-explorer.svg?branch=master)

# PM2 Explorer README

View and interact with currently running PM2 processes within VSCode.  This extension can be installed from within VSCode by searching for `pm2` in the extensions view, or via the [https://marketplace.visualstudio.com/items?itemName=alex-young.pm2-explorer](Visual Studio Marketplace).

## Features

Adds a PM2 Explorer view that lists current PM2 processes and important details about them. The list is continously updated at a configurable interval (default 1000ms).

Allows interaction with individual running processes: 

 * Start
 * Stop
 * Restart
 * View Logs (in integrated terminal)

And with *all* running processes:

 * Reload all
 * View all logs
 * Start all processes
 * Stop all processes

## Requirements

PM2 should be installed globally on your machine.

## Extension Settings

 The following configuration settings are provided by PM2 explorer:

```
// How frequently (in milliseconds) should the process list update
"pm2Explorer.refreshIntervalMs": 1000
```

## Known Issues

No known issues

## Release Notes
### 0.0.4
Improved process icons
Configurable refresh interval
Added start all and stop all commands

### 0.0.3

Visual representation of process state

### 0.0.2

Fix errors in readme
Add logo

### 0.0.1

Initial release of PM2 Explorer
