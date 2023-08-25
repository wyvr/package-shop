export function get_time_stamp_minutes() {
    return Math.ceil(get_time_stamp_milliseconds() / 60000);
}
export function get_time_stamp_seconds() {
    return Math.ceil(get_time_stamp_milliseconds() / 1000);
}
export function get_time_stamp_milliseconds() {
    return new Date().getTime();
}
