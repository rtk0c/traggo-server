import * as React from 'react';
import {Tracker} from './Tracker';
import {ActiveTrackers} from './ActiveTrackers';
import {DoneTrackers} from './DoneTrackers';
import {TagSelectorEntry} from '../tag/tagSelectorEntry';
import {RefreshTimeSpans} from './RefreshTimespans';
import {ParsedTime, RelativeDateTimeSelector} from '../common/RelativeDateTimeSelector';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const emptyResult = (text = ''): ParsedTime => ({success: false, error: '', text});

export const DailyPage = () => {
    const [selectedEntries, setSelectedEntries] = React.useState<TagSelectorEntry[]>([]);
    const [from, setFrom] = React.useState<ParsedTime>(emptyResult());
    const [to, setTo] = React.useState<ParsedTime>(emptyResult());

    return (
        <div style={{margin: '1px auto', maxWidth: 1000}}>
            <Tracker selectedEntries={selectedEntries} onSelectedEntriesChanged={setSelectedEntries} />
            <ActiveTrackers />
            <Grid container spacing={2} alignItems="center" justify="center">
                <Grid item xs={12} sm={5}>
                    <RelativeDateTimeSelector
                        value={from.success ? from.localized : from.text}
                        onChange={setFrom}
                        type="startOf"
                        label="From"
                        small
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <RelativeDateTimeSelector
                        value={to.success ? to.localized : to.text}
                        onChange={setTo}
                        type="endOf"
                        label="To"
                        small
                    />
                </Grid>
                <Grid item>
                    <Button size="small" onClick={() => { setFrom(emptyResult()); setTo(emptyResult()); }}>
                        Clear filter
                    </Button>
                </Grid>
            </Grid>
            <DoneTrackers
                from={from.success ? from.preview : undefined}
                to={to.success ? to.preview : undefined}
                addTagsToTracker={
                    selectedEntries.length === 0 ? (entries) => setSelectedEntries(selectedEntries.concat(entries)) : undefined
                }
            />
            <RefreshTimeSpans />
        </div>
    );
};
