function loadNewsArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return document.getElementById('news-article').innerHTML = '<p>Новость не найдена</p>';

    const newsArray = JSON.parse(localStorage.getItem('steamNews') || '[]');
    const article = newsArray.find(n => String(n.id) === id);

    if (!article) {
        document.getElementById('news-article').innerHTML = '<p>Новость не найдена.</p>';
        return;
    }

    document.title = article.title;

    document.getElementById('news-article').innerHTML = `
  <div class="news__side">
    <h1>${article.title}</h1>
    <p><em>${new Date(article.pubDate).toLocaleString('ru-RU')}</em></p>
</div>
  <div class="news__side">
    <article>${article.description}</article>
    <p><a href="${article.link}" target="_blank">${"Оригинал на Steam"}</a></p>
    </div>
  `;
}
document.addEventListener('DOMContentLoaded', loadNewsArticle);

