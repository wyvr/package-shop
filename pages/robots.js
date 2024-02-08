export default async function () {
    return [
        {
            url: '/robots.txt',
            _wyvr: {
                template: ['Robots', 'Empty'],
                collection: { visible: false, name: 'robots.txt' },
                private: true
            },
            content: ''
        }
    ];
}
