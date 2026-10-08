const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Issue = require('./models/Issue');
const Resource = require('./models/Resource');
const Notification = require('./models/Notification');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcampus';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany();
    await Issue.deleteMany();
    await Resource.deleteMany();
    await Notification.deleteMany();

    console.log('[Seed] Creating demo users...');
    // Admin User
    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      phone: '+91 98765 43210',
      role: 'admin',
      department: 'Administration',
      status: 'active',
    });

    // Staff Users
    const networkStaff = await User.create({
      name: 'Network Staff',
      email: 'network@example.com',
      password: 'password123',
      phone: '+91 98765 43211',
      role: 'staff',
      department: 'Network',
      status: 'active',
    });

    const electricalStaff = await User.create({
      name: 'Electrical Staff',
      email: 'electrical@example.com',
      password: 'password123',
      phone: '+91 98765 43212',
      role: 'staff',
      department: 'Electrical',
      status: 'active',
    });

    const maintenanceStaff = await User.create({
      name: 'Maintenance Staff',
      email: 'maintenance@example.com',
      password: 'password123',
      phone: '+91 98765 43213',
      role: 'staff',
      department: 'Maintenance',
      status: 'active',
    });

    // Student Users
    const student1 = await User.create({
      name: 'Prekshitha (Student)',
      email: 'student1@example.com',
      password: 'password123',
      phone: '+91 98765 43214',
      role: 'student',
      department: 'CSE-AIML',
      year: '2nd Year',
      status: 'active',
    });

    const student2 = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      password: 'password123',
      phone: '+91 98765 43215',
      role: 'student',
      department: 'ISE',
      year: '3rd Year',
      status: 'active',
    });

    console.log('[Seed] Users seeded successfully.');

    console.log('[Seed] Creating campus resources...');
    await Resource.create([
      {
        name: 'Central Library',
        category: 'Study & Research',
        location: 'Block A, 2nd Floor',
        description: 'Main central library with 50,000+ volumes, digital catalog, and silent study cubicles.',
        status: 'Available',
      },
      {
        name: 'Computer Lab 3',
        category: 'Computing & Laboratories',
        location: 'Block B, Ground Floor',
        description: 'High-performance AI/ML GPU workstations with gigabit internet connectivity.',
        status: 'Available',
      },
      {
        name: 'Auditorium / Seminar Hall 1',
        category: 'Events & Lectures',
        location: 'Academic Complex, 3rd Floor',
        description: '300-seat amphitheater with 4K projection and Dolby surround sound.',
        status: 'Open',
      },
      {
        name: 'Innovation & Robotics Lab',
        category: 'Prototyping',
        location: 'Block C, 1st Floor',
        description: 'Rapid prototyping facility equipped with 3D printers, laser cutters, and electronics benches.',
        status: 'Maintenance',
      },
      {
        name: 'Sports Complex & Badminton Court',
        category: 'Athletics',
        location: 'Campus West Wing',
        description: 'Indoor wooden courts with evening floodlights and changing rooms.',
        status: 'Available',
      },
    ]);

    console.log('[Seed] Resources seeded successfully.');

    console.log('[Seed] Creating demo campus issues...');
    // 1. Pending Issue (Student reported, unassigned)
    const issue1 = await Issue.create({
      title: 'WiFi not working',
      category: 'Network',
      location: 'Lab 3, Block B',
      department: 'CSE-AIML',
      description: 'WiFi access point in Computer Lab 3 is completely disconnected. Students cannot access lab portals or internet.',
      priority: 'High',
      status: 'Pending',
      reportedBy: student1._id,
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });

    // 2. In Progress Issue (Assigned to Network Staff)
    const issue2 = await Issue.create({
      title: 'Projector display glitching',
      category: 'Classroom',
      location: 'Seminar Hall 1',
      department: 'ISE',
      description: 'Ceiling projector flickers green during presentations and shuts down automatically after 10 minutes.',
      priority: 'Medium',
      status: 'In Progress',
      reportedBy: student2._id,
      assignedTo: networkStaff._id,
      adminNote: 'Assigned to Network/AV team for cable inspection and firmware check.',
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      assignedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    });

    // 3. Resolved Issue (Resolved by Maintenance Staff)
    const issue3 = await Issue.create({
      title: 'Water leakage in 2nd Floor Washroom',
      category: 'Plumbing',
      location: 'Block A, 2nd Floor',
      department: 'Civil',
      description: 'Main pipe valve is leaking continuously creating slippery puddles near the library entrance.',
      priority: 'High',
      status: 'Resolved',
      reportedBy: student1._id,
      assignedTo: maintenanceStaff._id,
      adminNote: 'Urgent attention required due to library proximity.',
      resolutionNote: 'Main water valve seal replaced and pressure tested. Area sanitized and dried.',
      reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      assignedAt: new Date(Date.now() - 40 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    });

    // 4. Broken Fan issue
    const issue4 = await Issue.create({
      title: 'Broken ceiling fan making screeching noise',
      category: 'Electrical',
      location: 'Room 204, Block C',
      department: 'ECE',
      description: 'The middle ceiling fan regulator is stuck at maximum speed and motor produces loud noise during lectures.',
      priority: 'Medium',
      status: 'In Progress',
      reportedBy: student1._id,
      assignedTo: electricalStaff._id,
      adminNote: 'Electrical crew scheduled for evening maintenance after classes.',
      reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    });

    console.log('[Seed] Issues seeded successfully.');

    console.log('[Seed] Creating demo notifications...');
    await Notification.create([
      {
        userId: student1._id,
        message: 'Your issue "Water leakage in 2nd Floor Washroom" has been resolved.',
        type: 'issue_resolved',
        issueId: issue3._id,
        read: false,
      },
      {
        userId: networkStaff._id,
        message: 'You have been assigned issue: "Projector display glitching" at Seminar Hall 1.',
        type: 'issue_assigned',
        issueId: issue2._id,
        read: false,
      },
      {
        userId: admin._id,
        message: 'New issue reported: "WiFi not working" at Lab 3, Block B.',
        type: 'issue_reported',
        issueId: issue1._id,
        read: false,
      },
    ]);

    console.log('[Seed] Notifications seeded successfully.');
    console.log('\n=============================================================');
    console.log(' SEED COMPLETED SUCCESSFULLY! DEMO CREDENTIALS:');
    console.log('=============================================================');
    console.log(' 1. STUDENT:');
    console.log('    Email:    student1@example.com');
    console.log('    Password: password123');
    console.log(' 2. STAFF:');
    console.log('    Email:    network@example.com (or electrical@example.com)');
    console.log('    Password: password123');
    console.log(' 3. ADMIN:');
    console.log('    Email:    admin@example.com');
    console.log('    Password: password123');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
