// 解析Markdown文件
function parseMarkdown(markdown) {
    // 提取元数据
    const metadataRegex = /^---\n([\s\S]*?)\n---/;
    const metadataMatch = markdown.match(metadataRegex);
    
    let metadata = {};
    let content = markdown;
    
    if (metadataMatch) {
        const metadataStr = metadataMatch[1];
        content = markdown.slice(metadataMatch[0].length).trim();
        
        // 解析元数据
        const lines = metadataStr.split('\n');
        lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                
                // 处理数组类型（如标签、分类）
                if (value.startsWith('[') && value.endsWith(']')) {
                    const arrayValue = value.slice(1, -1).split(',').map(item => {
                        // 移除引号和空格
                        return item.trim().replace(/["']/g, '');
                    });
                    metadata[key.trim()] = arrayValue;
                } else {
                    metadata[key.trim()] = value;
                }
            }
        });
    }
    
    // 确保有标题
    if (!metadata.title) {
        // 尝试从内容的第一个标题中提取
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1];
        } else {
            metadata.title = '无标题';
        }
    }
    
    // 确保有日期
    if (!metadata.date) {
        metadata.date = new Date().toISOString().split('T')[0];
    }
    
    return {
        ...metadata,
        content: content
    };
}