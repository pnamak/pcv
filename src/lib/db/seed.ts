import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./index";
import {
  staffUsers,
  pastors,
  churches,
  events,
  newsArticles,
  reports,
  churchPrograms,
} from "./schema";

const now = new Date().toISOString();

async function seed() {
  await db.run(sql`DELETE FROM reports`);
  await db.run(sql`DELETE FROM events`);
  await db.run(sql`DELETE FROM news_articles`);
  await db.run(sql`DELETE FROM churches`);
  await db.run(sql`DELETE FROM pastors`);
  await db.run(sql`DELETE FROM church_programs`);
  await db.run(sql`DELETE FROM staff_users`);

  const passwordHash = await bcrypt.hash("admin123", 10);
  await db.insert(staffUsers).values({
    email: "admin@pcv.vu",
    passwordHash,
    name: "PCV Administrator",
    role: "admin",
    createdAt: now,
  });

  const pastorRows = await db
    .insert(pastors)
    .values([
      {
        firstName: "Shem",
        lastName: "Tamara",
        email: "shem.tamara@pcv.vu",
        phone: "+678 12345",
        rank: "Pastor",
        ordinationYear: 2010,
        islandOrigin: "Efate",
        villageOrigin: "Port Vila",
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Mary",
        lastName: "Kalsakau",
        email: "mary.kalsakau@pcv.vu",
        phone: "+678 23456",
        rank: "Pastor",
        ordinationYear: 2015,
        islandOrigin: "Efate",
        villageOrigin: "Nguna",
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "John",
        lastName: "Tari",
        email: "john.tari@pcv.vu",
        phone: "+678 34567",
        rank: "Elder",
        ordinationYear: 2008,
        islandOrigin: "Tanna",
        villageOrigin: "Lenakel",
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
    ])
    .returning();

  await db.insert(churches).values([
    {
      name: "Nguna Presbyterian Church",
      areaCouncil: "Nguna Pele Area Council",
      sessionName: "Nguna Session",
      presbytery: "North Efate Presbytery",
      island: "Nguna",
      province: "Shefa",
      pastorId: pastorRows[1].id,
      latitude: -17.1167,
      longitude: 168.2,
      memberCount: 245,
      serviceTimes: "Sunday 9:00 AM",
      tags: JSON.stringify(["PWMU", "Men's Fellowship", "Sunday School"]),
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Port Vila Central Church",
      areaCouncil: "Port Vila Area Council",
      sessionName: "Port Vila Session",
      presbytery: "South Efate Presbytery",
      island: "Efate",
      province: "Shefa",
      pastorId: pastorRows[0].id,
      latitude: -17.7333,
      longitude: 168.3167,
      memberCount: 520,
      serviceTimes: "Sunday 10:00 AM, Wednesday 6:00 PM",
      tags: JSON.stringify(["PWMU", "Youth Fellowship", "Sunday School"]),
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Lenakel Presbyterian Church",
      areaCouncil: "Tanna South Area Council",
      sessionName: "Lenakel Session",
      presbytery: "Tanna Presbytery",
      island: "Tanna",
      province: "Tafea",
      pastorId: pastorRows[2].id,
      latitude: -19.5333,
      longitude: 169.2667,
      memberCount: 380,
      serviceTimes: "Sunday 8:30 AM",
      tags: JSON.stringify(["PWMU", "Men's Fellowship"]),
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Luganville Presbyterian Church",
      areaCouncil: "Santo Area Council",
      sessionName: "Luganville Session",
      presbytery: "Santo Presbytery",
      island: "Espiritu Santo",
      province: "Sanma",
      pastorId: null,
      latitude: -15.5167,
      longitude: 167.1667,
      memberCount: 310,
      serviceTimes: "Sunday 9:30 AM",
      tags: JSON.stringify(["PWMU", "Sunday School"]),
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await db.insert(events).values([
    {
      title: "Presbytery Synod Meeting",
      description: "Annual synod gathering for North Efate Presbytery",
      startDate: "2026-06-20",
      endDate: "2026-06-22",
      category: "Synod",
      province: "Shefa",
      churchId: 2,
      createdAt: now,
    },
    {
      title: "Youth Fellowship Camp",
      description: "National youth camp at Port Vila",
      startDate: "2026-07-15",
      endDate: "2026-07-20",
      category: "Youth",
      province: "Shefa",
      churchId: 2,
      createdAt: now,
    },
    {
      title: "PWMU Annual Conference",
      description: "Presbyterian Women's Missionary Union conference",
      startDate: "2026-08-05",
      category: "PWMU",
      province: "Tafea",
      churchId: 3,
      createdAt: now,
    },
  ]);

  await db.insert(newsArticles).values([
    {
      title: "PCV Welcomes New Moderator",
      summary:
        "The Presbyterian Church of Vanuatu announces the appointment of a new Moderator for the 2026–2028 term.",
      content:
        "The General Assembly of the Presbyterian Church of Vanuatu has elected a new Moderator to serve the church for the next biennium. The appointment reflects the church's commitment to spiritual leadership across all presbyteries and islands.\n\nThe new Moderator will focus on strengthening congregational life, supporting pastors, and advancing the mission of the church throughout Vanuatu.",
      status: "published",
      publishedAt: "2026-05-28T10:00:00.000Z",
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Workflow Smoke Publish Test",
      summary:
        "A test media release confirming the PCV communications workflow is operational.",
      content:
        "This media release was published as part of a workflow verification test. The PCV communications team confirms that the publishing pipeline is working correctly.",
      status: "published",
      publishedAt: "2026-05-28T14:30:00.000Z",
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Tanna Presbytery Outreach Report",
      summary:
        "Summary of recent outreach activities across Tanna island congregations.",
      content:
        "Pastors and elders across the Tanna Presbytery have completed a series of outreach visits to remote congregations. Reports indicate growing participation in Sunday School and youth programs.",
      status: "published",
      publishedAt: "2026-05-15T09:00:00.000Z",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await db.insert(churchPrograms).values([
    {
      title: "Presbyterian Women's Missionary Union (PWMU)",
      description:
        "Supporting women in mission, fellowship, and service across all PCV congregations.",
      category: "Fellowship",
      createdAt: now,
    },
    {
      title: "Men's Fellowship",
      description:
        "Brotherhood gatherings for spiritual growth, community service, and leadership development.",
      category: "Fellowship",
      createdAt: now,
    },
    {
      title: "Sunday School",
      description:
        "Christian education program for children and youth in every congregation.",
      category: "Education",
      createdAt: now,
    },
    {
      title: "Youth Fellowship",
      description:
        "Programs engaging young people in faith, leadership, and community outreach.",
      category: "Youth",
      createdAt: now,
    },
  ]);

  console.log("Seed complete.");
  console.log("Staff login: admin@pcv.vu / admin123");
}

seed().catch(console.error);
