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
