// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6422s',
    name: 'Ty',
    email: 'ty@nextmail.com',
    password: '654321'
  }
];

const tenants = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/tenants/evil-rabbit.png',
    phone: '123-456-7890'
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/tenants/delba-de-oliveira.png',
    phone: '123-456-7891'
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/tenants/lee-robinson.png',
    phone: '123-456-7892'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/tenants/michael-novotny.png',
    phone: '123-456-7893'
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/tenants/amy-burns.png',
    phone: '123-456-7894'
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/tenants/balazs-orban.png',
    phone: '123-456-7895'
  },
  {
    id: '9a34db75-b79d-488e-b7ca-e800cd02adcd',
    name: 'Keanu Ribz',
    email: 'ribz@keanu.com',
    image_url: '/tenants/keanu_ribz.jpeg',
    phone: '123-456-7896'
  },
  {
    id: '27c73752-c502-4045-a989-24e2966d5df0',
    name: 'Roy Kip',
    email: 'roy@kip.com',
    image_url: '/tenants/roykip.jpeg',
    phone: '123-456-7897'
  },
];

const invoices = [
  {
    id: '1',
    tenant_id: tenants[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
    name: tenants[0].name,
    image_url: tenants[0].image_url,
    phone: tenants[0].phone,
    email: tenants[0].email
  },
  {
    id: '2',
    tenant_id: tenants[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
    name: tenants[1].name,
    image_url: tenants[1].image_url,
    phone: tenants[1].phone,
    email: tenants[1].email
  },
  {
    id: '3',
    tenant_id: tenants[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
    name: tenants[4].name,
    image_url: tenants[4].image_url,
    phone: tenants[4].phone,
    email: tenants[4].email
  },
  {
    id: '4',
    tenant_id: tenants[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
    name: tenants[3].name,
    image_url: tenants[3].image_url,
    phone: tenants[3].phone,
    email: tenants[3].email
  },
  {
    id: '5',
    tenant_id: tenants[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
    name: tenants[5].name,
    image_url: tenants[5].image_url,
    phone: tenants[5].phone,
    email: tenants[5].email
  },
  {
    id: '6',
    tenant_id: tenants[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
    name: tenants[2].name,
    image_url: tenants[2].image_url,
    phone: tenants[2].phone,
    email: tenants[2].email
  },
  {
    id: '7',
    tenant_id: tenants[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
    name: tenants[0].name,
    image_url: tenants[0].image_url,
    phone: tenants[0].phone,
    email: tenants[0].email
  },
  {
    id: '8',
    tenant_id: tenants[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
    name: tenants[3].name,
    image_url: tenants[3].image_url,
    phone: tenants[3].phone,
    email: tenants[3].email
  },
  {
    id: '9',
    tenant_id: tenants[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
    name: tenants[4].name,
    image_url: tenants[4].image_url,
    phone: tenants[4].phone,
    email: tenants[4].email
  },
  {
    id: '10',
    tenant_id: tenants[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
    name: tenants[5].name,
    image_url: tenants[5].image_url,
    phone: tenants[5].phone,
    email: tenants[5].email
  },
  {
    id: '11',
    tenant_id: tenants[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
    name: tenants[1].name,
    image_url: tenants[1].image_url,
    phone: tenants[1].phone,
    email: tenants[1].email
  },
  {
    id: '12',
    tenant_id: tenants[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
    name: tenants[5].name,
    image_url: tenants[5].image_url,
    phone: tenants[5].phone,
    email: tenants[5].email
  },
  {
    id: '13',
    tenant_id: tenants[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
    name: tenants[2].name,
    image_url: tenants[2].image_url,
    phone: tenants[2].phone,
    email: tenants[2].email
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 8000 },
];

export { users, tenants, invoices, revenue };