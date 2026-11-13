/* S8 Overdue invoice — Flow 2 · Steps 2–3 */
TD.screens.s8 = {
  name: 'Overdue invoice',
  meta: function () { return { flow: 2, nav: 'overdue' }; },
  inv: function (S) { return TD.store.get(S.current) || S.overdue[0]; },
  render: function (S) {
    var u = TD.ui, e = u.esc, x = this.inv(S), c = TD.store.client(x.client) || {}, today = TD.app.today;
    var paid = x.status === 'paid', total = u.totals(u.latest(x)).total, f = x.followups;
    return u.head({ title: '<span class="mono s8-no">' + e(x.no) + '</span>', sub: e(x.client) + ' · ' + u.eur(total) + (paid ? ' · paid' : ' · overdue'),
        actions: '<button type="button" class="btn" data-act="paid"' + (paid ? ' disabled' : '') + '>Mark as paid</button>' }) +
      '<div class="s8-cols"><div class="s8-col">' +
        '<section class="panel"><div><h2>Invoice</h2></div><dl class="kv">' +
          '<dt>Client</dt><dd>' + e(x.client) + (c.contact ? ' · ' + e(c.contact) : '') + '</dd>' +
          '<dt>Sent to</dt><dd><span class="mono s8-mail">' + e(x.to) + '</span></dd>' +
          '<dt>Total</dt><dd><b>' + u.eur(total) + '</b></dd>' +
          '<dt>Issued</dt><dd>' + u.fmtD(x.issued) + '</dd>' +
          '<dt>Due</dt><dd>' + u.fmtD(x.due) + ' · ' + u.daysBetween(x.due, today) + ' days ago</dd>' +
          '<dt>Status</dt><dd>' + (paid ? u.pill('green', 'Paid') : u.pill('amber', 'Overdue')) + '</dd></dl></section>' +
        '<section class="panel"><div><h2>Did it reach the right person, and was it seen?</h2></div>' +
          '<div class="s8-tiles"><div class="tile"><span class="tile-label">Right person</span>' + (x.delivery.right === 'yes' ? u.pill('green', 'Yes') : u.pill('amber', 'Not confirmed')) + '</div>' +
          '<div class="tile"><span class="tile-label">Seen</span>' + (x.delivery.seen === 'yes' ? u.pill('green', 'Seen') : u.pill('amber', 'Not seen')) + '</div></div>' +
          '<div class="s8-wrong"><span>Wrong contact?</span><button type="button" class="btn btn-sm btn-ghost" data-act="contact">Correct contact</button></div></section>' +
      '</div>' +
      '<section class="panel"><div><h2>Activity</h2></div>' + u.activity(x.log) +
        '<div class="s8-fu">' + (f.length ? f.length + (f.length === 1 ? ' follow-up' : ' follow-ups') + ' sent · last ' + u.fmtD(f[f.length - 1]) + '.' : 'No follow-up sent yet.') + '</div></section></div>' +
      '<div class="foot"><button type="button" class="btn" data-act="back">Back to overdue list</button>' +
        '<button type="button" class="btn btn-pri" data-act="follow"' + (paid ? ' disabled' : '') + '>Send follow-up</button></div>';
  },
  bind: function (root, S) {
    var x = this.inv(S); S.current = x.no;
    root.querySelector('[data-act="paid"]').addEventListener('click', function () { TD.app.go('s10'); });
    root.querySelector('[data-act="contact"]').addEventListener('click', function () { TD.app.go('s9', { focus: 's9-to' }); });
    root.querySelector('[data-act="back"]').addEventListener('click', function () { TD.app.go('s7'); });
    root.querySelector('[data-act="follow"]').addEventListener('click', function () { TD.app.go('s9'); });
  }
};
