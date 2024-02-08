import { sleep_random } from '@src/shop/api/sleep.js';

export default {
    url: '/[store]/api/.*',
    onExec: async ({ returnJSON }) => {
        await sleep_random(200, 500);
        return returnJSON(
            {
                message: 'unknown'
            },
            404
        );
    }
};
