import React, { useState } from 'react';
import { Camera, Upload, Loader } from 'lucide-react';
import { gradeAssignment } from '../services/gemini';

function GradingPage() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      setImage({
        data: base64,
        mimeType: file.type,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleGrade = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      const feedback = await gradeAssignment({
        image,
        subject: 'general',
        language: 'japanese',
        level: 'N5'
      });
      
      setResult(feedback);
    } catch (error) {
      alert('批改失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">拍照批改</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">上传作业照片，获取AI批改反馈</p>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">上传作业</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="dropzone cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            <div className="text-center">
              <Camera size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">拍照上传</p>
              <p className="text-sm text-gray-500">点击使用相机</p>
            </div>
          </label>
          
          <label className="dropzone cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageCapture}
              className="hidden"
            />
            <div className="text-center">
              <Upload size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">选择文件</p>
              <p className="text-sm text-gray-500">从相册选择</p>
            </div>
          </label>
        </div>
        
        {image && (
          <div className="mt-6">
            <img
              src={image.preview}
              alt="预览"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setImage(null)}
                className="btn-secondary"
              >
                重新选择
              </button>
              <button
                onClick={handleGrade}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={18} />
                    批改中...
                  </>
                ) : (
                  '开始批改'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {result && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">批改结果</h3>
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradingPage;
