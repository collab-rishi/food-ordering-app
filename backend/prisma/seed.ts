import { PrismaClient, RoleName, RegionName } from '@prisma/client';
// Note: Usually, you'd use bcrypt here to hash passwords. 
// For this assignment, we'll use a placeholder or install bcrypt.
// import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean the database (Optional: clear existing data to avoid duplicates)
  // Delete in reverse order of dependencies
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.region.deleteMany();

  // 2. Seed Regions
  const india = await prisma.region.create({ data: { name: RegionName.INDIA } });
  const america = await prisma.region.create({ data: { name: RegionName.AMERICA } });

  // 3. Seed Roles
  const adminRole = await prisma.role.create({ data: { name: RoleName.ADMIN } });
  const managerRole = await prisma.role.create({ data: { name: RoleName.MANAGER } });
  const memberRole = await prisma.role.create({ data: { name: RoleName.MEMBER } });

  // 4. Seed Users (The Avengers/Villains)
  const password = 'password123'; // In production, use: await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'nick.fury@shield.com',
      firstName: 'Nick',
      lastName: 'Fury',
      roleId: adminRole.id,
      regionId: india.id, // Admin is org-wide, but needs a default region link
    },
    {
      email: 'carol.danvers@shield.com',
      firstName: 'Captain',
      lastName: 'Marvel',
      roleId: managerRole.id,
      regionId: india.id,
    },
    {
      email: 'steve.rogers@shield.com',
      firstName: 'Captain',
      lastName: 'America',
      roleId: managerRole.id,
      regionId: america.id,
    },
    {
      email: 'thanos@titan.com',
      firstName: 'Thanos',
      lastName: 'The Mad Titan',
      roleId: memberRole.id,
      regionId: india.id,
    },
    {
      email: 'thor.odinson@asgard.com',
      firstName: 'Thor',
      lastName: 'Odinson',
      roleId: memberRole.id,
      regionId: india.id,
    },
    {
      email: 'travis.scott@america.com',
      firstName: 'Travis',
      lastName: 'Scott',
      roleId: memberRole.id,
      regionId: america.id,
    },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: { ...u, password },
    });
  }

  // 5. Seed initial Restaurants & Menus (So "View Menu" works immediately)
  const spicyIndia = await prisma.restaurant.create({
    data: {
      name: 'Spicy India Delights',
      regionId: india.id,
      menuItems: {
        create: [
          { name: 'Paneer Tikka', price: 250 },
          { name: 'Butter Chicken', price: 350 },
        ],
      },
    },
  });

  const burgerAmerica = await prisma.restaurant.create({
    data: {
      name: 'Liberty Burger Joint',
      regionId: america.id,
      menuItems: {
        create: [
          { name: 'Classic Cheeseburger', price: 12 },
          { name: 'Freedom Fries', price: 5 },
        ],
      },
    },
  });

  console.log('✅ Seeding complete! Nick Fury and the team are ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });