import * as React from 'react';
import {Tracker} from './Tracker';
import {ActiveTrackers} from './ActiveTrackers';
import {DoneTrackers} from './DoneTrackers';
import {TagSelectorEntry} from '../tag/tagSelectorEntry';
import {RefreshTimeSpans} from './RefreshTimespans';
import {RelativeDateTimeSelector} from '../common/RelativeDateTimeSelector';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export const DailyPage = () => {
    const [selectedEntries, setSelectedEntries] = React.useState<TagSelectorEntry[]>([]);
    const [from, setFrom] = React.useState('');
    const [to, setTo] = React.useState('');

    return (
        <div style={{margin: '1px auto', maxWidth: 1000}}>
            <Tracker selectedEntries={selectedEntries} onSelectedEntriesChanged={setSelectedEntries} />
            <ActiveTrackers />
            <Grid container spacing={2} alignItems="center" justify="center">
                <Grid item xs={12} sm={5}>
                    <RelativeDateTimeSelector
                        value={from}
                        onChange={(value) => setFrom(value)}
                        type="startOf"
                        label="From"
                        small
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <RelativeDateTimeSelector value={to} onChange={(value) => setTo(value)} type="endOf" label="To" small />
                </Grid>
                <Grid item>
                    <Button size="small" onClick={() => { setFrom(''); setTo(''); }}>
                        Clear filter
                    </Button>
                </Grid>
            </Grid>
            <DoneTrackers
                from={from}
                to={to}
                addTagsToTracker={
                    selectedEntries.length === 0 ? (entries) => setSelectedEntries(selectedEntries.concat(entries)) : undefined
                }
            />
            <RefreshTimeSpans />
        </div>
    );
};
