import { createPortal } from 'react-dom';

export default function Tooltip({ targetRef, visible, children }) {
  if (!visible) return null;

  // Получаем позицию кнопки (или любого target-а)
  const rect = targetRef.current?.getBoundingClientRect();

  if (!rect) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: rect.top - 30, // подкорректируй по высоте
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
        zIndex: 10000,
        backgroundColor: 'black',
        color: 'white',
        padding: '4px 8px',
        borderRadius: 4,
        whiteSpace: 'nowrap',
        pointerEvents: 'none', // чтобы мышь не мешала
        fontSize: '0.875rem',
      }}
    >
      {children}
    </div>,
    document.body // портал выводит сюда — в корень DOM
  );
}
