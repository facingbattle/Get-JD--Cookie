import '@src/Popup.css';
import React from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [cookies, setCookies] = React.useState<string>('');

  const getJDCookies = async () => {
    try {
      const cookies = await chrome.cookies.getAll({
        domain: 'jd.com',
      });
      // 只获取 pt_key 和 pt_pin
      const targetCookies = cookies.filter(cookie => ['pt_key', 'pt_pin'].includes(cookie.name));
      const cookieStr = targetCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ') + ';';
      setCookies(cookieStr);
      // 复制到剪贴板
      await navigator.clipboard.writeText(cookieStr);
    } catch (error) {
      console.error('获取Cookie失败:', error);
      alert('获取Cookie失败，请检查权限设置！');
    }
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'} p-4`}>
      {/* 隐私声明 */}
      <div className={`text-xs mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
        <p>🔒 隐私声明：本扩展只在本地处理 Cookie，不会上传或发送到任何服务器。</p>
      </div>

      <button
        className={
          'font-bold py-2 px-4 rounded shadow hover:scale-105 transition-transform ' +
          (isLight ? 'bg-green-200 text-black' : 'bg-green-700 text-white')
        }
        onClick={getJDCookies}>
        获取京东Cookie
      </button>

      {cookies ? (
        <div className="mt-4 p-4 bg-green-100 rounded text-sm text-green-800 max-w-xl overflow-auto">
          <p className="font-semibold flex items-center">
            <span className="mr-2">✅</span> Cookie 已复制到剪贴板
          </p>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-800 max-w-xl overflow-auto">
          <p>请点击上方按钮获取 Cookie</p>
        </div>
      )}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
