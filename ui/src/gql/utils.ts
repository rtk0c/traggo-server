import {DataProxy} from 'apollo-cache';
import * as gqlTimeSpan from './timeSpan';
import {Trackers} from './__generated__/Trackers';
import {StopTimer} from './__generated__/StopTimer';

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

