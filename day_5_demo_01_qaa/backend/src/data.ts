export interface Event {
  id: number
  title: string
  date: string
  location: string
  category: 'show' | 'trail' | 'clinic' | 'grooming'
  description: string
  spotsTotal: number
  spotsRegistered: number
  isActive: boolean
}

export interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  joinedAt: string
  isActive: boolean
  eventsCount: number
}

export const STAFF_ROLES = ['Stable Manager', 'Groom', 'Rider', 'Farrier', 'Photographer']

const seedEvents: Event[] = [
  {
    id: 1,
    title: 'Moonlit Midnight Ride',
    date: '2025-02-15',
    location: 'Enchanted Stables, North Paddock',
    category: 'trail',
    description: 'An after-dark trail ride through the moonlit grounds. Lanterns provided, hot chocolate at the finish.',
    spotsTotal: 12,
    spotsRegistered: 9,
    isActive: true,
  },
  {
    id: 2,
    title: 'Spring Foal Showcase',
    date: '2025-03-08',
    location: 'Main Arena, Enchanted Stables',
    category: 'show',
    description: 'Meet the newest arrivals and watch them trot for the first time in the main arena. Family-friendly event.',
    spotsTotal: 80,
    spotsRegistered: 55,
    isActive: true,
  },
  {
    id: 3,
    title: 'Bridle & Saddle Clinic',
    date: '2025-03-15',
    location: 'Tack Room & Training Ring',
    category: 'clinic',
    description: 'Hands-on half-day clinic covering correct fitting, maintenance, and safety checks for bridles and saddles.',
    spotsTotal: 20,
    spotsRegistered: 14,
    isActive: true,
  },
  {
    id: 4,
    title: 'Young Riders Camp',
    date: '2025-03-22',
    location: 'Enchanted Stables — all arenas',
    category: 'clinic',
    description: 'Three-day introduction to riding for ages 8–14. Includes grooming, tacking up, and basic dressage moves.',
    spotsTotal: 15,
    spotsRegistered: 6,
    isActive: true,
  },
  {
    id: 5,
    title: 'Enchanted Trail Challenge',
    date: '2025-04-05',
    location: 'Forest Trail, South Paddock',
    category: 'trail',
    description: 'A timed 8km trail ride with natural obstacles. Open to intermediate riders and above. Prizes for top three.',
    spotsTotal: 30,
    spotsRegistered: 21,
    isActive: true,
  },
  {
    id: 6,
    title: 'Summer Dressage Cup',
    date: '2025-04-12',
    location: 'Grand Arena, Enchanted Stables',
    category: 'show',
    description: 'Annual dressage competition across three divisions: introductory, prelim, and novice. Judges from the regional federation.',
    spotsTotal: 100,
    spotsRegistered: 100,
    isActive: true,
  },
  {
    id: 7,
    title: 'Grooming & Care Day',
    date: '2025-05-10',
    location: 'Stable Block A & B',
    category: 'grooming',
    description: 'Open stable day — learn coat care, hoof picking, mane braiding, and how to spot early signs of illness.',
    spotsTotal: 25,
    spotsRegistered: 18,
    isActive: true,
  },
  {
    id: 8,
    title: 'Winter Stable Ball',
    date: '2025-05-24',
    location: 'The Old Barn, Enchanted Stables',
    category: 'show',
    description: 'End-of-season celebration with awards, a buffet, and a guided tour of the winter quarters by lantern light.',
    spotsTotal: 60,
    spotsRegistered: 43,
    isActive: true,
  },
]

const seedStaff: StaffMember[] = [
  { id: 1,  name: 'Elara Moss',     email: 'elara.moss@enchantedstables.com',     role: 'Stable Manager', joinedAt: '2023-01-15', isActive: true, eventsCount: 8  },
  { id: 2,  name: 'Finn Archer',    email: 'finn.archer@enchantedstables.com',    role: 'Rider',          joinedAt: '2023-03-20', isActive: true, eventsCount: 5  },
  { id: 3,  name: 'Rowan Blake',    email: 'rowan.blake@enchantedstables.com',    role: 'Groom',          joinedAt: '2022-09-10', isActive: true, eventsCount: 12 },
  { id: 4,  name: 'Seren Vale',     email: 'seren.vale@enchantedstables.com',     role: 'Stable Manager', joinedAt: '2024-01-05', isActive: true, eventsCount: 3  },
  { id: 5,  name: 'Orion Thorn',    email: 'orion.thorn@enchantedstables.com',    role: 'Groom',          joinedAt: '2023-06-18', isActive: true, eventsCount: 7  },
  { id: 6,  name: 'Lyra Quinn',     email: 'lyra.quinn@enchantedstables.com',     role: 'Rider',          joinedAt: '2024-02-28', isActive: true, eventsCount: 2  },
  { id: 7,  name: 'Caspian Reed',   email: 'caspian.reed@enchantedstables.com',   role: 'Farrier',        joinedAt: '2022-11-03', isActive: true, eventsCount: 9  },
  { id: 8,  name: 'Wren Dalton',    email: 'wren.dalton@enchantedstables.com',    role: 'Photographer',   joinedAt: '2023-08-14', isActive: true, eventsCount: 4  },
  { id: 9,  name: 'Hazel Storm',    email: 'hazel.storm@enchantedstables.com',    role: 'Groom',          joinedAt: '2023-04-22', isActive: true, eventsCount: 6  },
  { id: 10, name: 'Zephyr Cross',   email: 'zephyr.cross@enchantedstables.com',   role: 'Farrier',        joinedAt: '2022-07-30', isActive: true, eventsCount: 11 },
]

// Use a single mutable object so routes can mutate properties without
// hitting ESM namespace read-only restrictions in vitest.
export const store = {
  events: seedEvents.map(e => ({ ...e })),
  staff: seedStaff.map(s => ({ ...s })),
  nextEventId: seedEvents.length + 1,
  nextStaffId: seedStaff.length + 1,
}

export function resetStore(): void {
  store.events = seedEvents.map(e => ({ ...e }))
  store.staff = seedStaff.map(s => ({ ...s }))
  store.nextEventId = seedEvents.length + 1
  store.nextStaffId = seedStaff.length + 1
}
