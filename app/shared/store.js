/* Keeps everything the person typed or chose in the browser (localStorage). */
window.TD = window.TD || {};
TD.store = (function () {
  var KEY = 'tallydesk-prototype-v1';
  var copy = function (o) { return JSON.parse(JSON.stringify(o)); };
  function newInvoice(no) {
    return { no: no, ref: '', issued: '', terms: '', client: null,
      items: [{ d: '', q: '', p: '' }], tax: '', disc: '',
      to: '', subject: '', msg: '', status: 'draft', sentOn: null,
      delivery: null, log: [], corrections: [] };
  }
  function fresh() {
    return {
      inv: newInvoice(TD.DATA.nextNumber),
      overdue: TD.DATA.overdue.map(function (o) {
        var x = copy(o); x.status = 'overdue'; x.sentOn = x.issued; x.corrections = []; return x;
      }),
      current: TD.DATA.overdue[0].no,   // overdue invoice being followed up
      corr: null,                       // correction being made
      fu: null                          // follow-up being written
    };
  }
  var api = {
    state: null,
    load: function () {
      try { api.state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { api.state = null; }
      if (!api.state || !api.state.inv) api.state = fresh();
      return api.state;
    },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(api.state)); } catch (e) {} },
    reset: function () { api.state = fresh(); api.save(); },
    newInvoice: newInvoice,
    // 'draft' = the freelancer's invoice (Flow 1); otherwise an overdue invoice number
    get: function (ref) {
      var S = api.state;
      if (ref === 'draft') return S.inv;
      return S.overdue.filter(function (o) { return o.no === ref; })[0] || null;
    },
    client: function (name) {
      return TD.DATA.clients.filter(function (c) { return c.name === name; })[0] || null;
    },
    copy: copy
  };
  return api;
})();
