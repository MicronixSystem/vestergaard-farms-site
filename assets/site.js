(function () {
  // the hero fills the screen below the fixed bars; measure them rather than guess
  function setStack() {
    var h = 0;
    ['.notice', '.masthead'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) h += el.offsetHeight;
    });
    document.documentElement.style.setProperty('--stack', h + 'px');
  }
  setStack();
  window.addEventListener('resize', setStack);
  window.addEventListener('load', setStack);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setStack);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(setStack);
    ['.notice', '.masthead'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) ro.observe(el);
    });
  }

  // below 1080px the primary nav is hidden, so mirror it into a collapsible panel
  var nav = document.querySelector('.nav');
  var tools = document.querySelector('.tools');
  var mast = document.querySelector('.masthead');
  if (nav && tools && mast) {
    var mBtn = document.createElement('button');
    mBtn.className = 'menu-btn';
    mBtn.setAttribute('aria-expanded', 'false');
    mBtn.textContent = 'Menu';
    tools.insertBefore(mBtn, tools.firstChild);

    var panel = document.createElement('nav');
    panel.className = 'menu';
    panel.setAttribute('aria-label', 'Primary, compact');
    var pWrap = document.createElement('div');
    pWrap.className = 'wrap';
    var list = document.createElement('ul');
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      var li = document.createElement('li');
      li.appendChild(a.cloneNode(true));
      list.appendChild(li);
    });
    pWrap.appendChild(list);
    panel.appendChild(pWrap);
    mast.parentNode.insertBefore(panel, mast.nextSibling);

    var setMenu = function (open) {
      panel.classList.toggle('is-open', open);
      mBtn.setAttribute('aria-expanded', String(open));
      mBtn.textContent = open ? 'Close' : 'Menu';
    };

    // the panel sits at the top of the document, under a sticky masthead, so
    // opening or closing it from halfway down the page has to bring the page
    // back up to it or nothing appears to happen
    var toTop = function () {
      // jump rather than glide: from far down the page a smooth scroll takes long
      // enough that the panel looks broken while it travels
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      // Safari and older engines ignore the call above when a scroll is in flight
      if (window.pageYOffset > 0) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    mBtn.addEventListener('click', function () {
      setMenu(!panel.classList.contains('is-open'));
      toTop();
    });

    // a same-page anchor would otherwise leave the panel hanging open behind
    // the section it just jumped to, so close it without fighting the jump
    panel.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (a) setMenu(false);
    });

    // the button and the panel both disappear above 1080px; do not leave the
    // state saying Close when the panel can no longer be seen
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && panel.classList.contains('is-open')) setMenu(false);
    });
  }

  // filter chips are single-select on the shop page; the grid itself is static here
  var chips = document.querySelectorAll('.chip');
  Array.prototype.forEach.call(chips, function (c) {
    c.addEventListener('click', function () {
      Array.prototype.forEach.call(chips, function (o) {
        o.setAttribute('aria-pressed', String(o === c));
      });
    });
  });

  var btn = document.getElementById('notesBtn');
  btn.addEventListener('click', function () {
    var on = document.body.classList.toggle('show-notes');
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? 'Hide design notes' : 'Show design notes';
  });
})();
