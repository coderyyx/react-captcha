import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { randomImage, getRandomNumberByRange } from './random-image';
import useMemoizedFn from './hooks/use-memoized-fn';
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
  /**
   * 到目标位置的误差值
   */
  errorValue?: number;
  onSuccess?: () => void;
  onFail?: () => void;
};

const ReactCaptcha: React.FC<ReactCaptchaProps> = ({
  width = 310,
  height = 155,
  l = 42,
  r = 9,
  errorValue = 5,
  onSuccess,
  onFail,
}) => {
  const $canvas = useRef<HTMLCanvasElement>(null);

  const $sliderCanvas = useRef<HTMLCanvasElement>(null);

  const startX = useRef(0);

  const [isMoving, setIsMoving] = useState(false);

  const [transformX, setTransformX] = useState(0);

  // 加载态
  const [loading, setLoading] = useState(true);

  // 图片
  const [imgInstance, setImgInstance] = useState<HTMLImageElement>();

  const L = useMemo(() => l + r * 2 + 3, [l, r]);

  const drawImage = useCallback(() => {
    if (!imgInstance) return;
    if (!$canvas.current || !$sliderCanvas.current) return;

    // 随机位置创建拼图形状
    // const x = getRandomNumberByRange(L + 10, width - (L + 10));
    // const y = getRandomNumberByRange(10 + r * 2, height - (L + 10));
    const x = 221;
    const y = 64;

    const canvasCtx = $canvas.current.getContext('2d')!;
    const sliderCanvasCtx = $sliderCanvas.current.getContext('2d')!;

    // 绘制底图
    canvasCtx!.drawImage(imgInstance, 0, 0, width, height);

    drawPath(canvasCtx, x, y, l, r, 'fill');
    drawPath(sliderCanvasCtx, x, y, l, r, 'clip');

    sliderCanvasCtx!.drawImage(imgInstance, 0, 0, width, height);

    // 提取滑块并放到最左边
    const offsetY = y - r * 2 - 1;
    const ImageData = sliderCanvasCtx.getImageData(x - 3, offsetY, L, L);
    $sliderCanvas.current.width = L;
    sliderCanvasCtx.putImageData(ImageData, 0, offsetY);
  }, [imgInstance]);

  const getRandomImage = useCallback(() => {
    setLoading(true);

    randomImage(width, height).then((img) => {
      setLoading(false);
      setImgInstance(img);
    });
  }, [width, height]);

  const handleSliderPointerDown = useMemoizedFn((e) => {
    console.log(e);
    setIsMoving(true);
    startX.current = e.clientX;
  });

  const handleSliderPointerMove = useMemoizedFn((e) => {
    if (!isMoving) return;

    const delteX = e.clientX - startX.current;
    if (delteX < 0) return;

    setTransformX(delteX);
  });

  const handleSliderPointerCancel = useMemoizedFn((e) => {
    setIsMoving(false);
  });

  useEffect(() => {
    getRandomImage();
  }, []);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

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
          <canvas
            width={width}
            height={height}
            style={{ left: `${transformX}px` }}
            className="slider-block"
            ref={$sliderCanvas}
            onPointerDown={handleSliderPointerDown}
            onPointerMove={handleSliderPointerMove}
            onPointerCancel={handleSliderPointerCancel}
            onPointerUp={handleSliderPointerCancel}
          ></canvas>
        </>
      )}
    </div>
  );
};

export default ReactCaptcha;
