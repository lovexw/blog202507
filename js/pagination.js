// 分页相关功能
function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.createElement('div');
    paginationElement.className = 'pagination';
    
    // 如果只有一页，不显示分页
    if (totalPages <= 1) return paginationElement;
    
    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '上一页';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    paginationElement.appendChild(prevButton);
    
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
            onPageChange(i);
        });
        paginationElement.appendChild(pageButton);
    }
    
    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '下一页';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    paginationElement.appendChild(nextButton);
    
    return paginationElement;
}