import { writable } from 'svelte/store';

const { set } = writable(0);

let index = 0;

export default () => {
    index++;
    set(index);
    return index;
};
