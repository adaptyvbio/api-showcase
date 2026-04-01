declare module "3dmol" {
  interface ViewerSpec {
    backgroundColor?: string;
    antialias?: boolean;
  }

  interface StyleSpec {
    cartoon?: {
      color?: string;
      opacity?: number;
    };
    stick?: {
      radius?: number;
      colorscheme?: string;
    };
    sphere?: {
      radius?: number;
    };
  }

  interface GLViewer {
    addModel(data: string, format: string): void;
    setStyle(sel: object, style: StyleSpec): void;
    zoomTo(): void;
    render(): void;
    spin(axis: string | false, speed?: number): void;
    stopAnimate(): void;
    clear(): void;
    removeAllModels(): void;
  }

  function createViewer(
    element: HTMLElement,
    config?: ViewerSpec
  ): GLViewer;
}
