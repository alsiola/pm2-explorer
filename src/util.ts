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

export const sendTerminalCommand = (command: string, show: boolean = true) => {
    const terminal = vscode.window.createTerminal("pm2");
    terminal.sendText(command);
    if (show) terminal.show();
};

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

const convertMilliseconds = (
    milliseconds: number,
    interval: number,
    suffix: string
) => {
    const quantity = Math.floor(milliseconds / interval);

    return `${quantity} ${suffix}`;
};

export const millisecondsToReadable = (milliseconds: number) => {
    if (milliseconds > ONE_WEEK) {
        return convertMilliseconds(milliseconds, ONE_WEEK, "weeks");
    }

    if (milliseconds > ONE_DAY) {
        return convertMilliseconds(milliseconds, ONE_DAY, "days");
    }

    if (milliseconds > ONE_HOUR) {
        return convertMilliseconds(milliseconds, ONE_HOUR, "hours");
    }

    if (milliseconds > ONE_MINUTE) {
        return convertMilliseconds(milliseconds, ONE_MINUTE, "minutes");
    }

    if (milliseconds > ONE_SECOND) {
        return convertMilliseconds(milliseconds, ONE_SECOND, "seconds");
    }

    return `${milliseconds} ms`;
};
