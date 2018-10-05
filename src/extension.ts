"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { PM2, Process } from "./pm2";

let pm2: PM2;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    pm2 = new PM2(context);

    vscode.window.registerTreeDataProvider("pm2-processes", pm2);

    vscode.commands.registerCommand("pm2.reload", (item: Process) => {
        pm2.reload(item.process);
    });

    vscode.commands.registerCommand("pm2.logs", (item: Process) => {
        pm2.logs(item.process);
    });

    vscode.commands.registerCommand("pm2.start", (item: Process) => {
        item.start();
    });

    vscode.commands.registerCommand("pm2.stop", (item: Process) => {
        item.stop();
    });

    vscode.commands.registerCommand("pm2.logsAll", () => {
        pm2.logs();
    });

    vscode.commands.registerCommand("pm2.startAll", () => {
        pm2.startAll();
    });

    vscode.commands.registerCommand("pm2.stopAll", () => {
        pm2.stopAll();
    });

    vscode.commands.registerCommand("pm2.reloadAll", () => {
        pm2.reloadAll();
    });

    vscode.commands.registerCommand("pm2.refresh", () => {
        pm2.refresh();
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    pm2.dispose();
}
