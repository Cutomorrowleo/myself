from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(r"C:\Users\26133\Documents\myself")
SOURCE_A = Path(r"C:\Users\26133\Downloads\ChatGPT Image 2026年6月7日 19_58_14.png")
SOURCE_B = Path(r"C:\Users\26133\Downloads\ChatGPT Image 2026年6月7日 19_55_23 (1).png")
OUT = ROOT / "public" / "assets" / "home-stickers"

ASSETS = {
    "designer-default.png": (SOURCE_B, (8, 84, 462, 520)),
    "chai-default.png": (SOURCE_A, (566, 82, 916, 450)),
    "outfit.png": (SOURCE_A, (945, 66, 1182, 446)),
    "plant.png": (SOURCE_B, (1090, 370, 1435, 724)),
}


def components(mask, width, height):
    seen = bytearray(width * height)
    groups = []
    for start in range(width * height):
        if seen[start] or not mask[start]:
            continue
        seen[start] = 1
        queue = deque([start])
        group = []
        while queue:
            index = queue.popleft()
            group.append(index)
            x, y = index % width, index // width
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < width and 0 <= ny < height:
                    next_index = ny * width + nx
                    if not seen[next_index] and mask[next_index]:
                        seen[next_index] = 1
                        queue.append(next_index)
        groups.append(group)
    return groups


def extract(source, box):
    crop = source.crop(box).convert("RGB")
    width, height = crop.size
    pixels = list(crop.getdata())
    core = bytearray(width * height)

    for index, (red, green, blue) in enumerate(pixels):
        chroma = max(red, green, blue) - min(red, green, blue)
        luminance = (red * 299 + green * 587 + blue * 114) // 1000
        if chroma >= 14 or luminance <= 220:
            core[index] = 1

    groups = components(core, width, height)
    kept = bytearray(width * height)
    minimum = max(100, int(width * height * 0.0004))
    largest = max(groups, key=len) if groups else []
    for group in groups:
        if len(group) < minimum:
            continue
        xs = [index % width for index in group]
        ys = [index // width for index in group]
        if group is not largest and (
            min(xs) <= 2
            or max(xs) >= width - 3
            or min(ys) <= 2
            or max(ys) >= height - 3
        ):
            continue
        for index in group:
            kept[index] = 255

    core_image = Image.frombytes("L", (width, height), bytes(kept))
    expanded = core_image.filter(ImageFilter.MaxFilter(25))
    alpha = expanded.filter(ImageFilter.GaussianBlur(0.6))

    # Rebuild the white die-cut margin from the mask. This removes the sheet's
    # dotted background without changing any colored or dark source pixels.
    clean = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    source_pixels = crop.load()
    core_pixels = core_image.load()
    alpha_pixels = alpha.load()
    clean_pixels = clean.load()
    for y in range(height):
        for x in range(width):
            opacity = alpha_pixels[x, y]
            if opacity == 0:
                continue
            if core_pixels[x, y]:
                red, green, blue = source_pixels[x, y]
                clean_pixels[x, y] = (red, green, blue, opacity)
            else:
                clean_pixels[x, y] = (255, 255, 255, opacity)

    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError("No sticker subject found")
    padding = 18
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(width, bbox[2] + padding)
    bottom = min(height, bbox[3] + padding)
    return clean.crop((left, top, right, bottom))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    opened = {}
    for filename, (source_path, box) in ASSETS.items():
        if source_path not in opened:
            opened[source_path] = Image.open(source_path).convert("RGB")
        result = extract(opened[source_path], box)
        result.save(OUT / filename, optimize=True)
        print(filename, result.size)


if __name__ == "__main__":
    main()
