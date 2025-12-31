# Blob Cursor Mask Effect

This component recreates the liquid blob masking cursor effect similar to [landonorris.com](https://landonorris.com).

## Features

- **Framebuffer Feedback Loop**: Creates a dissolving blob effect that follows your cursor
- **3D Geometry Masking**: Masks a 3D object (currently icosahedron placeholder) based on blob texture
- **Wireframe Overlay**: Animated wireframe with opacity waves
- **Smooth Cursor Tracking**: Real-time cursor position tracking

## Setup

### Current Status
- ✅ Component created (`src/components/BlobCursorMask.jsx`)
- ✅ React Three Fiber integration
- ✅ Framebuffer render target setup
- ⏳ Waiting for helmet SVG/GLTF assets

### Adding Your Helmet Assets

You mentioned you have 2 SVGs (helmet with/without). You have a few options:

#### Option 1: Use SVG as Texture (Simplest)
```jsx
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

// In your component
const helmetTexture = useLoader(TextureLoader, '/assets/helmet.svg')
```

#### Option 2: Convert SVG to 3D Geometry
Use a library like `three-svg-loader` or `@react-three/drei`'s SVG loader:
```bash
npm install three-svg-loader
```

#### Option 3: Use GLTF Model (Best for 3D)
Place your helmet GLTF in `public/models/helmet/glTF/helmet.gltf` and use:
```jsx
import { useGLTF } from '@react-three/drei'

const { nodes, materials } = useGLTF('/models/helmet/glTF/helmet.gltf')
```

## Usage

```jsx
import { BlobCursorMask } from '@/components/BlobCursorMask'

// In your Hero section or anywhere
<BlobCursorMask />
```

## Configuration

You can adjust these parameters in the `Scene` component:

- `pointerRadius`: Size of blob (default: 0.375)
- `pointerDuration`: Dissolve speed (default: 2.5)
- Camera position: Adjust in `BlobCursorMask` component

## Current Implementation Notes

1. **Framebuffer Feedback**: Uses `useFBO` from `@react-three/drei` for render targets
2. **Custom Shaders**: Uses `onBeforeCompile` to inject custom fragment shaders
3. **Placeholder Geometry**: Currently uses icosahedron - replace with your helmet model
4. **Performance**: Framebuffer readback can be expensive - consider using smaller resolution or `useFBO` with lower samples

## Next Steps

1. Add your helmet SVG/GLTF assets to `public/assets/` or `public/models/`
2. Update `MaskedGeometry` component to use your assets
3. Optionally add chromatic aberration effect (see below)
4. Test and adjust blob size/speed to your preference

## Adding Chromatic Aberration

If you want the chromatic aberration effect, install:

```bash
npm install @react-three/postprocessing postprocessing
```

Then wrap your scene:

```jsx
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

<EffectComposer>
  <ChromaticAberration
    blendFunction={BlendFunction.NORMAL}
    offset={[0.02, 0.002]}
  />
</EffectComposer>
```

## Troubleshooting

- **Blob not appearing**: Check that `blobTexture` is being passed correctly
- **Performance issues**: Reduce render target resolution or disable wireframe overlay
- **Shader errors**: Ensure all uniforms are properly assigned in `onBeforeCompile`

