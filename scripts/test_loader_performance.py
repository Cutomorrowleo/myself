import re
import unittest
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LOADER = ROOT / "public" / "js" / "loader.js"
AVATAR = ROOT / "public" / "assets" / "profile-avatar.png"
SOURCE_DIR = ROOT / "scripts" / "source-assets"


class LoaderPerformanceTests(unittest.TestCase):
    def test_loader_has_timeout_and_idempotent_completion(self):
        source = LOADER.read_text(encoding="utf-8")
        self.assertIn("preloadTimeoutMs", source)
        self.assertIn("failSafeTimeoutMs", source)
        self.assertIn("if (this.completed) return", source)
        self.assertIn("sessionStorage", source)
        self.assertRegex(source, r"window\.setTimeout\(settle, this\.preloadTimeoutMs\)")

    def test_avatar_is_sized_for_small_ui_usage(self):
        self.assertLess(AVATAR.stat().st_size, 400_000)
        with Image.open(AVATAR) as image:
            self.assertLessEqual(image.width, 400)
            self.assertLessEqual(image.height, 500)
            self.assertGreaterEqual(image.width, 240)

    def test_generation_sources_live_outside_public(self):
        expected = {
            "_source-sheet-a.png",
            "_source-sheet-b.png",
            "chai.png",
            "designer.png",
            "watering.png",
        }
        self.assertTrue(expected.issubset({path.name for path in SOURCE_DIR.glob("*.png")}))
        public_assets = ROOT / "public" / "assets"
        for filename in expected:
            self.assertFalse((public_assets / filename).exists())
            self.assertFalse((public_assets / "load-stickers" / filename).exists())

    def test_generation_scripts_use_repository_sources(self):
        for name in ("extract_loader_stickers.py", "prepare_home_stickers.py"):
            source = (ROOT / "scripts" / name).read_text(encoding="utf-8")
            self.assertIn('SOURCE_DIR = ROOT / "scripts" / "source-assets"', source)
            self.assertRegex(source, re.compile(r"_source-sheet-[ab]\.png"))


if __name__ == "__main__":
    unittest.main()
