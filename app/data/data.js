/* Tally Desk — example data in one place. Change names and numbers here.
   From demo.html / wireframes: clients, INV-0042, INV-0043, today's date.
   Made up for this prototype (look-real examples): see "made up" below. */
window.TD = window.TD || {};
TD.DATA = {
  today: '2026-10-30',                       // demo.html: today is 30 Oct 2026
  nextNumber: 'INV-0043',                    // demo.html (K11: set by the app)
  terms: [7, 14, 30],                        // K12
  sender: { name: 'Mina Design', email: 'mina@minadesign.example', first: 'Mina' },
  users: {
    flow1: { initial: 'M', name: 'Mina', role: 'Freelance designer' },
    flow2: { initial: 'O', name: 'Office manager', role: 'Small company' }
  },
  clients: [                                  // demo.html
    { name: 'Studio Lumen',    contact: 'Sara Okafor', email: 'accounts@studiolumen.example', needsOrderNumber: true },  // order number: wireframe S3 (sample data)
    { name: 'Northwind Books', contact: 'Tom Reyes',   email: 'tom@northwindbooks.example',   needsOrderNumber: false },
    { name: 'Kite & Co',       contact: 'Lea Brandt',  email: 'billing@kiteco.example',       needsOrderNumber: false }
  ],
  // After sending, delivery shows this until the app knows more (wireframe S5, sample data)
  newDelivery: { right: 'unconfirmed', seen: 'no' },
  // Overdue invoices of the small company (Flow 2). INV-0042 from demo.html; the rest made up.
  overdue: [
    { no: 'INV-0042', client: 'Northwind Books', to: 'tom@northwindbooks.example',
      issued: '2026-10-02', due: '2026-10-16',
      items: [{ d: 'Book cover design', q: '1', p: '700' }], tax: '20', disc: '0',          // items made up; total €840 from demo.html
      delivery: { right: 'yes', seen: 'yes' }, followups: [],
      log: [ { t: 'Invoice created', d: '2026-10-02' },
             { t: 'Payment is late. No reminder sent yet.', d: '2026-10-17', warn: true } ] },
    { no: 'INV-0038', client: 'Kite & Co', to: 'billing@kiteco.example',                    // made up
      issued: '2026-09-25', due: '2026-10-09',
      items: [{ d: 'App screens translation (words)', q: '7000', p: '0.16' }], tax: '0', disc: '0',
      delivery: { right: 'unconfirmed', seen: 'no' }, followups: ['2026-10-20'],
      log: [ { t: 'Invoice created', d: '2026-09-25' },
             { t: 'Payment is late. No reminder sent yet.', d: '2026-10-10', warn: true },
             { t: 'Follow-up sent to billing@kiteco.example', d: '2026-10-20' } ] },
    { no: 'INV-0036', client: 'Studio Lumen', to: 'accounts@studiolumen.example',          // made up
      issued: '2026-09-02', due: '2026-10-02',
      items: [{ d: 'Website development (hours)', q: '23', p: '100' }], tax: '0', disc: '0',
      delivery: { right: 'yes', seen: 'yes' }, followups: ['2026-10-09', '2026-10-23'],
      log: [ { t: 'Invoice created', d: '2026-09-02' },
             { t: 'Payment is late. No reminder sent yet.', d: '2026-10-03', warn: true },
             { t: 'Follow-up sent to accounts@studiolumen.example', d: '2026-10-09' },
             { t: 'Follow-up sent to accounts@studiolumen.example', d: '2026-10-23' } ] }
  ]
};
