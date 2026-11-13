/* S5 Delivery status — Flow 1 · Step 6 (and the way into Step 7) */
TD.screens.s5 = {
  name: 'Delivery status',
  meta: function () { return { flow: 1, nav: 'invoices' }; },
  render: function (S) {
    var u = TD.ui, e = u.esc, I = S.inv, d = I.delivery || TD.DATA.newDelivery, paid = I.status === 'paid';
    var total = u.totals(u.latest(I)).total;
    var right = d.right === 'yes' ? u.pill('green', 'Yes') : u.pill('amber', 'Not confirmed');
    var seen = d.seen === 'yes' ? u.pill('green', 'Seen') : u.pill('amber', 'Not seen yet');
    var status = paid ? u.pill('green', 'Paid') : (I.status === 'sent' ? u.pill('teal', 'Sent') : u.pill('grey', 'Draft'));
    return u.head({ title: e(I.no), sub: e(I.client || 'No client yet') + (paid ? ' · paid' : ' · waiting for payment'),
        actions: '<button type="button" class="btn" data-act="paid"' + (paid ? ' disabled' : '') + '>Mark as paid</button>' }) +
      '<div class="s5-cols"><div class="s5-col">' +
        '<section class="panel"><div><h2>Did it reach the right person?</h2><div class="panel-sub wrap">Sent to ' + e(I.to || '—') + '</div></div>' +
          '<div class="s5-tiles">' +
            '<div class="tile"><span class="tile-label">Sent</span>' + u.pill('teal', I.sentOn ? 'Sent ' + u.fmtD(I.sentOn) : 'Not sent') + '</div>' +
            '<div class="tile"><span class="tile-label">Reached the right person</span>' + right + '</div>' +
            '<div class="tile"><span class="tile-label">Seen by the client</span>' + seen + '</div></div>' +
          '<div class="s5-resend"><span>Not seen? Check the contact and send again.</span>' +
            '<button type="button" class="btn btn-pri" data-act="resend">Correct contact and resend</button></div></section>' +
        '<section class="panel"><div><h2>Found a mistake after sending?</h2><div class="panel-sub">A sent invoice can’t be edited. Make a correction that keeps the history.</div></div>' +
          '<div><button type="button" class="btn btn-ghost" data-act="correct">Make a correction</button></div></section>' +
      '</div>' +
      '<section class="panel"><div><h2>Activity</h2></div>' + u.activity(I.log) +
        '<dl class="kv"><dt>Total</dt><dd><b>' + u.eur(total) + '</b></dd><dt>Due</dt><dd>' + u.fmtD(u.due(I)) + '</dd><dt>Status</dt><dd>' + status + '</dd></dl>' +
      '</section></div>';
  },
  bind: function (root, S) {
    var I = S.inv;
    var paid = root.querySelector('[data-act="paid"]');
    TD.app.once(paid, function () {               // K19: marked as paid by hand
      I.status = 'paid'; I.log.push({ t: 'Marked as paid', d: TD.app.today }); TD.app.save(); TD.app.render();
    });
    root.querySelector('[data-act="resend"]').addEventListener('click', function () { TD.app.go('s4', { focus: 's4-to' }); });
    root.querySelector('[data-act="correct"]').addEventListener('click', function () {
      var v = TD.ui.latest(I);
      S.corr = { target: 'draft', flow: 1, ret: 's5', back: 's5', items: TD.store.copy(v.items), tax: v.tax, disc: v.disc, note: '' };
      TD.app.go('s2');
    });
  }
};
