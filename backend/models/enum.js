// All possible categories for the item specified in ad
const categoryEnum = [
    'Clothes',
    'Furniture',
    'Electronics',
    'Kitchenware',
    'Toys',
    'Books',
    'Sport Equipment',
    'Cosmetics',
    'Pet Supplies',
    'Other'
];

// All possible conditions of an object, ranked from best to worst
const conditionEnum = [
    'New',
    'Like New',
    'Very Good',
    'Good',
    'Average',
    'repaired',
    'Used',
    'Defective',
    'Bad',
    'Very Bad'
];

const statusEnum = [
    'Pending',
    'Accepted',
    'Rejected'
];

module.exports = { categoryEnum, conditionEnum, statusEnum };