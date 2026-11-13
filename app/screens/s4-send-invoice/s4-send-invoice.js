/* S4 Send invoice — Flow 1 · Step 5 */
TD.screens.s4 = {
  name: 'Send the invoice',
  meta: function () { return { flow: 1, nav: 'invoices' }; },
  fill: function (I) {   // K15: To, Subject and Message are filled in for you
    var c = TD.store.client(I.client) || {}, me = TD.DATA.sender.first;
    if (!I.to) I.to = c.email || '';
    if (!I.subject) I.subject = 'Invoice ' + I.no + ' from ' + me;
    if (!I.msg) I.msg = 'Hi ' + (c.contact ? c.contact.split(' ')[0] : 'there') + ',\n\nPlease find invoice ' + I.no + ' attached.\n\nThanks,\n' + me;
  },
  render: function (S) {
    var u = TD.ui, e = u.esc, I = S.inv;
    this.fill(I); TD.app.save();
    return u.head({ title: 'Send the invoice', sub: e(I.no) + ' · ' + e(I.client || 'No client yet') + ' · ' + u.eur(u.totals(I).total),
        actions: '<button type="button" class="btn" data-act="draft">Save as draft</button>' }) +
      u.steps(4) +
      '<div class="s4-cols">' +
        '<section class="panel"><div><h2>Invoice</h2></div>' + u.paper(I, { short: true }) + '</section>' +
        '<section class="panel"><div><h2>Email to the client\'s billing contact</h2></div>' +
          '<label class="field" for="s4-to">To<input id="s4-to" class="input" type="email" data-k="to" value="' + e(I.to) + '"><span class="hint">Billing contact for ' + e(I.client || '—') + '</span></label>' +
          '<label class="field" for="s4-sub">Subject<input id="s4-sub" class="input" data-k="subject" value="' + e(I.subject) + '"></label>' +
          '<label class="field" for="s4-msg">Message<textarea id="s4-msg" class="input" data-k="msg">' + e(I.msg) + '</textarea></label>' +
          '<div class="s4-pdf"><span class="mono s4-file">' + e(I.no) + '.pdf</span>Attached as a PDF</div>' +
        '</section></div>' +
      '<div class="foot"><button type="button" class="btn" data-act="back">Back</button>' +
        '<button type="button" class="btn btn-pri" data-act="send">Send invoice</button></div>';
  },
  bind: function (root, S) {
    var I = S.inv, today = TD.app.today;
    root.querySelectorAll('[data-k]').forEach(function (el) {
      el.addEventListener('input', function () { I[el.getAttribute('data-k')] = el.value; TD.app.save(); });
    });
    root.querySelector('[data-act="draft"]').addEventListener('click', function () { TD.app.save(); TD.app.toast('Saved as draft'); });
    root.querySelector('[data-act="back"]').addEventListener('click', function () { TD.app.go('s3'); });
    TD.app.once(root.querySelector('[data-act="send"]'), function () {
      if (I.status === 'draft') { I.status = 'sent'; I.sentOn = today; I.log.push({ t: 'Invoice created', d: today }); }
      I.log.push({ t: 'Emailed to ' + I.to, d: today });
      I.delivery = TD.store.copy(TD.DATA.newDelivery);   // a new send is not confirmed yet
      TD.app.go('s5');
    });
  }
};
