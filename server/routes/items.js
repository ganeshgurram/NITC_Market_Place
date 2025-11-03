const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

// Get all items (with filters)
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      department, 
      semester, 
      type, 
      category,
      isAvailable 
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (department && department !== 'All Departments') {
      query.department = department;
    }

    if (semester && semester !== 'All Semesters') {
      query.semester = semester.split(' ')[0];
    }

    if (type && type !== 'All Types') {
      const typeMap = {
        'For Sale': 'sale',
        'For Rent': 'rent',
        'Free/Donation': 'free'
      };
      query.type = typeMap[type] || type;
    }

    if (category) {
      query.category = category;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const items = await Item.find(query)
      .populate('seller', 'name rating reviewCount')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items', message: error.message });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name rating reviewCount email phone hostel');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Increment view count
    item.views += 1;
    await item.save();

    res.json({ item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Error fetching item', message: error.message });
  }
});

// Create new item
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['sale', 'rent', 'free']).withMessage('Invalid type'),
  body('category').isIn(['textbook', 'lab-equipment', 'stationery', 'other']).withMessage('Invalid category'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair']).withMessage('Invalid condition'),
  body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      price,
      type,
      category,
      department,
      semester,
      courseCode,
      condition,
      images,
      location
    } = req.body;

    const item = new Item({
      title,
      description,
      price: type === 'sale' ? price : undefined,
      type,
      category,
      department,
      semester,
      courseCode,
      condition,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop'],
      location,
      seller: req.userId
    });

    await item.save();
    await item.populate('seller', 'name rating reviewCount');

    res.status(201).json({ 
      message: 'Item created successfully',
      item 
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Error creating item', message: error.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user owns the item
    if (item.seller.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      item[key] = updates[key];
    });

    await item.save();
    await item.populate('seller', 'name rating reviewCount');

    res.json({ 
      message: 'Item updated successfully',
      item 
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error updating item', message: error.message });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user owns the item
    if (item.seller.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item', message: error.message });
  }
});

// Get user's own items
router.get('/user/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ seller: req.userId })
      .populate('seller', 'name rating reviewCount')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ error: 'Error fetching user items', message: error.message });
  }
});

module.exports = router;
