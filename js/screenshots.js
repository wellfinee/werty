const API_URL = 'http://dev.local:1337';
const LIMIT = 4;
let offset = 0;
let allShots = [];   // храним **все** загруженные скрины
let currentIdx = 0;
  gsap.registerPlugin(ScrollTrigger)
const gallery = document.getElementById('gallery');
const loadMore = document.getElementById('loadMore');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

async function fetchScreenshots() {
    const res = await fetch(
        `${API_URL}/api/screenshots?` +
        `pagination[start]=${offset}&pagination[limit]=${LIMIT}&populate=image`
    );
    const json = await res.json();

    return json.data.map(item => {
        const img = item.image;
        const relPath = img?.formats?.large?.url || img?.url || '';
        const url = relPath.startsWith('http') ? relPath : API_URL + relPath;

        return {
            url,
            tag: item.tags || '',  // singular field
            name: item.name || '',
            description: item.description || ''
        };
    });
}

function renderGallery() {
    gallery.innerHTML = '';
    allShots.forEach((shot, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb';

        const img = document.createElement('img');
        img.src = shot.url;
        img.dataset.index = i;
        img.addEventListener('click', () => openModal(i));
        wrapper.append(img);

        const tagEl = document.createElement('div');
        tagEl.className = 'tag';
        tagEl.textContent = shot.tag;
        wrapper.append(tagEl);

        gallery.append(wrapper);
    });
}

async function loadNext() {
    const shots = await fetchScreenshots();
    allShots.push(...shots);
    renderGallery();

    offset += shots.length;
    loadMore.style.display = shots.length < LIMIT ? 'none' : 'block';
}

function openModal(idx) {
    currentIdx = idx;
    updateModal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // если действительно нужно прятать header:
    document.querySelector('.header').style.zIndex = '-1';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.querySelector('.header').style.zIndex = '';
}

function updateModal() {
    const shot = allShots[currentIdx];
    modalName.textContent = shot.name;
    modalImg.src = shot.url;
    modalDesc.textContent = shot.description;

    prevBtn.style.display = currentIdx > 0
        ? 'block' : 'none';
    nextBtn.style.display = currentIdx < allShots.length - 1
        ? 'block' : 'none';
}

prevBtn.addEventListener('click', () => {
    if (currentIdx > 0) {
        currentIdx--;
        updateModal();
    }
});
nextBtn.addEventListener('click', () => {
    if (currentIdx < allShots.length - 1) {
        currentIdx++;
        updateModal();
    }
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});
loadMore.addEventListener('click', loadNext);

// Стартуем
loadNext();
