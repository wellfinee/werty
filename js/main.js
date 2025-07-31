const GROUP_NAME = 'iSodaEffect';
const RSS_URL = `https://steamcommunity.com/groups/${GROUP_NAME}/rss/`;
const PROXY_URL = 'https://corsproxy.io/?' + encodeURIComponent(RSS_URL);

async function loadAnnouncements() {
  try {
    const response = await fetch(PROXY_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));

    const container = document.getElementById('announcements');
    if (!items.length) {
      container.innerHTML = '<p>Нет последних анонсов.</p>';
      return;
    }

    // Сохраняем данные в localStorage
    const newsArray = items.map((item, index) => ({
      id: index,
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      pubDate: item.querySelector('pubDate').textContent,
      guid: item.querySelector('guid')?.textContent || index
    }));
    localStorage.setItem('steamNews', JSON.stringify(newsArray));

    // Генерация списка
    const ul = document.createElement('ul');
    newsArray.forEach(news => {
      const date = new Date(news.pubDate).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="news.html?id=${news.id}">
          <strong>${date}</strong> — ${news.title}
        </a>`;
      ul.appendChild(li);
    });

    container.appendChild(ul);
  } catch (err) {
    console.error('Ошибка загрузки анонсов:', err);
    document.getElementById('announcements').innerHTML = '<p>Не удалось загрузить анонсы.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadAnnouncements);



