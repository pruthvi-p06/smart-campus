const Resource = require('../models/Resource');

// @desc    Get all campus resources
// @route   GET /api/resources
// @access  Private (Authenticated users: Student, Staff, Admin)
const getAllResources = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ name: 1 });
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch resources: ${error.message}` });
  }
};

// @desc    Create a new campus resource
// @route   POST /api/admin/resources
// @access  Private (Admin)
const createResource = async (req, res) => {
  try {
    const { name, category, location, description, status } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ message: 'Name, category, and location are required' });
    }

    const resource = await Resource.create({
      name,
      category,
      location,
      description: description || '',
      status: status || 'Available',
    });

    return res.status(201).json({
      message: 'Resource created successfully',
      resource,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to create resource: ${error.message}` });
  }
};

// @desc    Update a campus resource
// @route   PUT /api/admin/resources/:id
// @access  Private (Admin)
const updateResource = async (req, res) => {
  try {
    const { name, category, location, description, status } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (name) resource.name = name;
    if (category) resource.category = category;
    if (location) resource.location = location;
    if (description !== undefined) resource.description = description;
    if (status) resource.status = status;

    await resource.save();

    return res.status(200).json({
      message: 'Resource updated successfully',
      resource,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to update resource: ${error.message}` });
  }
};

// @desc    Delete a campus resource
// @route   DELETE /api/admin/resources/:id
// @access  Private (Admin)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();

    return res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete resource: ${error.message}` });
  }
};

module.exports = {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
};
