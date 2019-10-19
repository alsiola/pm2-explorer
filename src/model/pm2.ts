import * as nodePm2 from "pm2";
import * as vscode from "vscode";
import * as util from "../util";
import { Process } from "./process";

export class PM2
    implements vscode.TreeDataProvider<vscode.TreeItem>, vscode.Disposable {
    private _onDidChangeTreeData: vscode.EventEmitter<
        Process | undefined
    > = new vscode.EventEmitter<Process | undefined>();

    readonly onDidChangeTreeData: vscode.Event<Process | undefined> = this
        ._onDidChangeTreeData.event;

    private _pm2!: Promise<typeof nodePm2>;
    private _processes: nodePm2.ProcessDescription[] = [];
    private _isRefreshing = false;
    private _isDisposed = false;

    constructor(
        private _context: vscode.ExtensionContext,
        private readonly _config: vscode.WorkspaceConfiguration
    ) {
        console.log("Initialising PM2");
        this._pm2 = new Promise(resolve => {
            nodePm2.connect(util.errCallback(
                () => {
                    this.setRefreshInterval();
                    resolve(nodePm2);
                },
                err => util.showErr("Could not connect to PM2")
            ) as any);
        });
    }

    private setRefreshInterval() {
        util.refresher({
            fn: () => {
                this._isRefreshing = true;
                this.listProcesses().then(() => {
                    this._isRefreshing = false;
                });
            },
            interval: () =>
                this._config.get<number>("refreshIntervalMs") || 1000,
            skipIf: () => this._isRefreshing || this._isDisposed
        })();
    }

    dispose() {
        this._isDisposed = true;
    }

    logs(process?: nodePm2.ProcessDescription) {
        const terminal = vscode.window.createTerminal("pm2");
        terminal.sendText(
            `pm2 logs '${process && process.name ? process.name : ""}'`
        );
        terminal.show();
    }

    reloadAll() {
        this._pm2.then(pm2 => {
            pm2.reload("all", util.errCallback());
        });
    }

    startAll() {
        this._pm2.then(pm2 => {
            pm2.start({}, util.errCallback());
        });
    }

    stopAll() {
        this._pm2.then(pm2 => {
            pm2.stop("all", util.errCallback());
        });
    }

    reload(process: nodePm2.ProcessDescription) {
        this._pm2.then(pm2 => {
            pm2.reload(
                process.name!,
                util.errCallback(() => {
                    util.showMsg(`Reloaded process ${process.name}`);
                })
            );
        });
    }

    listProcesses() {
        console.log("Retrieving PM2 processes");
        return this._pm2.then(pm2 => {
            return new Promise(resolve =>
                pm2.list(
                    util.errCallback(processes => {
                        resolve();
                        console.log(
                            `Retrieved ${processes.length} PM2 processes`
                        );
                        this._processes = processes;
                        this._onDidChangeTreeData.fire();
                    }, resolve)
                )
            );
        });
    }

    refresh() {
        this._processes = [];
        this._onDidChangeTreeData.fire();
        this.listProcesses();
    }

    getTreeItem(element: Process): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(
        element?: Process | undefined
    ): vscode.ProviderResult<vscode.TreeItem[]> {
        if (!element) {
            return this._processes.map(
                process => new Process(process, this._pm2, this._context)
            );
        }
        return element.children;
    }
}
