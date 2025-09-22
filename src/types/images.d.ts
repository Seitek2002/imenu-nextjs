// Allow importing image assets as URL strings (Turbopack/Webpack ?url suffix) and plain imports.

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

/* Variants with ?url */
declare module '*.svg?url' {
  const src: string;
  export default src;
}
declare module '*.png?url' {
  const src: string;
  export default src;
}
declare module '*.jpg?url' {
  const src: string;
  export default src;
}
declare module '*.jpeg?url' {
  const src: string;
  export default src;
}
declare module '*.webp?url' {
  const src: string;
  export default src;
}
declare module '*.gif?url' {
  const src: string;
  export default src;
}
declare module '*.avif?url' {
  const src: string;
  export default src;
}
