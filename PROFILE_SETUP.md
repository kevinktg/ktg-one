# Adding Your Profile to Blob Cursor Effect

## Quick Setup

### Step 1: Add Your Profile Image

Place your profile photo in `public/assets/`:

```
public/
  assets/
    profile.jpg  (or .png, .webp)
```

**Recommended formats:**
- `.webp` - Best compression, smaller size
- `.jpg` - Good quality, widely supported
- `.png` - For transparency if needed

**Recommended size:**
- Minimum: 512x512px
- Optimal: 1024x1024px or 1024x1280px (portrait)
- Square or portrait works best

### Step 2: Use in Component

```jsx
import { BlobCursorMask } from '@/components/BlobCursorMask'

// In your Hero section:
<BlobCursorMask 
  geometryType="profile"
  profileImage="/assets/profile.jpg"
/>
```

## Geometry Options

### Option 1: Sphere (3D Portrait) ⭐ RECOMMENDED
Your profile wraps around a sphere - looks like a 3D portrait bust:
- **Best for**: Professional headshots
- **Effect**: Sculptural, 3D look
- **Currently active** in component

### Option 2: Flat Plane (Simple)
Your profile as a flat image with blob reveal:
- **Best for**: Full-body photos or logos
- **Effect**: Clean, minimal
- **To use**: Uncomment the plane mesh in `ProfileImageMask` component

## Customization

### Adjust Position & Scale

In `ProfileImageMask` component, modify:

```jsx
// Sphere version
<mesh position={[0, 1.5, 0]} scale={[3, 3, 3]}>
  {/* Adjust scale: [width, height, depth] */}
  {/* Adjust position: [x, y, z] */}
</mesh>
```

### Adjust Camera

In `BlobCursorMask` component:

```jsx
camera={{ 
  position: [0, 0, 5],  // [x, y, z] - closer = bigger
  fov: 50                // Field of view - lower = zoomed in
}}
```

### Change Blob Size

In `Scene` component:

```jsx
const pointerRadius = 0.375  // Smaller = smaller blob (0.2-0.5 range)
const pointerDuration = 2.5  // Lower = faster dissolve (1-3 range)
```

## Example Usage

### In Hero Section

```jsx
// src/components/HeroSection.jsx
import { BlobCursorMask } from "@/components/BlobCursorMask"

export const HeroSection = () => {
  return (
    <section className="hero relative min-h-screen">
      {/* Your profile with blob reveal effect */}
      <BlobCursorMask 
        geometryType="profile"
        profileImage="/assets/profile.jpg"
      />
      
      {/* Rest of your hero content */}
    </section>
  )
}
```

## Tips

1. **Square images work best** for sphere geometry
2. **Good lighting** in your photo = better 3D effect
3. **High contrast** photos look more dramatic
4. **Test different scales** - profile should be centered and visible
5. **Adjust camera distance** if profile is too big/small

## Troubleshooting

**Profile not showing?**
- Check image path: Must be in `public/` folder
- Check file format: Use `.jpg`, `.png`, or `.webp`
- Check console for 404 errors

**Blob effect not working?**
- Ensure `blobTexture` is being passed correctly
- Check that cursor is moving (pointer tracking)

**Profile too big/small?**
- Adjust `scale` in `ProfileImageMask` (try `[2, 2, 2]` to `[4, 4, 4]`)
- Adjust camera `position` z-value (higher = further away)
- Adjust camera `fov` (lower = more zoomed)

**Want different shape?**
- Use `geometryType="gltf"` with a custom 3D model
- Or modify geometry in `ProfileImageMask` (try `boxGeometry`, `torusGeometry`, etc.)

## Next Steps

1. **Add your profile photo** to `public/assets/profile.jpg`
2. **Enable component** in Hero section
3. **Adjust settings** to your preference
4. **Optional**: Add lighting for more dramatic effect
5. **Optional**: Add wireframe overlay for tech aesthetic

Your profile will reveal as users move their cursor! 🎯

