/* S3 Check before sending — Flow 1 · Steps 3–4 */
TD.screens.s3 = {
  name: 'Check the invoice',
  meta: function () { return { flow: 1, nav: 'invoices' }; },
  render: function (S) {
    var u = TD.ui, e = u.esc, I = S.inv, c = TD.store.client(I.client) || {};
    var rows = [], missing = 0;
    rows.push(this.row(c.email ? u.pill('green', 'OK', true) : u.pill('amber', 'Missing', true),
      'Billing contact', c.email ? e(c.email) : 'No billing contact', ''));
    if (!c.email) missing++;
    if (c.needsOrderNumber) {
      var has = String(I.ref).trim();
      if (!has) missing++;
      rows.push(this.row(has ? u.pill('green', 'OK', true) : u.pill('amber', 'Missing', true), 'Client order number',
        has ? e(I.ref) : e(c.name) + ' asks for an order number on every invoice',
        has ? '' : '<div><button type="button" class="btn btn-sm" data-act="fix">Fix</button></div>'));
    }
    rows.push(this.row(u.pill('grey', 'Not checked', true), 'Matches what was agreed', 'Items and prices compared with the agreement', ''));
    var banner = missing
      ? '<div class="s3-banner s3-warn">' + missing + (missing === 1 ? ' thing is' : ' things are') + ' missing. Fix it before you send.</div>'
      : '<div class="s3-banner s3-ok">Nothing is missing.</div>';
    return u.head({ title: 'Check the invoice', sub: e(I.no) + ' · ' + e(I.client || 'No client yet'),
        actions: '<button type="button" class="btn" data-act="draft">Save as draft</button>' }) +
      u.steps(3) +
      '<div class="s3-cols">' +
        '<section class="panel"><div><h2>Invoice as the client will see it</h2></div>' + u.paper(I) + '</section>' +
        '<section class="panel"><div><h2>Check before sending</h2><div class="panel-sub">Against what was agreed and what the client needs</div></div>' +
          banner + '<div>' + rows.join('') + '</div></section></div>' +
      '<div class="foot"><button type="button" class="btn" data-act="back">Back</button>' +
        '<button type="button" class="btn btn-pri" data-act="next">Next: send</button></div>';
  },
  row: function (badge, title, text, action) {
    return '<div class="s3-row">' + badge + '<div class="wrap"><b>' + title + '</b><div class="s3-text">' + text + '</div></div>' + (action || '<span></span>') + '</div>';
  },
  bind: function (root) {
    var fix = root.querySelector('[data-act="fix"]');
    if (fix) fix.addEventListener('click', function () { TD.app.go('s1', { focus: 's1-ref' }); });   // guess: the order number goes in "Your reference"
    root.querySelector('[data-act="draft"]').addEventListener('click', function () { TD.app.save(); TD.app.toast('Saved as draft'); });
    root.querySelector('[data-act="back"]').addEventListener('click', function () { TD.app.go('s2'); });
    root.querySelector('[data-act="next"]').addEventListener('click', function () { TD.app.go('s4'); });
  }
};
