/// <reference types="nativewind/types" />

// NativeWind 4 global CSS types
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
