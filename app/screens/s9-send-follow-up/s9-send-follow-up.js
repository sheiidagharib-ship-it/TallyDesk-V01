/* S9 Send follow-up — Flow 2 · Step 4 (Steps 5–6 as "After you send") */
TD.screens.s9 = {
  name: 'Send a follow-up',
  meta: function () { return { flow: 2, nav: 'overdue' }; },
  render: function (S) {
    var u = TD.ui, e = u.esc, x = TD.store.get(S.current) || S.overdue[0];
    if (!S.fu || S.fu.no !== x.no) S.fu = { no: x.no, to: x.to, subject: '', msg: '' };   // K17: empty Subject and Message
    var F = S.fu;
    return u.head({ title: 'Send a follow-up', sub: 'Written by hand today',
        actions: '<button type="button" class="btn" data-act="cancel">Cancel</button>' }) +
      '<div class="s9-cols">' +
        '<section class="panel"><div><h2 class="wrap">Follow-up to ' + e(x.client) + '</h2><div class="panel-sub">' + e(x.no) + ' · ' + u.eur(u.totals(u.latest(x)).total) + ' · ' + u.daysBetween(x.due, TD.app.today) + ' days overdue</div></div>' +
          '<label class="field" for="s9-to">To<input id="s9-to" class="input" type="email" data-k="to" value="' + e(F.to) + '"></label>' +
          '<label class="field" for="s9-sub">Subject<input id="s9-sub" class="input" data-k="subject" value="' + e(F.subject) + '" placeholder="Subject"></label>' +
          '<label class="field" for="s9-msg">Message<textarea id="s9-msg" class="input" data-k="msg" placeholder="Write your message">' + e(F.msg) + '</textarea></label>' +
        '</section>' +
        '<div class="s9-col">' +
          '<section class="panel"><div><h2>After you send</h2><div class="panel-sub">What the client does next</div></div>' +
            '<div class="s9-outcomes">' +
              '<div class="s9-out"><span>Client reported a mistake</span><button type="button" class="btn btn-sm btn-ghost" data-act="correct">Make a correction</button></div>' +
              '<div class="s9-out"><span>Client has paid</span><button type="button" class="btn btn-sm btn-ghost" data-act="paid">Mark as paid</button></div>' +
              '<div class="s9-out"><span>Not paid yet</span><span class="s9-muted">Stays in the overdue list</span></div>' +
            '</div></section>' +
          '<section class="panel"><div><h2>Who follows up</h2></div></section>' +
        '</div></div>' +
      '<div class="foot"><button type="button" class="btn" data-act="back">Back</button>' +
        '<button type="button" class="btn btn-pri" data-act="send">Send follow-up</button></div>';
  },
  bind: function (root, S) {
    var x = TD.store.get(S.current) || S.overdue[0], F = S.fu, today = TD.app.today;
    root.querySelectorAll('[data-k]').forEach(function (el) {
      el.addEventListener('input', function () { F[el.getAttribute('data-k')] = el.value; TD.app.save(); });
    });
    root.querySelector('[data-act="cancel"]').addEventListener('click', function () { TD.app.go('s8'); });
    root.querySelector('[data-act="back"]').addEventListener('click', function () { TD.app.go('s8'); });
    root.querySelector('[data-act="paid"]').addEventListener('click', function () { TD.app.go('s10'); });
    root.querySelector('[data-act="correct"]').addEventListener('click', function () {
      var v = TD.ui.latest(x);
      S.corr = { target: x.no, flow: 2, ret: 's9', back: 's8', items: TD.store.copy(v.items), tax: v.tax, disc: v.disc, note: '' };
      TD.app.go('s2');
    });
    TD.app.once(root.querySelector('[data-act="send"]'), function () {
      var to = F.to.trim() || x.to;
      if (to !== x.to) { x.to = to; x.delivery = TD.store.copy(TD.DATA.newDelivery); }   // new contact: not confirmed yet
      x.followups.push(today);
      x.log.push({ t: 'Follow-up sent to ' + to, d: today });
      S.fu = null;
      TD.app.go('s7');
    });
  }
};
