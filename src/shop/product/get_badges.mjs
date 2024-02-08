export function get_badges(product) {
    const badges = [];
    if (product?.new?.value === '1') {
        badges.push({
            name: product?.new?.label || 'New',
            color: '#afa'
        });
    }
    if (product?.sale?.value === '1') {
        badges.push({
            name: product?.sale?.label || 'Sale',
            color: '#faa'
        });
    }
    return badges;
}
