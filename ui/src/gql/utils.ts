import {DataProxy} from 'apollo-cache';
import {TimeSpans} from './__generated__/TimeSpans';
import * as gqlTimeSpan from './timeSpan';
import moment from 'moment';
import {AddTimeSpan_createTimeSpan} from './__generated__/AddTimeSpan';
import {Trackers} from './__generated__/Trackers';
import {StopTimer_stopTimeSpan} from './__generated__/StopTimer';
import {RemoveTimeSpan_removeTimeSpan } from './__generated__/RemoveTimeSpan';

// If we had simply invalidated the cache upon every tracker completion, the visual on DoneTracker.tsx page would be quite janky
// This is a hack to make it not so janky
//
// Only do this hack for the unfiltered cache becausing finding out which filter combinations actually contains this newly inserted time span is way to complicated,
// at that point we might as well just have a database on the client side
export const addTimeSpanToUnfilteredCache = (cache: DataProxy, ts: AddTimeSpan_createTimeSpan) => {
    let oldData: TimeSpans | null = null;
    try {
        oldData = cache.readQuery<TimeSpans>({query: gqlTimeSpan.TimeSpans}); // note how there's no vars passed
    } catch {}
    if (!oldData) {
        return;
    }
    cache.writeQuery<TimeSpans>({
        query: gqlTimeSpan.TimeSpans,
        data: {
            timeSpans: {
                __typename: 'PagedTimeSpans',
                timeSpans: oldData.timeSpans.timeSpans
                    .concat([ts])
                    .sort((a, b) => moment(b.start).unix() - moment(a.start).unix()),
                cursor: oldData.timeSpans.cursor,
            },
        },
    });
};

export const removeTimeSpanFromUnfilteredCache = (cache: DataProxy, data: RemoveTimeSpan_removeTimeSpan) => {
    let oldData: TimeSpans | null = null;
    try {
        oldData = cache.readQuery<TimeSpans>({query: gqlTimeSpan.TimeSpans}); // note how there's no vars passed
    } catch (e) {}
    if (!oldData) {
        return;
    }
    const removedId = data.id;
    cache.writeQuery<TimeSpans>({
        query: gqlTimeSpan.TimeSpans,
        data: {
            timeSpans: {
                __typename: 'PagedTimeSpans',
                timeSpans: oldData.timeSpans.timeSpans.filter((ts) => ts.id !== removedId),
                cursor: oldData.timeSpans.cursor,
            },
        },
    });
};

export const removeFromTrackersCache = (cache: DataProxy, data: StopTimer_stopTimeSpan | RemoveTimeSpan_removeTimeSpan) => {
    const oldTrackers = cache.readQuery<Trackers>({query: gqlTimeSpan.Trackers});
    if (!oldTrackers) {
        return;
    }
    const removeId = data.id;
    cache.writeQuery<Trackers>({
        query: gqlTimeSpan.Trackers,
        data: {
            timers: (oldTrackers.timers || []).filter((tracker) => tracker.id !== removeId),
        },
    });
};

