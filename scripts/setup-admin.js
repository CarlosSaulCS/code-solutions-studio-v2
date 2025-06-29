const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function checkAndSetupAdmin() {
  console.log('🔧 Checking and Setting Up Admin Account...\n');

  try {
    // Check if admin already exists
    console.log('1. Checking for existing admin users...');
    const existingAdmins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    if (existingAdmins.length > 0) {
      console.log('✅ Admin user(s) already exist:');
      existingAdmins.forEach(admin => {
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   👤 Name: ${admin.name}`);
        console.log(`   📅 Created: ${admin.createdAt.toLocaleDateString()}`);
        console.log(`   ✔️  Verified: ${admin.emailVerified ? 'Yes' : 'No'}`);
        console.log('');
      });

      console.log('🚀 To access admin dashboard:');
      console.log('   1. Go to: http://localhost:3000/auth/login');
      console.log('   2. Use credentials from above');
      console.log('   3. Navigate to: http://localhost:3000/admin');
      console.log('');

      // If email is not verified, let's verify it
      const unverifiedAdmins = existingAdmins.filter(admin => !admin.emailVerified);
      if (unverifiedAdmins.length > 0) {
        console.log('🔧 Verifying admin emails...');
        for (const admin of unverifiedAdmins) {
          await prisma.user.update({
            where: { id: admin.id },
            data: { emailVerified: new Date() }
          });
          console.log(`   ✅ Verified: ${admin.email}`);
        }
      }

    } else {
      console.log('❌ No admin users found. Setting up admin account...');
      
      try {
        const response = await fetch(`${BASE_URL}/api/setup/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            adminKey: 'setup-code-solutions-admin-2025'
          })
        });

        const result = await response.json();

        if (response.ok) {
          console.log('✅ Admin account created successfully!');
          console.log('');
          console.log('🔑 LOGIN CREDENTIALS:');
          console.log('   📧 Email: admin@codesolutions.com');
          console.log('   🔒 Password: admin123');
          console.log('');
          console.log('🚀 ACCESS INSTRUCTIONS:');
          console.log('   1. Go to: http://localhost:3000/auth/login');
          console.log('   2. Login with the credentials above');
          console.log('   3. Navigate to: http://localhost:3000/admin');
          console.log('');
          console.log('⚠️  IMPORTANT: Change the password after first login!');
        } else {
          console.log('❌ Failed to create admin account:', result.error);
        }
      } catch (fetchError) {
        console.log('❌ Error calling setup API:', fetchError.message);
        console.log('   Make sure the server is running with: npm run dev');
      }
    }

    // Check all users and their roles
    console.log('👥 All users in the system:');
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        emailVerified: true
      }
    });

    allUsers.forEach(user => {
      console.log(`   📧 ${user.email} | 👤 ${user.name || 'No name'} | 🏷️  ${user.role} | ✔️  ${user.emailVerified ? 'Verified' : 'Not verified'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSetupAdmin().catch(console.error);
