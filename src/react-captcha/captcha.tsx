import React, { useState } from 'react';

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
};

const ReactCaptcha: React.FC<ReactCaptchaProps> = ({ width = 310, height = 155 }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="captcha-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
};

export default ReactCaptcha;
