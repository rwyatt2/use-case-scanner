import styles from './Skeleton.module.css'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  borderRadius?: string | number
}

/** Accessible loading placeholder — announces "Loading" for screen readers. */
export function Skeleton({ className = '', width, height, borderRadius }: SkeletonProps) {
  const style: React.CSSProperties = {}
  if (width != null) style.width = typeof width === 'number' ? `${width}px` : width
  if (height != null) style.height = typeof height === 'number' ? `${height}px` : height
  if (borderRadius != null) style.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius

  return (
    <span
      className={`${styles.skeleton} ${className}`.trim()}
      style={style}
      role="status"
      aria-label="Loading"
    />
  )
}
