/* ==========================================================================
   Mohammad Hosseini — Academic Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var navButtons = document.querySelectorAll('.nav-btn');
  var sections = document.querySelectorAll('.content-section');
  var modeAllBtn = document.getElementById('modeAllBtn');
  var modeTabBtn = document.getElementById('modeTabBtn');
  var sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  var sidebarCollapsible = document.getElementById('sidebarCollapsible');
  var filterChips = document.querySelectorAll('.filter-chip');
  var pubCards = document.querySelectorAll('.pub-card');
  var interestCards = document.querySelectorAll('.interest-card');
  var copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  var citeButtons = document.querySelectorAll('.pub-btn-cite');
  var copyCiteBtns = document.querySelectorAll('.copy-cite-btn');
  var quickInquiryForm = document.getElementById('quickInquiryForm');
  var toastEl = document.getElementById('toastMsg');

  var currentMode = 'all'; // 'all' or 'tabs'
  var activeSectionId = 'home';

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2600);
  }

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg);
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Email: ' + text);
    }
    document.body.removeChild(textarea);
  }

  function updateSectionVisibility() {
    sections.forEach(function (sec) {
      if (currentMode === 'all') {
        sec.classList.remove('hidden-section');
      } else {
        if (sec.id === activeSectionId) {
          sec.classList.remove('hidden-section');
        } else {
          sec.classList.add('hidden-section');
        }
      }
    });
  }

  function setActiveNav(targetId, shouldScroll) {
    activeSectionId = targetId;
    navButtons.forEach(function (btn) {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    updateSectionVisibility();

    if (shouldScroll && currentMode === 'all') {
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-target');
      setActiveNav(targetId, true);
    });
  });

  // Hero jump buttons
  var jumpButtons = document.querySelectorAll('[data-jump]');
  jumpButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-jump');
      setActiveNav(targetId, true);
    });
  });

  if (modeAllBtn && modeTabBtn) {
    modeAllBtn.addEventListener('click', function () {
      currentMode = 'all';
      modeAllBtn.classList.add('active');
      modeTabBtn.classList.remove('active');
      updateSectionVisibility();
      showToast('Showing all sections on one page');
    });

    modeTabBtn.addEventListener('click', function () {
      currentMode = 'tabs';
      modeTabBtn.classList.add('active');
      modeAllBtn.classList.remove('active');
      updateSectionVisibility();
      showToast('Switched to single-tab view');
    });
  }

  if (sidebarToggleBtn && sidebarCollapsible) {
    sidebarToggleBtn.addEventListener('click', function () {
      var isExpanded = sidebarCollapsible.classList.toggle('expanded');
      sidebarToggleBtn.querySelector('span').textContent = isExpanded
        ? 'Hide Contact Details'
        : 'Show Contact Details';
    });
  }

  // Publication filtering
  function filterPublications(filterValue) {
    pubCards.forEach(function (card) {
      var pubType = card.getAttribute('data-type') || '';
      var pubTopics = card.getAttribute('data-topics') || '';
      if (
        filterValue === 'all' ||
        pubType === filterValue ||
        pubTopics.indexOf(filterValue) !== -1
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) {
        c.classList.remove('active');
      });
      chip.classList.add('active');
      interestCards.forEach(function (ic) {
        ic.classList.remove('active-interest');
      });
      var filterVal = chip.getAttribute('data-filter');
      filterPublications(filterVal);
    });
  });

  // Clicking a Research Interest card highlights matching publications
  interestCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var topic = card.getAttribute('data-topic');
      var alreadyActive = card.classList.contains('active-interest');

      interestCards.forEach(function (c) {
        c.classList.remove('active-interest');
      });
      filterChips.forEach(function (c) {
        c.classList.remove('active');
      });

      if (alreadyActive) {
        filterChips[0].classList.add('active');
        filterPublications('all');
        showToast('Showing all publications');
      } else {
        card.classList.add('active-interest');
        filterPublications(topic);
        showToast('Filtered publications by: ' + card.querySelector('.interest-name').textContent);
      }
    });
  });

  // Citation drawer toggles
  citeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var drawerId = btn.getAttribute('data-cite-target');
      var drawer = document.getElementById(drawerId);
      if (drawer) {
        drawer.classList.toggle('open');
      }
    });
  });

  copyCiteBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var citeText = btn.getAttribute('data-cite-text');
      copyTextToClipboard(citeText, 'Citation copied to clipboard!');
    });
  });

  copyEmailBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      copyTextToClipboard('mohammadhossinee9@gmail.com', 'Email address copied to clipboard!');
    });
  });

  if (quickInquiryForm) {
    quickInquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var senderName = document.getElementById('senderName').value.trim();
      var senderSubject = document.getElementById('senderSubject').value.trim() || 'Academic Inquiry via Portfolio Website';
      var senderMessage = document.getElementById('senderMessage').value.trim();

      var fullBody = (senderName ? 'From: ' + senderName + '\n\n' : '') + senderMessage;
      var mailtoUrl =
        'mailto:mohammadhossinee9@gmail.com?subject=' +
        encodeURIComponent(senderSubject) +
        '&body=' +
        encodeURIComponent(fullBody);

      window.location.href = mailtoUrl;
      showToast('Opening your email client...');
    });
  }
});