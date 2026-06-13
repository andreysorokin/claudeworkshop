export interface Event {
  id: number
  title: string
  date: string
  location: string
  category: 'fundraising' | 'awareness' | 'community' | 'training'
  description: string
  spotsTotal: number
  spotsRegistered: number
  isActive: boolean
}

export interface Volunteer {
  id: number
  name: string
  email: string
  role: string
  joinedAt: string
  isActive: boolean
  eventsCount: number
}

export const VOLUNTEER_ROLES = ['Coordinator', 'Support', 'Driver', 'Medic', 'Photographer']

const seedEvents: Event[] = [
  {
    id: 1,
    title: 'Winter Fundraising Gala',
    date: '2025-02-15',
    location: 'The Grand Ballroom, London',
    category: 'fundraising',
    description: 'An elegant evening celebrating our supporters and raising funds for critical research programmes. Includes dinner, live music, and a charity auction.',
    spotsTotal: 200,
    spotsRegistered: 145,
    isActive: true,
  },
  {
    id: 2,
    title: 'Community Blood Donation Drive',
    date: '2025-03-08',
    location: 'City Community Centre, Manchester',
    category: 'awareness',
    description: 'Help save lives by donating blood. Every donation can help up to three patients. Walk-ins welcome, appointments preferred.',
    spotsTotal: 50,
    spotsRegistered: 38,
    isActive: true,
  },
  {
    id: 3,
    title: 'Community Kitchen Day',
    date: '2025-03-15',
    location: "St. Mary's Hall, Bristol",
    category: 'community',
    description: 'A day of cooking and sharing meals with local families in need. Volunteers will help prepare, serve, and clean up.',
    spotsTotal: 30,
    spotsRegistered: 22,
    isActive: true,
  },
  {
    id: 4,
    title: 'Volunteer Induction Training',
    date: '2025-03-22',
    location: 'Online — Zoom',
    category: 'training',
    description: 'Mandatory induction session for all new volunteers. Covers safeguarding, data protection, and our code of conduct.',
    spotsTotal: 40,
    spotsRegistered: 12,
    isActive: true,
  },
  {
    id: 5,
    title: 'Spring Awareness Walk',
    date: '2025-04-05',
    location: 'Hyde Park, London',
    category: 'awareness',
    description: 'A sponsored 5km walk through Hyde Park to raise awareness and funds. All abilities welcome — bring the family!',
    spotsTotal: 150,
    spotsRegistered: 67,
    isActive: true,
  },
  {
    id: 6,
    title: 'First Aid Skills Workshop',
    date: '2025-04-12',
    location: 'The Hub, Birmingham',
    category: 'training',
    description: 'Half-day practical workshop covering CPR, wound care, and emergency response. Certificate awarded on completion.',
    spotsTotal: 20,
    spotsRegistered: 20,
    isActive: true,
  },
  {
    id: 7,
    title: 'Annual Supporter Appreciation Evening',
    date: '2025-05-10',
    location: 'Riverside Venue, Leeds',
    category: 'fundraising',
    description: 'An evening to thank our long-term supporters and volunteers. Includes presentations, awards, and a reception.',
    spotsTotal: 100,
    spotsRegistered: 89,
    isActive: true,
  },
  {
    id: 8,
    title: 'Youth Outreach Day',
    date: '2025-05-24',
    location: 'Northside Community Park, Sheffield',
    category: 'community',
    description: 'Engaging young people in the community with activities, workshops, and information about volunteering opportunities.',
    spotsTotal: 60,
    spotsRegistered: 45,
    isActive: true,
  },
]

const seedVolunteers: Volunteer[] = [
  { id: 1,  name: 'Sarah Chen',     email: 'sarah.chen@example.com',     role: 'Coordinator',  joinedAt: '2023-01-15', isActive: true, eventsCount: 8  },
  { id: 2,  name: 'James Okafor',  email: 'james.okafor@example.com',   role: 'Driver',       joinedAt: '2023-03-20', isActive: true, eventsCount: 5  },
  { id: 3,  name: 'Maya Patel',    email: 'maya.patel@example.com',     role: 'Support',      joinedAt: '2022-09-10', isActive: true, eventsCount: 12 },
  { id: 4,  name: 'Tom Williams',  email: 'tom.williams@example.com',   role: 'Coordinator',  joinedAt: '2024-01-05', isActive: true, eventsCount: 3  },
  { id: 5,  name: 'Aisha Hassan',  email: 'aisha.hassan@example.com',   role: 'Support',      joinedAt: '2023-06-18', isActive: true, eventsCount: 7  },
  { id: 6,  name: 'Liam Murphy',   email: 'liam.murphy@example.com',    role: 'Driver',       joinedAt: '2024-02-28', isActive: true, eventsCount: 2  },
  { id: 7,  name: 'Priya Singh',   email: 'priya.singh@example.com',    role: 'Coordinator',  joinedAt: '2022-11-03', isActive: true, eventsCount: 9  },
  { id: 8,  name: 'Daniel Kim',    email: 'daniel.kim@example.com',     role: 'Photographer', joinedAt: '2023-08-14', isActive: true, eventsCount: 4  },
  { id: 9,  name: 'Emma Thompson', email: 'emma.thompson@example.com',  role: 'Support',      joinedAt: '2023-04-22', isActive: true, eventsCount: 6  },
  { id: 10, name: 'Carlos Rivera', email: 'carlos.rivera@example.com',  role: 'Medic',        joinedAt: '2022-07-30', isActive: true, eventsCount: 11 },
]

// Use a single mutable object so routes can mutate properties without
// hitting ESM namespace read-only restrictions in vitest.
export const store = {
  events: seedEvents.map(e => ({ ...e })),
  volunteers: seedVolunteers.map(v => ({ ...v })),
  nextEventId: seedEvents.length + 1,
  nextVolunteerId: seedVolunteers.length + 1,
}

export function resetStore(): void {
  store.events = seedEvents.map(e => ({ ...e }))
  store.volunteers = seedVolunteers.map(v => ({ ...v }))
  store.nextEventId = seedEvents.length + 1
  store.nextVolunteerId = seedVolunteers.length + 1
}
