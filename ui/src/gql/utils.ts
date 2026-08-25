import {DataProxy} from 'apollo-cache';
import {TimeSpans, TimeSpansVariables} from './__generated__/TimeSpans';
import * as gqlTimeSpan from './timeSpan';
import moment from 'moment';
import {AddTimeSpan_createTimeSpan} from './__generated__/AddTimeSpan';
import {Trackers} from './__generated__/Trackers';
import {StopTimer} from './__generated__/StopTimer';

export const addTimeSpanToCache = (cache: DataProxy, ts: AddTimeSpan_createTimeSpan) => {
    let oldTimeSpans: TimeSpans | null = null;
    try {
        oldTimeSpans = cache.readQuery<TimeSpans>({query: gqlTimeSpan.TimeSpans});
    } catch {}
    if (!oldTimeSpans) {
        return;
    }
    cache.writeQuery<TimeSpans>({
        query: gqlTimeSpan.TimeSpans,
        data: {
            timeSpans: {
                __typename: 'PagedTimeSpans',
                timeSpans: oldTimeSpans.timeSpans.timeSpans
                    .concat([ts])
                    .sort((a, b) => moment(b.start).unix() - moment(a.start).unix()),
                cursor: oldTimeSpans.timeSpans.cursor,
            },
        },
    });
};
export const addTimeSpanInRangeToCache = (cache: DataProxy, ts: AddTimeSpan_createTimeSpan, vars: TimeSpansVariables) => {
    const oldTimeSpans = cache.readQuery<TimeSpans>({query: gqlTimeSpan.TimeSpans, variables: vars});
    if (!oldTimeSpans) {
        return;
    }
    cache.writeQuery<TimeSpans>({
        query: gqlTimeSpan.TimeSpans,
        variables: vars,
        data: {
            timeSpans: {
                __typename: 'PagedTimeSpans',
                timeSpans: oldTimeSpans.timeSpans.timeSpans
                    .concat([ts])
                    .sort((a, b) => moment(b.start).unix() - moment(a.start).unix()),
                cursor: oldTimeSpans.timeSpans.cursor,
            },
        },
    });
};
export const removeFromTrackersCache = (cache: DataProxy, data: StopTimer) => {
    const oldTrackers = cache.readQuery<Trackers>({query: gqlTimeSpan.Trackers});
    if (!oldTrackers || !data || !data.stopTimeSpan) {
        return;
    }
    cache.writeQuery<Trackers>({
        query: gqlTimeSpan.Trackers,
        data: {
            timers: (oldTrackers.timers || []).filter((tracker) => tracker.id !== data.stopTimeSpan!.id),
        },
    });
};

export const removeFromTimeSpanInRangeCache = (cache: DataProxy, id: number, vars: TimeSpansVariables) => {
    const old = cache.readQuery<TimeSpans>({query: gqlTimeSpan.TimeSpans, variables: vars});
    if (!old) {
        return;
    }
    cache.writeQuery<TimeSpans>({
        query: gqlTimeSpan.TimeSpans,
        variables: vars,
        data: {
            timeSpans: {
                __typename: 'PagedTimeSpans',
                timeSpans: old.timeSpans.timeSpans.filter((ts) => ts.id !== id),
                cursor: old.timeSpans.cursor,
            },
        },
    });
};
