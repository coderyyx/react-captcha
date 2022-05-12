import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { randomImage, getRandomNumberByRange } from './random-image';
import drawPath from './utils/draw-path';

import './index.less';

export type ReactCaptchaProps = {
  /**
   * canvas 宽度
   */
  width: number;
  /**
   * canvas 高度
   */
  height: number;
  /**
   * 滑块边长
   */
  l: number;
  /**
   * 滑块半径
   */
  r: number;
};

const ReactCaptcha: React.FC<ReactCaptchaProps> = ({
  width = 310,
  height = 155,
  l = 42,
  r = 9,
}) => {
  const $canvas = useRef<HTMLCanvasElement>(null);

  // 加载态
  const [loading, setLoading] = useState(true);

  // 图片
  const [imgInstance, setImgInstance] = useState<HTMLImageElement>();

  const L = useMemo(() => l + r * 2 + 3, [l, r]);

  const drawImage = useCallback(() => {
    if (!imgInstance) return;
    if (!$canvas.current) return;

    // 随机位置创建拼图形状
    const x = getRandomNumberByRange(L + 10, width - (L + 10));
    const y = getRandomNumberByRange(10 + r * 2, height - (L + 10));

    // 绘制底图
    const canvasCtx = $canvas.current.getContext('2d')!;

    canvasCtx!.drawImage(imgInstance, 0, 0, width, height);
    drawPath(canvasCtx, x, y, l, r, 'fill');
  }, [imgInstance]);

  const getRandomImage = useCallback(() => {
    setLoading(true);

    randomImage(width, height).then((img) => {
      setLoading(false);
      setImgInstance(img);
    });
  }, [width, height]);

  useEffect(() => {
    getRandomImage();
  }, []);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  console.log('imgInstance', imgInstance);

  return (
    <div
      className="captcha-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {loading && (
        <div className="loading-container">
          <div className="loading-icon"></div>
          <span>加载中...</span>
        </div>
      )}
      {!loading && (
        <>
          <canvas width={width} height={height} ref={$canvas}></canvas>
        </>
      )}
    </div>
  );
};

export default ReactCaptcha;
