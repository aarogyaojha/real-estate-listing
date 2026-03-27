import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const userPassword = await bcrypt.hash('User@123', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'aarogyaojha' },
    update: {},
    create: {
      username: 'aarogyaojha',
      passwordHash: adminPassword,
      isAdmin: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      passwordHash: userPassword,
      isAdmin: false,
    },
  });

  const agents = await Promise.all([
    prisma.agent.upsert({ where: { email: 'agent1@example.com' }, update: {}, create: { name: 'Alice Smith', email: 'agent1@example.com', phone: '0412345678', agencyName: 'Luxury Real Estate' } }),
    prisma.agent.upsert({ where: { email: 'agent2@example.com' }, update: {}, create: { name: 'Bob Jones', email: 'agent2@example.com', phone: '0423456789', agencyName: 'City Homes' } }),
    prisma.agent.upsert({ where: { email: 'agent3@example.com' }, update: {}, create: { name: 'Charlie Brown', email: 'agent3@example.com', phone: '0434567890', agencyName: 'Suburban Dreams' } }),
    prisma.agent.upsert({ where: { email: 'agent4@example.com' }, update: {}, create: { name: 'Diana Prince', email: 'agent4@example.com', phone: '0445678901', agencyName: 'Premier Properties' } }),
    prisma.agent.upsert({ where: { email: 'agent5@example.com' }, update: {}, create: { name: 'Evan Williams', email: 'agent5@example.com', phone: '0456789012', agencyName: 'Elite Realty' } }),
  ]);

  const suburbs = ['Kathmandu', 'Patan', 'Bhaktapur', 'Lalitpur', 'Pokhara'];
  const propertyTypes = ['HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'COMMERCIAL'] as const;
  const statuses = ['ACTIVE', 'UNDER_CONTRACT', 'SOLD', 'WITHDRAWN'] as const;

  for (let i = 1; i <= 25; i++) {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const randomSuburb = suburbs[Math.floor(Math.random() * suburbs.length)];
    const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const price = Math.floor(Math.random() * 45000000) + 5000000;
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const bathrooms = Math.floor(Math.random() * 3) + 1;
    
    await prisma.listing.create({
      data: {
        title: `Beautiful ${randomType.toLowerCase()} in ${randomSuburb}`,
        description: `This is a great property with ${bedrooms} bedrooms and ${bathrooms} bathrooms.`,
        price,
        suburb: randomSuburb,
        state: 'Bagmati',
        postcode: '44600',
        propertyType: randomType,
        bedrooms,
        bathrooms,
        parkingSpaces: Math.floor(Math.random() * 3),
        landSizeSqm: Math.floor(Math.random() * 500) + 100,
        floorSizeSqm: Math.floor(Math.random() * 200) + 50,
        status: randomStatus,
        internalNotes: randomStatus !== 'ACTIVE' ? `Property is currently ${randomStatus}.` : null,
        agentId: randomAgent.id,
      }
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
