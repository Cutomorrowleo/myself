from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\26133\.codex\generated_images\019ea16e-0bff-7a11-a961-03440696409f")
OUT = ROOT / "public" / "assets" / "home-stickers"

JOBS = [
    (
        GENERATED / "ig_08e5b4e82ef2f48d016a2580b15f788191a9978c9483024919.png",
        OUT / "designer-hover-1.png",
        OUT / "designer-default.png",
    ),
    (
        GENERATED / "ig_08e5b4e82ef2f48d016a25816272648191b127dcb1b07cb10f.png",
        OUT / "designer-hover-2.png",
        OUT / "designer-default.png",
    ),
    (
        GENERATED / "ig_08e5b4e82ef2f48d016a2581fafd6c8191a8309a7e80360cb7.png",
        OUT / "chai-hover-1.png",
        OUT / "chai-default.png",
    ),
    (
        GENERATED / "ig_08e5b4e82ef2f48d016a2582e2dc748191a27b931816dd93b2.png",
        OUT / "chai-hover-2.png",
        OUT / "chai-default.png",
    ),
]


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


def isolate_subject(image):
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = list(rgb.getdata())
    core = bytearray(width * height)
    for index, (red, green, blue) in enumerate(pixels):
        chroma = max(red, green, blue) - min(red, green, blue)
        luminance = (red * 299 + green * 587 + blue * 114) // 1000
        # Checkerboard cells are neutral and bright; the illustrated sticker is
        # chromatic or dark. This also preserves black outlines.
        if chroma >= 15 or luminance <= 210:
            core[index] = 1

    groups = components(core, width, height)
    largest = max(groups, key=len)
    kept = bytearray(width * height)
    for group in groups:
        if len(group) >= max(150, len(largest) * 0.002):
            for index in group:
                kept[index] = 255

    core_image = Image.frombytes("L", (width, height), bytes(kept))
    alpha = core_image.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(0.7))
    clean = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    source_pixels = rgb.load()
    core_pixels = core_image.load()
    alpha_pixels = alpha.load()
    output_pixels = clean.load()
    for y in range(height):
        for x in range(width):
            opacity = alpha_pixels[x, y]
            if not opacity:
                continue
            if core_pixels[x, y]:
                red, green, blue = source_pixels[x, y]
                output_pixels[x, y] = (red, green, blue, opacity)
            else:
                output_pixels[x, y] = (255, 255, 255, opacity)

    bbox = alpha.getbbox()
    return clean.crop(bbox)


def normalize(subject, target_size):
    target_width, target_height = target_size
    padding = 4
    scale = min(
        (target_width - padding * 2) / subject.width,
        (target_height - padding * 2) / subject.height,
    )
    size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    resized = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", target_size, (255, 255, 255, 0))
    x = (target_width - resized.width) // 2
    y = target_height - resized.height - padding
    canvas.alpha_composite(resized, (x, y))
    return canvas


def main():
    for source_path, output_path, target_path in JOBS:
        source = Image.open(source_path)
        target = Image.open(target_path)
        subject = isolate_subject(source)
        frame = normalize(subject, target.size)
        frame.save(output_path, optimize=True)
        print(output_path.name, frame.size)


if __name__ == "__main__":
    main()
