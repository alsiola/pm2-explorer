import * as vscode from "vscode";

export const errCallback = <T>(
    cb?: (a: T) => void,
    reject?: ((err: any) => void)
) => (err: Error, res: T) => {
    if (err) {
        console.error(err);
        showErr(`PM2 Error:
err.message`);
        return reject && reject(err);
    }
    return cb && cb(res);
};

export const showMsg = (msg: string) => {
    vscode.window.showInformationMessage(`PM2 Explorer: ${msg}`);
};

export const showErr = (msg: string) =>
    vscode.window.showErrorMessage(`PM2 Explorer: ${msg}`);

export const refresher = ({
    fn,
    interval,
    skipIf
}: {
    fn: () => void;
    interval: () => number;
    skipIf: () => boolean;
}) => () => {
    !skipIf() && fn();
    return setTimeout(refresher({ fn, interval, skipIf }), interval());
};
