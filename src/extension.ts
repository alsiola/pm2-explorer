import * as vscode from "vscode";
import { registerCommands } from "./contributions/commands";
import { registerData } from "./contributions/data";
import { PM2 } from "./model";

let pm2: PM2;

export function activate(context: vscode.ExtensionContext) {
    const settings = vscode.workspace.getConfiguration("pm2Explorer");
    pm2 = new PM2(context, settings);

    registerCommands(pm2);
    registerData(pm2);
}

export function deactivate() {
    pm2.dispose();
}
