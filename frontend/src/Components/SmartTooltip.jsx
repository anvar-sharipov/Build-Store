import React, { useRef, useState } from 'react';
import Tooltip from './ToolTip';



const SmartTooltip = ({ children, tooltip, shortcut }) => {
  const targetRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const visible = hovered || focused;

  return (
    <div
      ref={targetRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={0} // позволяет элементу получать фокус
    >
      {children}
      <Tooltip visible={visible} targetRef={targetRef}>
        {tooltip}
        {shortcut && <span className="ml-2 text-xs text-gray-400">{shortcut}</span>}
      </Tooltip>
    </div>
  );
};

export default SmartTooltip;