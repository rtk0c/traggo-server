import {toRangeVariables} from './timespanutils';

it('should return empty variables for empty or invalid input', () => {
    expect(toRangeVariables()).toEqual({});
    expect(toRangeVariables('', '')).toEqual({});
    expect(toRangeVariables('not-a-date', 'also-bad')).toEqual({});
});

it('should normalize absolute dates to full-day UTC ranges', () => {
    const vars = toRangeVariables('2020-01-01', '2020-01-31');
    expect(vars.fromInclusive).toMatch(/^2020-01-01T\d{2}:00:00Z$/);
    expect(vars.toInclusive).toMatch(/^2020-0(1-31|2-01)T\d{2}:59:59Z$/);
});

it('should return empty variables when from is after to', () => {
    expect(toRangeVariables('2020-02-01', '2020-01-01')).toEqual({});
});

it('should support relative expressions', () => {
    const vars = toRangeVariables('now-7d', 'now');
    expect(typeof vars.fromInclusive).toBe('string');
    expect(typeof vars.toInclusive).toBe('string');
    expect(vars.fromInclusive).not.toBe('');
});
