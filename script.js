/**
 * CSS Interaction Lab — Main Script
 * Handles: hero feedback, progress tracking, playground status,
 *          live CSS editor, step-by-step mode, quiz, coding challenges,
 *          navigation, and copy-to-clipboard.
 */

(function () {
  'use strict';

  /* =============================================
     UTILITIES
     ============================================= */

  /** Safely query a single element. */
  function $(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  /** Query all matching elements. */
  function $$(selector, ctx) {
    return Array.from((ctx || document).querySelectorAll(selector));
  }

  /* =============================================
     MOBILE NAV
     ============================================= */
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close mobile nav when a link is clicked
    $$('[data-nav]', mobileNav).forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }

  /* =============================================
     HERO FEEDBACK
     ============================================= */
  const heroFeedback = $('#heroFeedback');

  function setHeroFeedback(text, active) {
    if (!heroFeedback) return;
    heroFeedback.textContent = text;
    heroFeedback.classList.toggle('active-fb', !!active);
  }

  const heroBtnHover = $('#heroBtnHover');
  const heroBtnFocus = $('#heroBtnFocus');
  const heroBtnActive = $('#heroBtnActive');

  if (heroBtnHover) {
    heroBtnHover.addEventListener('mouseenter', function () {
      setHeroFeedback('✨ :hover — The button changed color and lifted because your pointer is over it!', true);
    });
    heroBtnHover.addEventListener('mouseleave', function () {
      setHeroFeedback('Try interacting with the buttons above!', false);
    });
  }

  if (heroBtnFocus) {
    heroBtnFocus.addEventListener('focus', function () {
      setHeroFeedback('🎯 :focus — The button now has a glow ring because it received focus!', true);
    });
    heroBtnFocus.addEventListener('blur', function () {
      setHeroFeedback('Try interacting with the buttons above!', false);
    });
  }

  if (heroBtnActive) {
    heroBtnActive.addEventListener('mousedown', function () {
      setHeroFeedback('⚡ :active — The button pushed down because you are pressing it!', true);
    });
    heroBtnActive.addEventListener('mouseup', function () {
      setHeroFeedback('Try interacting with the buttons above!', false);
    });
  }

  /* Start button */
  const startBtn = $('#startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      const target = $('#lesson-hover');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* =============================================
     PROGRESS BAR
     ============================================= */
  const progressBar = $('#progressBar');
  const lessons = $$('[data-lesson]');
  const visitedLessons = new Set();

  function updateProgress() {
    if (!progressBar || lessons.length === 0) return;
    const pct = Math.round((visitedLessons.size / lessons.length) * 100);
    progressBar.style.width = pct + '%';
    progressBar.parentElement.setAttribute('aria-valuenow', pct);
  }

  // Mark a lesson as visited when it scrolls into view
  const lessonObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visitedLessons.add(entry.target.getAttribute('data-lesson'));
        updateProgress();
      }
    });
  }, { threshold: 0.25 });

  lessons.forEach(function (el) { lessonObserver.observe(el); });

  /* =============================================
     ACTIVE NAV HIGHLIGHT
     ============================================= */
  const navLinks = $$('#navLessons a');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  lessons.forEach(function (el) { sectionObserver.observe(el); });

  /* =============================================
     HOVER LESSON — LIVE EXPLANATION
     ============================================= */
  const hoverExplanation = $('#hoverExplanation');
  const hoverDemoElements = [
    { el: '#hoverColorBtn', msg: '🎨 The button\'s background is transitioning from blue (#2563eb) to violet (#7c3aed) using <code>background-color</code>.' },
    { el: '#hoverLiftCard', msg: '🚀 The card is lifting upward with <code>transform: translateY(-8px)</code> and its shadow is expanding.' },
    { el: '#hoverScaleImg', msg: '🔍 The image is scaling up with <code>transform: scale(1.12)</code>, creating a zoom-in effect.' },
    { el: '#hoverUnderline', msg: '✏️ The underline pseudo-element is growing from <code>width: 0</code> to <code>width: 100%</code>.' }
  ];

  hoverDemoElements.forEach(function (item) {
    const el = $(item.el);
    if (!el || !hoverExplanation) return;
    el.addEventListener('mouseenter', function () {
      hoverExplanation.innerHTML = '<strong>Active effect:</strong> ' + item.msg;
    });
    el.addEventListener('mouseleave', function () {
      hoverExplanation.innerHTML = '<strong>💡 Try it:</strong> Move your mouse over each demo above. The CSS <code>:hover</code> selector applies the styles only while the pointer is over the element.';
    });
  });

  /* =============================================
     PLAYGROUND STATUS PANELS
     ============================================= */
  const playHoverBtn = $('#playHoverBtn');
  const playHoverStatus = $('#playHoverStatus');
  const playFocusInput = $('#playFocusInput');
  const playFocusStatus = $('#playFocusStatus');
  const playActiveBtn = $('#playActiveBtn');
  const playActiveStatus = $('#playActiveStatus');

  if (playHoverBtn && playHoverStatus) {
    playHoverBtn.addEventListener('mouseenter', function () {
      playHoverStatus.textContent = '✅ :hover is active! Background changed to violet.';
      playHoverStatus.classList.add('is-active');
    });
    playHoverBtn.addEventListener('mouseleave', function () {
      playHoverStatus.textContent = 'Move your pointer over the button.';
      playHoverStatus.classList.remove('is-active');
    });
  }

  if (playFocusInput && playFocusStatus) {
    playFocusInput.addEventListener('focus', function () {
      playFocusStatus.textContent = '✅ :focus is active! Glow ring visible.';
      playFocusStatus.classList.add('is-active');
    });
    playFocusInput.addEventListener('blur', function () {
      playFocusStatus.textContent = 'Click the input or press Tab.';
      playFocusStatus.classList.remove('is-active');
    });
  }

  if (playActiveBtn && playActiveStatus) {
    playActiveBtn.addEventListener('mousedown', function () {
      playActiveStatus.textContent = '✅ :active is active! Button pressed down.';
      playActiveStatus.classList.add('is-active');
    });
    playActiveBtn.addEventListener('mouseup', function () {
      playActiveStatus.textContent = 'Press and hold the button.';
      playActiveStatus.classList.remove('is-active');
    });
    playActiveBtn.addEventListener('mouseleave', function () {
      playActiveStatus.textContent = 'Press and hold the button.';
      playActiveStatus.classList.remove('is-active');
    });
  }

  /* =============================================
     LIVE CSS EDITOR
     ============================================= */
  const editorTarget = $('#editorTarget');
  const editorOutput = $('#editorOutput');

  // Editor control elements
  const edBgColor = $('#edBgColor');
  const edHoverColor = $('#edHoverColor');
  const edRadius = $('#edRadius');
  const edDuration = $('#edDuration');
  const edHoverScale = $('#edHoverScale');
  const edHoverLift = $('#edHoverLift');
  const edFocusRing = $('#edFocusRing');
  const edActiveDepth = $('#edActiveDepth');

  // Value displays
  const edRadiusVal = $('#edRadiusVal');
  const edDurationVal = $('#edDurationVal');
  const edHoverScaleVal = $('#edHoverScaleVal');
  const edHoverLiftVal = $('#edHoverLiftVal');
  const edActiveDepthVal = $('#edActiveDepthVal');

  // Dynamic stylesheet for editor
  let editorStyleEl = document.createElement('style');
  editorStyleEl.id = 'editor-dynamic-styles';
  document.head.appendChild(editorStyleEl);

  function updateEditor() {
    if (!editorTarget) return;

    var bgColor = edBgColor ? edBgColor.value : '#2563eb';
    var hoverColor = edHoverColor ? edHoverColor.value : '#7c3aed';
    var radius = edRadius ? parseInt(edRadius.value) : 10;
    var duration = edDuration ? (parseInt(edDuration.value) / 10).toFixed(1) : '0.3';
    var hoverScale = edHoverScale ? (parseInt(edHoverScale.value) / 100).toFixed(2) : '1.05';
    var hoverLift = edHoverLift ? parseInt(edHoverLift.value) : 4;
    var focusRing = edFocusRing ? edFocusRing.checked : true;
    var activeDepth = edActiveDepth ? parseInt(edActiveDepth.value) : 4;

    // Update value labels
    if (edRadiusVal) edRadiusVal.textContent = radius;
    if (edDurationVal) edDurationVal.textContent = duration;
    if (edHoverScaleVal) edHoverScaleVal.textContent = hoverScale;
    if (edHoverLiftVal) edHoverLiftVal.textContent = hoverLift;
    if (edActiveDepthVal) edActiveDepthVal.textContent = activeDepth;

    // Build dynamic CSS
    var css = '';
    css += '#editorTarget {\n';
    css += '  background-color: ' + bgColor + ';\n';
    css += '  border-radius: ' + radius + 'px;\n';
    css += '  transition: all ' + duration + 's ease;\n';
    css += '  box-shadow: 0 ' + (activeDepth + 1) + 'px 0 rgba(0,0,0,0.25);\n';
    css += '}\n\n';

    css += '#editorTarget:hover {\n';
    css += '  background-color: ' + hoverColor + ';\n';
    css += '  transform: translateY(-' + hoverLift + 'px) scale(' + hoverScale + ');\n';
    css += '}\n\n';

    if (focusRing) {
      css += '#editorTarget:focus {\n';
      css += '  outline: 3px solid ' + bgColor + ';\n';
      css += '  outline-offset: 3px;\n';
      css += '}\n\n';
    }

    css += '#editorTarget:active {\n';
    css += '  transform: translateY(' + activeDepth + 'px);\n';
    css += '  box-shadow: 0 1px 0 rgba(0,0,0,0.25);\n';
    css += '}\n';

    editorStyleEl.textContent = css;

    // Show the code with syntax highlighting
    if (editorOutput) {
      var displayCSS = '';

      displayCSS += '<span class="sel">.my-button</span> {\n';
      displayCSS += '  <span class="prop">background-color</span>: <span class="val">' + bgColor + '</span>;\n';
      displayCSS += '  <span class="prop">border-radius</span>: <span class="val">' + radius + 'px</span>;\n';
      displayCSS += '  <span class="prop">transition</span>: <span class="val">all ' + duration + 's ease</span>;\n';
      displayCSS += '  <span class="prop">box-shadow</span>: <span class="val">0 ' + (activeDepth + 1) + 'px 0 rgba(0,0,0,0.25)</span>;\n';
      displayCSS += '}\n\n';

      displayCSS += '<span class="sel">.my-button</span><span class="pseudo">:hover</span> {\n';
      displayCSS += '  <span class="prop">background-color</span>: <span class="val">' + hoverColor + '</span>;\n';
      displayCSS += '  <span class="prop">transform</span>: <span class="val">translateY(-' + hoverLift + 'px) scale(' + hoverScale + ')</span>;\n';
      displayCSS += '}\n\n';

      if (focusRing) {
        displayCSS += '<span class="sel">.my-button</span><span class="pseudo">:focus</span> {\n';
        displayCSS += '  <span class="prop">outline</span>: <span class="val">3px solid ' + bgColor + '</span>;\n';
        displayCSS += '  <span class="prop">outline-offset</span>: <span class="val">3px</span>;\n';
        displayCSS += '}\n\n';
      }

      displayCSS += '<span class="sel">.my-button</span><span class="pseudo">:active</span> {\n';
      displayCSS += '  <span class="prop">transform</span>: <span class="val">translateY(' + activeDepth + 'px)</span>;\n';
      displayCSS += '  <span class="prop">box-shadow</span>: <span class="val">0 1px 0 rgba(0,0,0,0.25)</span>;\n';
      displayCSS += '}';

      editorOutput.innerHTML = displayCSS;
    }
  }

  // Bind events
  [edBgColor, edHoverColor, edRadius, edDuration, edHoverScale, edHoverLift, edFocusRing, edActiveDepth].forEach(function (input) {
    if (input) {
      input.addEventListener('input', updateEditor);
    }
  });

  updateEditor();

  // Copy generated CSS
  const edCopyBtn = $('#edCopyBtn');
  if (edCopyBtn && editorOutput) {
    edCopyBtn.addEventListener('click', function () {
      var text = editorOutput.textContent;
      copyToClipboard(text, edCopyBtn);
    });
  }

  /* =============================================
     STEP-BY-STEP ANIMATION MODE
     ============================================= */
  var currentTopic = 'hover';
  var currentStep = 0;

  var stepData = {
    hover: [
      { explain: 'This is the button in its <strong>normal state</strong>. No pseudo-class is active.', style: 'background:#2563eb; color:#fff; transform:none; box-shadow: 0 4px 12px rgba(37,99,235,0.3);' },
      { explain: '👉 <strong>Now hover over the button</strong> with your mouse to see the <code>:hover</code> state.', style: 'background:#2563eb; color:#fff; transform:none; box-shadow: 0 4px 12px rgba(37,99,235,0.3);' },
      { explain: '✨ On hover, the <code>background-color</code> changes from <code>#2563eb</code> (blue) to <code>#7c3aed</code> (violet).', style: 'background:#7c3aed; color:#fff; transform:none; box-shadow: 0 4px 12px rgba(124,58,237,0.3);' },
      { explain: '🚀 The <code>transform: translateY(-4px)</code> moves the button upward, creating a lift effect.', style: 'background:#7c3aed; color:#fff; transform:translateY(-4px); box-shadow: 0 8px 20px rgba(124,58,237,0.3);' },
      { explain: '🔍 Here\'s the CSS selector responsible:<br><code>.button:hover { background: #7c3aed; transform: translateY(-4px); }</code>', style: 'background:#7c3aed; color:#fff; transform:translateY(-4px); box-shadow: 0 8px 20px rgba(124,58,237,0.3);' },
      { explain: '↩️ When the pointer leaves, the button transitions <strong>back to normal</strong>. The <code>transition</code> property handles the smooth return.', style: 'background:#2563eb; color:#fff; transform:none; box-shadow: 0 4px 12px rgba(37,99,235,0.3);' },
      { explain: '🎉 <strong>Complete!</strong> Try hovering the button yourself to repeat the interaction.', style: 'background:#2563eb; color:#fff; transform:none; box-shadow: 0 4px 12px rgba(37,99,235,0.3);' }
    ],
    focus: [
      { explain: 'This is the element in its <strong>normal state</strong>. It does not have focus.', style: 'background:#fff; color:#334155; border:2px solid #cbd5e1; box-shadow:none; transform:none;', tag: 'input' },
      { explain: '👉 <strong>Click the element</strong> or press <kbd>Tab</kbd> to give it focus.', style: 'background:#fff; color:#334155; border:2px solid #cbd5e1; box-shadow:none; transform:none;', tag: 'input' },
      { explain: '🎯 On focus, the <code>border-color</code> changes from gray to blue <code>#2563eb</code>.', style: 'background:#fff; color:#334155; border:2px solid #2563eb; box-shadow:none; transform:none;', tag: 'input' },
      { explain: '✨ A <code>box-shadow: 0 0 0 4px rgba(37,99,235,0.2)</code> creates a soft glow ring around the element.', style: 'background:#fff; color:#334155; border:2px solid #2563eb; box-shadow:0 0 0 4px rgba(37,99,235,0.2); transform:none;', tag: 'input' },
      { explain: '🔍 Here\'s the CSS:<br><code>.input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.2); }</code>', style: 'background:#fff; color:#334155; border:2px solid #2563eb; box-shadow:0 0 0 4px rgba(37,99,235,0.2); transform:none;', tag: 'input' },
      { explain: '↩️ When focus moves elsewhere (click outside or Tab away), the styles return to normal.', style: 'background:#fff; color:#334155; border:2px solid #cbd5e1; box-shadow:none; transform:none;', tag: 'input' },
      { explain: '🎉 <strong>Complete!</strong> Focus indicators are crucial for keyboard accessibility.', style: 'background:#fff; color:#334155; border:2px solid #cbd5e1; box-shadow:none; transform:none;', tag: 'input' }
    ],
    active: [
      { explain: 'This is the button in its <strong>normal state</strong>. Not being pressed.', style: 'background:#8b5cf6; color:#fff; box-shadow:0 5px 0 #5b21b6; transform:none;' },
      { explain: '👉 <strong>Press and hold</strong> the button to see the <code>:active</code> state.', style: 'background:#8b5cf6; color:#fff; box-shadow:0 5px 0 #5b21b6; transform:none;' },
      { explain: '⚡ While pressed, <code>transform: translateY(4px)</code> pushes the button downward.', style: 'background:#6d28d9; color:#fff; box-shadow:0 1px 0 #5b21b6; transform:translateY(4px);' },
      { explain: '🔽 The <code>box-shadow</code> shrinks from <code>0 5px</code> to <code>0 1px</code>, simulating physical depth.', style: 'background:#6d28d9; color:#fff; box-shadow:0 1px 0 #5b21b6; transform:translateY(4px);' },
      { explain: '🔍 Here\'s the CSS:<br><code>.button:active { transform: translateY(4px); box-shadow: 0 1px 0 #5b21b6; }</code>', style: 'background:#6d28d9; color:#fff; box-shadow:0 1px 0 #5b21b6; transform:translateY(4px);' },
      { explain: '↩️ When you release the button, it springs back. Fast transitions (0.1s) create a snappy feel.', style: 'background:#8b5cf6; color:#fff; box-shadow:0 5px 0 #5b21b6; transform:none;' },
      { explain: '🎉 <strong>Complete!</strong> <code>:active</code> is temporary — it only applies while pressing. Try it yourself!', style: 'background:#8b5cf6; color:#fff; box-shadow:0 5px 0 #5b21b6; transform:none;' }
    ]
  };

  var stepElement = $('#stepElement');
  var stepExplanation = $('#stepExplanation');
  var stepIndicator = $('#stepIndicator');
  var stepPrev = $('#stepPrev');
  var stepNext = $('#stepNext');
  var stepReset = $('#stepReset');
  var topicBtns = $$('[data-step-topic]');

  function renderStep() {
    var steps = stepData[currentTopic];
    if (!steps || !stepElement || !stepExplanation || !stepIndicator) return;

    var step = steps[currentStep];
    stepElement.setAttribute('style', step.style + ' padding:14px 32px; font-size:1rem; font-weight:600; border-radius:10px; border:none; cursor:pointer; transition:all 0.3s ease;');
    stepExplanation.innerHTML = step.explain;
    stepIndicator.textContent = 'Step ' + (currentStep + 1) + ' / ' + steps.length;

    // If the topic is focus, swap the element to an input-like appearance
    if (step.tag === 'input') {
      stepElement.textContent = '';
      stepElement.setAttribute('style', step.style + ' padding:14px 20px; font-size:1rem; font-weight:400; border-radius:10px; cursor:text; width:260px; transition:all 0.3s ease; font-family:Inter,sans-serif;');
      stepElement.setAttribute('placeholder', 'Sample Input');
    } else {
      stepElement.textContent = 'Sample Button';
    }

    if (stepPrev) stepPrev.disabled = currentStep === 0;
    if (stepNext) stepNext.disabled = currentStep === steps.length - 1;
  }

  // Topic switching
  topicBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentTopic = btn.getAttribute('data-step-topic');
      currentStep = 0;
      topicBtns.forEach(function (b) { b.classList.remove('primary'); });
      btn.classList.add('primary');
      renderStep();
    });
  });

  if (stepNext) {
    stepNext.addEventListener('click', function () {
      var max = stepData[currentTopic].length - 1;
      if (currentStep < max) { currentStep++; renderStep(); }
    });
  }

  if (stepPrev) {
    stepPrev.addEventListener('click', function () {
      if (currentStep > 0) { currentStep--; renderStep(); }
    });
  }

  if (stepReset) {
    stepReset.addEventListener('click', function () {
      currentStep = 0;
      renderStep();
    });
  }

  renderStep();

  /* =============================================
     QUIZ
     ============================================= */
  var quizQuestions = [
    {
      q: 'Which pseudo-class activates when the pointer moves over a button?',
      options: [':hover', ':focus', ':active', ':visited'],
      answer: 0,
      explanation: ':hover applies when a pointing device (like a mouse) is positioned over an element.'
    },
    {
      q: 'Which pseudo-class is useful for highlighting a focused input?',
      options: [':hover', ':active', ':focus', ':checked'],
      answer: 2,
      explanation: ':focus applies when an element receives focus, either by clicking or using Tab.'
    },
    {
      q: 'Which pseudo-class applies while pressing a button?',
      options: [':focus', ':hover', ':visited', ':active'],
      answer: 3,
      explanation: ':active applies while an element is being activated — such as while a mouse button is held down on it.'
    },
    {
      q: 'What is the difference between :focus and :active?',
      options: [
        ':focus lasts until focus moves; :active lasts only while pressing',
        'They are exactly the same',
        ':active lasts longer than :focus',
        ':focus only works on buttons'
      ],
      answer: 0,
      explanation: ':focus persists until the element loses focus. :active only applies during the moment of activation (press and hold).'
    },
    {
      q: 'Which state helps keyboard users identify the current element?',
      options: [':hover', ':active', ':focus', ':link'],
      answer: 2,
      explanation: ':focus is essential for accessibility because keyboard users use Tab to navigate and need visual focus indicators.'
    },
    {
      q: 'Which CSS property creates a smooth transition between normal and hover states?',
      options: ['animation', 'transform', 'transition', 'display'],
      answer: 2,
      explanation: 'The transition property specifies how CSS property changes should animate over time.'
    },
    {
      q: 'Which property would you use to move a button downward by 4px when pressed?',
      options: ['margin-top: 4px', 'transform: translateY(4px)', 'padding-top: 4px', 'top: 4px'],
      answer: 1,
      explanation: 'transform: translateY(4px) moves the element visually without affecting document flow — ideal for press effects.'
    },
    {
      q: 'What happens if you remove focus indicators (outline) without providing a visible replacement?',
      options: [
        'Nothing, it looks cleaner',
        'Keyboard users cannot see which element is currently focused',
        'The browser automatically adds one',
        'It only affects screen readers'
      ],
      answer: 1,
      explanation: 'Removing focus indicators without a replacement is an accessibility issue. Keyboard-only users rely on visible focus to navigate.'
    }
  ];

  var quizIndex = 0;
  var quizScore = 0;
  var quizAnswered = false;

  var quizQuestion = $('#quizQuestion');
  var quizOptions = $('#quizOptions');
  var quizFeedback = $('#quizFeedback');
  var quizNextBtn = $('#quizNextBtn');
  var quizProgressBar = $('#quizProgressBar');
  var quizProgressText = $('#quizProgressText');
  var quizCard = $('#quizCard');

  function renderQuiz() {
    if (!quizQuestion || quizIndex >= quizQuestions.length) {
      showQuizResults();
      return;
    }

    quizAnswered = false;
    var q = quizQuestions[quizIndex];

    quizQuestion.textContent = (quizIndex + 1) + '. ' + q.q;
    quizOptions.innerHTML = '';
    quizFeedback.className = 'quiz-feedback';
    quizFeedback.style.display = 'none';
    quizNextBtn.disabled = true;

    var letters = ['A', 'B', 'C', 'D'];
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.innerHTML = '<span class="option-letter">' + letters[i] + '</span><span>' + opt + '</span>';
      btn.setAttribute('data-index', i);
      btn.addEventListener('click', function () { handleQuizAnswer(i); });
      quizOptions.appendChild(btn);
    });

    updateQuizProgress();
  }

  function handleQuizAnswer(selected) {
    if (quizAnswered) return;
    quizAnswered = true;

    var q = quizQuestions[quizIndex];
    var optionEls = $$('.quiz-option', quizOptions);

    optionEls.forEach(function (btn, i) {
      btn.style.pointerEvents = 'none';
      if (i === q.answer) btn.classList.add('correct');
      if (i === selected && selected !== q.answer) btn.classList.add('incorrect');
    });

    if (selected === q.answer) {
      quizScore++;
      quizFeedback.className = 'quiz-feedback correct-fb show';
      quizFeedback.innerHTML = '✅ <strong>Correct!</strong> ' + q.explanation;
    } else {
      quizFeedback.className = 'quiz-feedback incorrect-fb show';
      quizFeedback.innerHTML = '❌ <strong>Not quite.</strong> ' + q.explanation;
    }

    quizFeedback.style.display = 'block';
    quizNextBtn.disabled = false;
  }

  function updateQuizProgress() {
    if (quizProgressBar) {
      quizProgressBar.style.width = Math.round(((quizIndex) / quizQuestions.length) * 100) + '%';
    }
    if (quizProgressText) {
      quizProgressText.textContent = quizIndex + ' / ' + quizQuestions.length;
    }
  }

  function showQuizResults() {
    if (!quizCard) return;

    var pct = Math.round((quizScore / quizQuestions.length) * 100);
    var scoreClass = pct >= 75 ? 'good' : pct >= 50 ? 'okay' : 'needs-work';
    var message = pct >= 75 ? 'Excellent work! You understand CSS pseudo-classes well.' :
                  pct >= 50 ? 'Good effort! Review the lessons and try again to improve.' :
                  'Keep learning! Go through the lessons again and retry the quiz.';

    quizCard.innerHTML =
      '<div class="quiz-results">' +
        '<div class="quiz-score ' + scoreClass + '">' + quizScore + ' / ' + quizQuestions.length + '</div>' +
        '<p>' + message + '</p>' +
        '<button class="quiz-btn primary" id="quizRetry">🔄 Retry Quiz</button>' +
      '</div>';

    if (quizProgressBar) quizProgressBar.style.width = '100%';
    if (quizProgressText) quizProgressText.textContent = quizQuestions.length + ' / ' + quizQuestions.length;

    var retryBtn = $('#quizRetry');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        quizIndex = 0;
        quizScore = 0;
        quizCard.innerHTML =
          '<div class="quiz-question" id="quizQuestion"></div>' +
          '<div class="quiz-options" id="quizOptions"></div>' +
          '<div class="quiz-feedback" id="quizFeedback"></div>' +
          '<div class="quiz-actions">' +
            '<button class="quiz-btn primary" id="quizNextBtn" disabled>Next Question →</button>' +
          '</div>';

        // Re-bind references
        quizQuestion = $('#quizQuestion');
        quizOptions = $('#quizOptions');
        quizFeedback = $('#quizFeedback');
        quizNextBtn = $('#quizNextBtn');
        quizNextBtn.addEventListener('click', function () {
          quizIndex++;
          renderQuiz();
        });
        renderQuiz();
      });
    }
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', function () {
      quizIndex++;
      renderQuiz();
    });
  }

  renderQuiz();

  /* =============================================
     CODING CHALLENGES
     ============================================= */

  // --- Challenge 1: Hover color ---
  var ch1Editor = $('#ch1Editor');
  var ch1Btn = $('#ch1Btn');
  var ch1StyleEl = document.createElement('style');
  document.head.appendChild(ch1StyleEl);

  $('#ch1Apply')?.addEventListener('click', function () {
    if (ch1Editor) {
      var css = ch1Editor.value.replace(/\.my-button/g, '#ch1Btn');
      ch1StyleEl.textContent = css;
    }
  });

  $('#ch1Hint')?.addEventListener('click', function () {
    alert('Hint: Add a rule like .my-button:hover { background: #7c3aed; }');
  });

  $('#ch1Solution')?.addEventListener('click', function () {
    if (ch1Editor) {
      ch1Editor.value = '.my-button {\n  background: #2563eb;\n  color: #fff;\n  padding: 12px 28px;\n  border: none;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: background 0.3s ease;\n}\n\n.my-button:hover {\n  background: #7c3aed;\n}';
      var css = ch1Editor.value.replace(/\.my-button/g, '#ch1Btn');
      ch1StyleEl.textContent = css;
    }
  });

  // --- Challenge 2: Focus ring ---
  var ch2Editor = $('#ch2Editor');
  var ch2StyleEl = document.createElement('style');
  document.head.appendChild(ch2StyleEl);

  $('#ch2Apply')?.addEventListener('click', function () {
    if (ch2Editor) {
      var css = ch2Editor.value.replace(/\.my-input/g, '#ch2Input');
      ch2StyleEl.textContent = css;
    }
  });

  $('#ch2Hint')?.addEventListener('click', function () {
    alert('Hint: Add a rule like .my-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.2); }');
  });

  $('#ch2Solution')?.addEventListener('click', function () {
    if (ch2Editor) {
      ch2Editor.value = '.my-input {\n  padding: 12px 16px;\n  border: 2px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n  transition: border-color 0.3s, box-shadow 0.3s;\n}\n\n.my-input:focus {\n  border-color: #2563eb;\n  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);\n}';
      var css = ch2Editor.value.replace(/\.my-input/g, '#ch2Input');
      ch2StyleEl.textContent = css;
    }
  });

  // --- Challenge 3: Active press ---
  var ch3Editor = $('#ch3Editor');
  var ch3StyleEl = document.createElement('style');
  document.head.appendChild(ch3StyleEl);

  $('#ch3Apply')?.addEventListener('click', function () {
    if (ch3Editor) {
      var css = ch3Editor.value.replace(/\.press-button/g, '#ch3Btn');
      ch3StyleEl.textContent = css;
    }
  });

  $('#ch3Hint')?.addEventListener('click', function () {
    alert('Hint: Add a rule like .press-button:active { transform: translateY(4px); box-shadow: 0 1px 0 #5b21b6; }');
  });

  $('#ch3Solution')?.addEventListener('click', function () {
    if (ch3Editor) {
      ch3Editor.value = '.press-button {\n  background: #8b5cf6;\n  color: #fff;\n  padding: 14px 32px;\n  border: none;\n  border-radius: 10px;\n  cursor: pointer;\n  box-shadow: 0 5px 0 #5b21b6;\n  transition: transform 0.1s, box-shadow 0.1s;\n}\n\n.press-button:active {\n  transform: translateY(4px);\n  box-shadow: 0 1px 0 #5b21b6;\n}';
      var css = ch3Editor.value.replace(/\.press-button/g, '#ch3Btn');
      ch3StyleEl.textContent = css;
    }
  });

  /* =============================================
     COPY TO CLIPBOARD
     ============================================= */
  function copyToClipboard(text, button) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(button);
      }).catch(function () {
        fallbackCopy(text, button);
      });
    } else {
      fallbackCopy(text, button);
    }
  }

  function fallbackCopy(text, button) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showCopied(button); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  function showCopied(button) {
    if (!button) return;
    var original = button.innerHTML;
    button.innerHTML = '✅ Copied!';
    button.classList.add('copied');
    setTimeout(function () {
      button.innerHTML = original;
      button.classList.remove('copied');
    }, 1800);
  }

  // Code panel copy buttons (lesson sections)
  $$('.code-panel__copy[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-copy');
      var pre = document.getElementById(targetId);
      if (pre) {
        copyToClipboard(pre.textContent, btn);
      }
    });
  });

})();
