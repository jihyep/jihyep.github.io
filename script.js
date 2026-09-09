// 화면 전환: HTML의 section.page와 링크의 data-page 값이 일치해야 합니다.
const pages = [...document.querySelectorAll('.page')];
const links = [...document.querySelectorAll('nav a[data-page]')];
const validPages = new Set(pages.map(page => page.id));
const header = document.querySelector('.header');
const menuWrap = document.querySelector('.menu-wrap');
const menu = document.querySelector('#site-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = [...menu.querySelectorAll('a')];

// 메뉴의 시각적 상태와 접근성 상태를 함께 변경합니다.
// inert는 닫힌 메뉴에 키보드 초점이 들어가는 것을 방지합니다.
function setMenu(open, restoreFocus = false) {
  menuWrap.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  menu.inert = !open;
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

// 메뉴 바깥 클릭, Esc, 메뉴 밖으로의 탭 이동은 메뉴를 닫습니다.
document.addEventListener('pointerdown', event => {
  if (!menuWrap.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    event.preventDefault();
    setMenu(false, true);
  }
});
menuWrap.addEventListener('focusout', () => {
  setTimeout(() => {
    if (!menuWrap.contains(document.activeElement)) setMenu(false);
  }, 0);
});

// 방향키로도 메뉴 항목을 선택할 수 있게 합니다. Tab은 기본 동작을 유지합니다.
menuToggle.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setMenu(true);
    menuLinks[0].focus();
  }
});
menu.addEventListener('keydown', event => {
  const index = menuLinks.indexOf(document.activeElement);
  if (index < 0) return;
  const destinations = {
    ArrowDown: (index + 1) % menuLinks.length,
    ArrowUp: (index - 1 + menuLinks.length) % menuLinks.length,
    Home: 0,
    End: menuLinks.length - 1,
  };
  if (event.key in destinations) {
    event.preventDefault();
    menuLinks[destinations[event.key]].focus();
  }
});
menu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  setMenu(false);
  // 현재 보고 있는 페이지를 다시 선택해도 메뉴가 닫히도록 처리합니다.
  if (link.hash === window.location.hash) showPage(true);
});

function showPage(moveFocus = false) {
  let requested = window.location.hash.slice(1);
  // 이전 주소를 저장해 둔 방문자를 위해 통합 전 링크를 유지합니다.
  const aliases = { projects: 'research', education: 'about' };
  if (aliases[requested]) {
    requested = aliases[requested];
    window.history.replaceState(null, '', `#${requested}`);
  }
  if (requested === 'main') return; // 본문 바로가기 링크는 화면을 바꾸지 않습니다.
  const current = validPages.has(requested) ? requested : 'home';
  setMenu(false);
  header.hidden = current === 'home';
  pages.forEach(page => { page.hidden = page.id !== current; });
  links.forEach(link => {
    if (link.dataset.page === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = current === 'home'
    ? 'Jihye Park'
    : `${current[0].toUpperCase() + current.slice(1)} — Jihye Park`;
  if (moveFocus) {
    const heading = document.querySelector(`#${current} h1`);
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

// URL의 #about 같은 값을 바꾸면 해당 화면을 보여 줍니다. 뒤로/앞으로 가기도 지원합니다.
window.addEventListener('hashchange', () => showPage(true));
document.querySelector('#year').textContent = new Date().getFullYear();
showPage();
