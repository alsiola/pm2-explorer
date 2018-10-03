import * as nodePm2 from "pm2";
import * as vscode from "vscode";

const errCallback = <T>(cb?: (a: T) => void, reject?: ((err: any) => void)) => (
    err: Error,
    res: T
) => {
    if (err) {
        console.error(err);
        showErr(`PM2 Error:
err.message`);
        return reject && reject(err);
    }
    return cb && cb(res);
};

const showMsg = (msg: string) => {
    vscode.window.showInformationMessage(`PM2 Explorer: ${msg}`);
};

const showErr = (msg: string) =>
    vscode.window.showErrorMessage(`PM2 Explorer: ${msg}`);

export class PM2 implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<
        Process | undefined
    > = new vscode.EventEmitter<Process | undefined>();

    readonly onDidChangeTreeData: vscode.Event<Process | undefined> = this
        ._onDidChangeTreeData.event;

    private _pm2!: Promise<typeof nodePm2>;
    private _processes: nodePm2.ProcessDescription[] = [];

    constructor(_context: vscode.ExtensionContext) {
        this.init();
        this.listProcesses();
    }

    private init() {
        console.log("Initialising PM2");
        return (this._pm2 = new Promise(resolve => {
            nodePm2.connect(err => {
                if (err) {
                    console.error(err);
                    showErr(`Could not connect to PM2.

Error: ${err.message}`);
                    return;
                }
                console.log("Connected to PM2 Daemon");
                resolve(nodePm2);
            });
        }));
    }

    logs(process?: nodePm2.ProcessDescription) {
        const terminal = vscode.window.createTerminal("pm2");
        terminal.sendText(
            "pm2 logs " + (process && process.name ? process.name : "")
        );
        terminal.show();
    }

    reloadAll() {
        this._pm2.then(pm2 => {
            pm2.reload("all", errCallback());
        });
    }

    reload(process: nodePm2.ProcessDescription) {
        this._pm2.then(pm2 => {
            pm2.reload(
                process.name!,
                errCallback(() => {
                    showMsg(`Reloaded process ${process.name}`);
                })
            );
        });
    }

    listProcesses() {
        console.log("Retrieving PM2 processes");
        this._pm2.then(pm2 => {
            pm2.list(
                errCallback(processes => {
                    console.log(`Retrieved ${processes.length} PM2 processes`);
                    this._processes = processes;
                    console.log(this._processes[0].pm2_env!.pm_uptime);
                    this._onDidChangeTreeData.fire();
                })
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
        console.log("Getting children");
        if (!element) {
            return this._processes.map(
                process => new Process(process, this._pm2)
            );
        }
        return element.children;
    }
}

const getProcessLabel = (process: nodePm2.ProcessDescription): string => {
    return `${process.name}`;
};

export class Process extends vscode.TreeItem {
    public readonly label?: string;
    public readonly contextValue = "pm2-process";

    constructor(
        public readonly process: nodePm2.ProcessDescription,
        private readonly _pm2: Promise<typeof nodePm2>
    ) {
        super(
            getProcessLabel(process),
            vscode.TreeItemCollapsibleState.Collapsed
        );
        this.label = getProcessLabel(process);
    }

    start() {
        this._pm2.then(pm2 =>
            pm2.start(
                {
                    name: this.process.name!
                },
                errCallback(() =>
                    showMsg(`Started process ${this.process.name}`)
                )
            )
        );
    }

    stop() {
        this._pm2.then(pm2 =>
            pm2.stop(
                this.process.name!,
                errCallback(() =>
                    showMsg(`Stopped process ${this.process.name}`)
                )
            )
        );
    }

    get tooltip(): string {
        return `Name: ${this.label}
PID: ${this.process.pid}`;
    }

    get children(): vscode.TreeItem[] {
        return [
            new vscode.TreeItem(`Status: ${this.process.pm2_env!.status}`),
            new vscode.TreeItem(
                `Instances: ${this.process.pm2_env!.instances}`
            ),
            new vscode.TreeItem(`Uptime: ${this.process.pm2_env!.pm_uptime}`),
            new vscode.TreeItem(
                `Unstable restarts: ${this.process.pm2_env!.unstable_restarts}`
            )
        ];
    }
}
