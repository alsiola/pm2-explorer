import * as vscode from "vscode";
import { PM2, Process } from "../model";

export const registerCommands = (pm2: PM2) => {
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

    vscode.commands.registerCommand("pm2.monit", () => {
        pm2.monit();
    });

    vscode.commands.registerCommand("pm2.flushLogs", () => {
        pm2.flushLogs();
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
};
