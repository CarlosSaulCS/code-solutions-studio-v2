const { execSync } = require('child_process');

console.log('🚀 Configuring database for production...\n');

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n🗃️ Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Database configuration completed successfully!');
  console.log('\n📊 Next steps:');
  console.log('1. Configure DATABASE_URL in Vercel');
  console.log('2. Configure RESEND_API_KEY in Vercel');
  console.log('3. Deploy to production');
  
} catch (error) {
  console.error('\n❌ Error configuring database:', error.message);
  console.log('\n🔍 Make sure DATABASE_URL is configured correctly');
}
