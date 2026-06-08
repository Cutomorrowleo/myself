from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(r"C:\Users\26133\Documents\myself")
OUTPUT = ROOT / "public" / "assets" / "load-stickers"

SOURCES = [
    (
        Path(r"C:\Users\26133\Downloads\ChatGPT Image 2026年6月7日 19_58_14.png"),
        [
            (36, 78, 315, 447),
            (315, 88, 558, 501),
            (566, 82, 916, 450),
            (945, 66, 1182, 446),
            (1201, 57, 1443, 416),
            (1425, 119, 1669, 420),
            (1650, 98, 1916, 450),
            (605, 426, 916, 695),
            (942, 410, 1325, 698),
            (1325, 405, 1690, 704),
        ],
    ),
    (
        Path(r"C:\Users\26133\Downloads\ChatGPT Image 2026年6月7日 19_55_23 (1).png"),
        [
            (9, 84, 500, 519),
            (405, 0, 775, 395),
            (785, 8, 1090, 374),
            (1095, 18, 1425, 390),
            (1410, 35, 1815, 410),
            (1760, 42, 2172, 412),
            (67, 490, 445, 724),
            (475, 344, 1125, 724),
            (1090, 370, 1435, 724),
            (1420, 360, 2050, 724),
        ],
    ),
]


def connected_components(mask, width, height):
    seen = bytearray(width * height)
    components = []
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if seen[idx] or not mask[idx]:
                continue
            queue = deque([idx])
            seen[idx] = 1
            pixels = []
            while queue:
                current = queue.popleft()
                pixels.append(current)
                cx = current % width
                cy = current // width
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        nidx = ny * width + nx
                        if not seen[nidx] and mask[nidx]:
                            seen[nidx] = 1
                            queue.append(nidx)
            components.append(pixels)
    return components


def extract(crop):
    rgb = crop.convert("RGB")
    width, height = rgb.size
    pixels = list(rgb.getdata())

    # The supplied sheets use a bright, near-neutral dotted backdrop.
    # Build the subject from chromatic or dark pixels, then retain only
    # meaningful connected components so isolated background dots disappear.
    core = bytearray(width * height)
    for i, (r, g, b) in enumerate(pixels):
        chroma = max(r, g, b) - min(r, g, b)
        luminance = (r * 299 + g * 587 + b * 114) // 1000
        if chroma >= 14 or luminance <= 224:
            core[i] = 1

    components = connected_components(core, width, height)
    kept = bytearray(width * height)
    minimum = max(80, int(width * height * 0.00035))
    for component in components:
        xs = [idx % width for idx in component]
        ys = [idx // width for idx in component]
        touches_crop_edge = min(xs) <= 2 or max(xs) >= width - 3 or min(ys) <= 2 or max(ys) >= height - 3
        if len(component) >= minimum and not touches_crop_edge:
            for idx in component:
                kept[idx] = 255

    core_image = Image.frombytes("L", (width, height), bytes(kept))
    # Include the exact source pixels making up the existing white sticker edge.
    subject_mask = core_image.filter(ImageFilter.MaxFilter(25))
    subject_mask = subject_mask.filter(ImageFilter.GaussianBlur(0.7))

    rgba = rgb.convert("RGBA")
    rgba.putalpha(subject_mask)
    bbox = subject_mask.getbbox()
    if not bbox:
        raise RuntimeError("No subject found")

    padding = 18
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(width, bbox[2] + padding)
    bottom = min(height, bbox[3] + padding)
    return rgba.crop((left, top, right, bottom))


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    index = 1
    for source_path, boxes in SOURCES:
        source = Image.open(source_path).convert("RGB")
        for box in boxes:
            crop = source.crop(box)
            result = extract(crop)
            result.save(OUTPUT / f"sticker-{index:02d}.png", optimize=True)
            index += 1

    preview = Image.new("RGBA", (1400, 1300), (247, 247, 247, 255))
    for i in range(20):
        sticker = Image.open(OUTPUT / f"sticker-{i + 1:02d}.png").convert("RGBA")
        sticker.thumbnail((300, 225), Image.Resampling.LANCZOS)
        col = i % 4
        row = i // 4
        x = 20 + col * 345 + (300 - sticker.width) // 2
        y = 20 + row * 255 + (225 - sticker.height) // 2
        preview.alpha_composite(sticker, (x, y))
    preview.save(OUTPUT / "_preview.png", optimize=True)

    print(f"Wrote {index - 1} stickers to {OUTPUT}")


if __name__ == "__main__":
    main()
