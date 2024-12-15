const express = require('express');
const router = express.Router();

// Mock database for used items
let usedItems = [
    {
        id: 1,
        title: 'Used Laptop',
        description: 'A slightly used laptop in good condition.',
        price: 500,
        isSold: false,
        seller: 'John Doe',
        reviews: [
            {
                reviewId: 1,
                user: 'Alice',
                rating: 4,
                comment: 'Great condition, fast delivery!',
                comments: [
                    { user: 'Bob', text: 'Is it still available?' },
                    { user: 'Charlie', text: 'What is the battery life like?' }
                ]
            }
        ],
    },
    {
        id: 2,
        title: 'Used Phone',
        description: 'A smartphone with minor scratches, works perfectly.',
        price: 200,
        isSold: false,
        seller: 'Jane Smith',
        reviews: [],
    }
];

// Route: Get all used items
router.get('/', (req, res) => {
    const availableItems = usedItems.filter(item => !item.isSold);
    res.json(availableItems);
});

// Route: Post a new used item
router.post('/', (req, res) => {
    const { title, description, price, seller } = req.body;

    if (!title || !description || !price || !seller) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number.' });
    }

    const newItem = {
        id: usedItems.length + 1,
        title,
        description,
        price,
        isSold: false,
        seller,
        reviews: [],
    };

    usedItems.push(newItem);
    res.status(201).json(newItem);
});

// Route: Search for used items
router.get('/search', (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required.' });
    }

    const results = usedItems.filter(item =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json(results);
});

// Route: Add a review for a used item
router.post('/:id/reviews', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { user, rating, comment } = req.body;

    const item = usedItems.find(item => item.id === itemId);

    if (!item) {
        return res.status(404).json({ error: 'Item not found.' });
    }

    if (!user || !rating || !comment) {
        return res.status(400).json({ error: 'All review fields are required.' });
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const newReview = {
        reviewId: item.reviews.length + 1, // Generating unique reviewId based on length
        user,
        rating,
        comment,
        comments: [],
    };

    item.reviews.push(newReview);
    res.status(201).json(newReview);
});

// Route: Add a comment to a review
router.post('/:id/reviews/:reviewId/comments', (req, res) => {
    const itemId = parseInt(req.params.id);
    const reviewId = parseInt(req.params.reviewId);
    const { user, text } = req.body;

    const item = usedItems.find(item => item.id === itemId);
    if (!item) {
        return res.status(404).json({ error: 'Item not found.' });
    }

    const review = item.reviews.find(review => review.reviewId === reviewId);
    if (!review) {
        return res.status(404).json({ error: 'Review not found.' });
    }

    if (!user || !text) {
        return res.status(400).json({ error: 'Both user and text are required for the comment.' });
    }

    const newComment = { user, text };
    review.comments.push(newComment);

    res.status(201).json(newComment);
});

// Global error handler (for unexpected errors)
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = router;
