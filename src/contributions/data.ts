import * as vscode from "vscode";
import { PM2 } from "../model";

export const registerData = (pm2: PM2) => {
    vscode.window.registerTreeDataProvider("pm2-processes", pm2);
};
