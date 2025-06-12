import loader from '@assemblyscript/loader';

export async function loadWasm() {
    try {
        // 显示加载状态
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        // 加载编译后的WebAssembly模块
        const imports = {
            env: {
                memory: new WebAssembly.Memory({ initial: 10 }),
                abort: (message, fileName, line, column) => {
                    console.error('Abort:', message, fileName, line, column);
                }
            }
        };
        
        // 使用fetch加载wasm文件
        const response = await fetch('release.wasm');
        if (!response.ok) {
            throw new Error(`Failed to fetch wasm file: ${response.statusText}`);
        }
        const wasmBuffer = await response.arrayBuffer();
        
        const wasmModule = await loader.instantiate(
            wasmBuffer,
            imports
        );

        // 隐藏加载状态
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        return wasmModule.exports;
    } catch (error) {
        console.error('Failed to load WebAssembly module:', error);
        // 显示错误信息
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
            loadingElement.textContent = '加载失败: ' + error.message;
            loadingElement.style.background = 'rgba(255, 0, 0, 0.8)';
        }
        throw error;
    }
} 