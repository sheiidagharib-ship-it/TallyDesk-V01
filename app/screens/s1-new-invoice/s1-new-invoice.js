/* S1 New invoice — Flow 1 · Step 1 */
TD.screens.s1 = {
  name: 'New invoice',
  meta: function () { return { flow: 1, nav: 'invoices' }; },
  dueHint: function (I) {
    var d = TD.ui.due(I);
    return '7, 14 or 30 days' + (d ? ' · due ' + TD.ui.fmtD(d) : '');
  },
  render: function (S) {
    var u = TD.ui, e = u.esc, I = S.inv;
    var terms = '<option value=""' + (I.terms ? '' : ' selected') + '></option>' + TD.DATA.terms.map(function (t) {
      return '<option value="' + t + '"' + (String(I.terms) === String(t) ? ' selected' : '') + '>' + t + ' days</option>'; }).join('');
    var cards = TD.DATA.clients.map(function (c) {
      var sel = I.client === c.name;
      return '<button type="button" class="s1-card' + (sel ? ' is-sel' : '') + '" data-client="' + e(c.name) + '" aria-pressed="' + sel + '">' +
        '<b>' + e(c.name) + '</b><span class="s1-contact">' + e(c.contact) + '</span><span class="mono s1-email">' + e(c.email) + '</span>' +
        (sel ? u.pill('teal', 'Selected') : '') + '</button>'; }).join('');
    return u.head({ title: 'New invoice', sub: 'For a client you finished work for',
        actions: '<button type="button" class="btn" data-act="draft">Save as draft</button>' }) +
      u.steps(1) +
      '<div class="s1-cols">' +
        '<section class="panel"><div><h2>Invoice details</h2></div><div class="s1-fields">' +
          '<label class="field" for="s1-no">Invoice number<input id="s1-no" class="input mono" value="' + e(I.no) + '" readonly><span class="hint">Set by the app</span></label>' +
          '<label class="field" for="s1-ref">Your reference<input id="s1-ref" class="input" data-k="ref" value="' + e(I.ref) + '" placeholder="e.g. Project name"></label>' +
          '<label class="field" for="s1-iss">Issue date<input id="s1-iss" type="date" class="input" data-k="issued" value="' + e(I.issued) + '"></label>' +
          '<label class="field" for="s1-terms">Payment terms<select id="s1-terms" class="input" data-k="terms">' + terms + '</select><span class="hint" id="s1-due">' + this.dueHint(I) + '</span></label>' +
        '</div></section>' +
        '<section class="panel"><div><h2>Who is this invoice for?</h2><div class="panel-sub">Pick a client or add a new one</div></div>' +
          '<div class="s1-cards">' + cards +
          '<button type="button" class="s1-card s1-add" data-act="add-client"><b>+ Add a new client</b><span class="s1-contact">Name, contact, email, address</span></button></div>' +
        '</section></div>' +
      '<div class="foot"><button type="button" class="btn" disabled>Back</button>' +
      '<button type="button" class="btn btn-pri" data-act="next"' + (I.client ? '' : ' disabled') + '>Next: items</button></div>';
  },
  bind: function (root, S) {
    var I = S.inv, self = this;
    root.querySelectorAll('[data-k]').forEach(function (el) {
      el.addEventListener('input', function () {
        I[el.getAttribute('data-k')] = el.value;
        document.getElementById('s1-due').textContent = self.dueHint(I);
        TD.app.save();
      });
    });
    root.querySelectorAll('[data-client]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = TD.store.client(b.getAttribute('data-client'));
        I.client = c.name; I.to = c.email; I.subject = ''; I.msg = '';   // email is filled in again for the new client (K15)
        TD.app.save(); TD.app.render();
      });
    });
    root.querySelector('[data-act="draft"]').addEventListener('click', function () { TD.app.save(); TD.app.toast('Saved as draft'); });
    root.querySelector('[data-act="next"]').addEventListener('click', function () { TD.app.go('s2'); });
    // "+ Add a new client": no wireframe for the client form yet, so it does nothing.
  }
};
