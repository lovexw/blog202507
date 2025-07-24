// 全局变量
const postsPerPage = 15;
let allPosts = [];
let currentPage = 1;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 根据当前页面执行不同的初始化函数
    const currentPath = window.location.pathname;
    
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        initHomePage();
    } else if (currentPath.endsWith('archive.html')) {
        loadArchive();
    } else if (currentPath.endsWith('about.html')) {
        loadAboutPage();
    }
    
    // 在所有页面加载侧边栏的关于我信息
    if (document.querySelector('.sidebar')) {
        loadSidebar();
    }
});

// 初始化主页
async function initHomePage() {
    try {
        // 获取所有文章
        allPosts = await fetchAllPosts();
        
        // 按日期排序（最新的在前）
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 显示第一页文章
        displayPosts(currentPage);
        
        // 设置分页
        setupPagination();
    } catch (error) {
        console.error('初始化主页失败:', error);
        document.getElementById('posts-container').innerHTML = `<div class="error">加载文章失败: ${error.message}</div>`;
    }
}

// 获取所有文章
async function fetchAllPosts() {
    try {
        // 获取文章列表
        const response = await fetch('posts/index.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const postsList = await response.json();
        const posts = [];
        
        // 获取每篇文章的内容
        for (const postInfo of postsList) {
            const postResponse = await fetch(`posts/${postInfo.filename}`);
            if (!postResponse.ok) continue;
            
            const postContent = await postResponse.text();
            const parsedPost = parseMarkdown(postContent);
            
            // 合并文章信息
            posts.push({
                ...parsedPost,
                filename: postInfo.filename
            });
        }
        
        return posts;
    } catch (error) {
        console.error('获取文章失败:', error);
        throw error;
    }
}

// 显示指定页的文章
function displayPosts(page) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, allPosts.length);
    
    if (allPosts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">暂无文章</div>';
        return;
    }
    
    for (let i = startIndex; i < endIndex; i++) {
        const post = allPosts[i];
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    }
    
    currentPage = page;
}

// 创建文章元素
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    
    // 提取摘要（前200个字符）
    const excerpt = post.content.substring(0, 200) + '...';
    
    // 创建标签和分类HTML
    const tagsHTML = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const categoriesHTML = post.categories ? post.categories.map(cat => `<span class="category">${cat}</span>`).join('') : '';
    
    postDiv.innerHTML = `
        <h2 class="post-title"><a href="post.html?id=${post.filename}">${post.title}</a></h2>
        <div class="post-meta">
            <span class="post-date">${post.date}</span>
        </div>
        <div class="post-excerpt">${excerpt}</div>
        <div class="post-tags">
            ${categoriesHTML}
            ${tagsHTML}
        </div>
    `;
    
    return postDiv;
}

// 设置分页
function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    paginationContainer.innerHTML = '';
    
    // 如果只有一页，不显示分页
    if (totalPages <= 1) return;
    
    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '上一页';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayPosts(currentPage - 1);
            setupPagination();
            window.scrollTo(0, 0);
        }
    });
    paginationContainer.appendChild(prevButton);
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerHTML = i.toString();
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            displayPosts(i);
            setupPagination();
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(pageButton);
    }
    
    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '下一页';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayPosts(currentPage + 1);
            setupPagination();
            window.scrollTo(0, 0);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// 加载侧边栏
async function loadSidebar() {
    const aboutCard = document.querySelector('.about-card');
    if (!aboutCard) return;
    
    try {
        const response = await fetch('posts/about.md');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const aboutContent = await response.text();
        const parsedAbout = parseMarkdown(aboutContent);
        
        // 提取头像和简介
        const avatarMatch = parsedAbout.content.match(/!\[.*?\]\((.*?)\)/);
        const avatar = avatarMatch ? avatarMatch[1] : 'assets/default-avatar.jpg';
        
        // 提取个性签名
        const bioMatch = parsedAbout.content.match(/>(.*?)\n/);
        const bio = bioMatch ? bioMatch[1].trim() : '';
        
        // 提取社交链接
        const socialLinks = [];
        const socialRegex = /\[(.*?)\]\((.*?)\)/g;
        let match;
        while ((match = socialRegex.exec(parsedAbout.content)) !== null) {
            socialLinks.push({ name: match[1], url: match[2] });
        }
        
        // 构建侧边栏HTML
        let socialHTML = '';
        if (socialLinks.length > 0) {
            socialHTML = '<div class="social-links">';
            socialLinks.forEach(link => {
                socialHTML += `<a href="${link.url}" target="_blank">${link.name}</a>`;
            });
            socialHTML += '</div>';
        }
        
        aboutCard.innerHTML = `
            <img src="${avatar}" alt="头像">
            <h3>${parsedAbout.title || '关于我'}</h3>
            ${bio ? `<p class="bio">${bio}</p>` : ''}
            ${socialHTML}
        `;
    } catch (error) {
        console.error('加载侧边栏失败:', error);
        aboutCard.innerHTML = '<div class="error">加载关于我信息失败</div>';
    }
}

// 加载关于我页面
async function loadAboutPage() {
    const aboutContainer = document.getElementById('about-container');
    if (!aboutContainer) return;
    
    try {
        const response = await fetch('posts/about.md');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const aboutContent = await response.text();
        const parsedAbout = parseMarkdown(aboutContent);
        
        // 使用marked渲染Markdown
        aboutContainer.innerHTML = marked.parse(aboutContent);
    } catch (error) {
        console.error('加载关于我页面失败:', error);
        aboutContainer.innerHTML = '<div class="error">加载关于我信息失败</div>';
    }
}

// 加载归档页面
async function loadArchive() {
    const archiveContainer = document.getElementById('archive-container');
    if (!archiveContainer) return;
    
    try {
        // 获取所有文章
        allPosts = await fetchAllPosts();
        
        // 按日期排序（最新的在前）
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 按年月组织文章
        const archiveData = {};
        
        allPosts.forEach(post => {
            const date = new Date(post.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            if (!archiveData[year]) {
                archiveData[year] = {};
            }
            
            if (!archiveData[year][month]) {
                archiveData[year][month] = [];
            }
            
            archiveData[year][month].push(post);
        });
        
        // 构建归档HTML
        let archiveHTML = '';
        
        // 获取年份并排序（降序）
        const years = Object.keys(archiveData).sort((a, b) => b - a);
        
        years.forEach(year => {
            archiveHTML += `<div class="archive-year"><h2>${year}年</h2>`;
            
            // 获取月份并排序（降序）
            const months = Object.keys(archiveData[year]).sort((a, b) => b - a);
            
            months.forEach(month => {
                archiveHTML += `<div class="archive-month"><h3>${month}月</h3>`;
                archiveHTML += '<ul class="archive-posts">';
                
                archiveData[year][month].forEach(post => {
                    const date = new Date(post.date);
                    const formattedDate = `${date.getMonth() + 1}-${date.getDate()}`;
                    
                    archiveHTML += `
                        <li>
                            <span class="archive-date">${formattedDate}</span>
                            <a href="post.html?id=${post.filename}">${post.title}</a>
                        </li>
                    `;
                });
                
                archiveHTML += '</ul></div>';
            });
            
            archiveHTML += '</div>';
        });
        
        if (archiveHTML === '') {
            archiveHTML = '<div class="no-posts">暂无文章</div>';
        }
        
        archiveContainer.innerHTML = archiveHTML;
    } catch (error) {
        console.error('加载归档页面失败:', error);
        archiveContainer.innerHTML = `<div class="error">加载归档失败: ${error.message}</div>`;
    }
}