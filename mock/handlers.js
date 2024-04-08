const { http, HttpResponse }  = require('msw');

let totalAmount = 0;

const handlers = [ 

  http.get('http://localhost:3001/payments', async ({ request, params }) => {
    
    return HttpResponse.json({ "totalAmount": totalAmount })

  }),

  http.post('http://localhost:3001/payments', async ({ request, params }) => {
    const { id } = params
    const body = await request.json()
    totalAmount += Number(body.amount);

    return HttpResponse.json({ "totalAmount": totalAmount })

  })
];

module.exports = handlers;