import unittest
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "assets" / "home-stickers"
FRAME_NAMES = (
    "designer-default.png",
    "designer-hover-1.png",
    "designer-hover-2.png",
)


def alpha_components(image, threshold=8):
    alpha = image.getchannel("A")
    width, height = image.size
    pixels = alpha.load()
    seen = bytearray(width * height)

    for start in range(width * height):
        if seen[start]:
            continue
        start_x, start_y = start % width, start // width
        if pixels[start_x, start_y] <= threshold:
            continue

        seen[start] = 1
        queue = deque([start])
        points = []
        while queue:
            index = queue.popleft()
            x, y = index % width, index // width
            points.append((x, y))
            for next_x, next_y in (
                (x - 1, y),
                (x + 1, y),
                (x, y - 1),
                (x, y + 1),
            ):
                if not (0 <= next_x < width and 0 <= next_y < height):
                    continue
                next_index = next_y * width + next_x
                if seen[next_index] or pixels[next_x, next_y] <= threshold:
                    continue
                seen[next_index] = 1
                queue.append(next_index)

        yield points


class DesignerFrameTests(unittest.TestCase):
    def test_frames_share_the_same_transparent_canvas(self):
        for name in FRAME_NAMES:
            with Image.open(ASSET_DIR / name) as image:
                self.assertEqual(image.size, (454, 428), name)
                self.assertEqual(image.mode, "RGBA", name)
                self.assertEqual(image.getpixel((0, 0))[3], 0, name)

    def test_frames_keep_a_consistent_subject_scale_and_anchor(self):
        bounds = []
        for name in FRAME_NAMES:
            with Image.open(ASSET_DIR / name) as image:
                bbox = image.getchannel("A").getbbox()
                self.assertIsNotNone(bbox, name)
                bounds.append(bbox)

        tops = [bbox[1] for bbox in bounds]
        bottoms = [bbox[3] for bbox in bounds]
        heights = [bbox[3] - bbox[1] for bbox in bounds]

        self.assertLessEqual(max(tops) - min(tops), 2)
        self.assertLessEqual(max(bottoms) - min(bottoms), 5)
        self.assertLessEqual(max(heights) - min(heights), 8)

    def test_frames_have_no_narrow_neighbor_fragments_at_right_edge(self):
        for name in FRAME_NAMES:
            with Image.open(ASSET_DIR / name).convert("RGBA") as image:
                for points in alpha_components(image):
                    xs = [point[0] for point in points]
                    ys = [point[1] for point in points]
                    left, right = min(xs), max(xs) + 1
                    top, bottom = min(ys), max(ys) + 1
                    is_neighbor_fragment = (
                        left >= 416
                        and right - left <= 5
                        and bottom - top >= 30
                    )
                    self.assertFalse(
                        is_neighbor_fragment,
                        f"{name}: stray fragment at {(left, top, right, bottom)}",
                    )


if __name__ == "__main__":
    unittest.main()
