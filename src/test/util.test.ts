import * as assert from "assert";
import { millisecondsToReadable } from "../util";

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;
const WEEKS = 7 * DAYS;

suite("Util", () => {
    suite("millisecondsToReadable", () => {
        test("converts to milliseconds when less than one second", () => {
            const actual = millisecondsToReadable(5);

            const expected = "5 ms";

            assert.equal(actual, expected);
        });

        test("converts to seconds when one second to one minute", () => {
            const actual = millisecondsToReadable(5 * SECONDS);

            const expected = "5 seconds";

            assert.equal(actual, expected);
        });

        test("converts to minutes when one minute to one hour", () => {
            const actual = millisecondsToReadable(5 * MINUTES);

            const expected = "5 minutes";

            assert.equal(actual, expected);
        });

        test("converts to hours when one hour to one day", () => {
            const actual = millisecondsToReadable(5 * HOURS);

            const expected = "5 hours";

            assert.equal(actual, expected);
        });

        test("converts to days when one day to one week", () => {
            const actual = millisecondsToReadable(5 * DAYS);

            const expected = "5 days";

            assert.equal(actual, expected);
        });

        test("converts to weeks when over one week", () => {
            const actual = millisecondsToReadable(5 * WEEKS);

            const expected = "5 weeks";

            assert.equal(actual, expected);
        });
    });
});
