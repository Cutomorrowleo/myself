import unittest
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "public" / "assets" / "brand"

WORDMARKS = ("cutomorrow", "ao-li")


class BotanicalWordmarkTests(unittest.TestCase):
    def test_page_uses_new_wordmark_markup(self):
        index = (ROOT / "index.html").read_text(encoding="utf-8")
        placer = (ROOT / "public" / "js" / "element-placer.js").read_text(
            encoding="utf-8"
        )
        config = (ROOT / "public" / "js" / "config.js").read_text(encoding="utf-8")

        self.assertNotIn("portfoliobyshruti.com/SVG/Logo.svg", index)
        self.assertIn('data-botanical-wordmark="cutomorrow"', index)
        self.assertIn("dataset.botanicalWordmark = wordmark", placer)
        self.assertIn("wordmark: 'ao-li'", config)
        self.assertIn('class="hero-subtitle"', placer)
        self.assertIn("cfg.data.subtitle", placer)
        self.assertIn("subtitle: 'Design Engineer · Brand & Web · Built with Claude Code'", config)
        self.assertNotIn("tagline: 'Non-Linear'", config)
        self.assertNotIn("highlightWord: 'Creative.'", config)

    def test_wordmarks_use_four_registered_full_frames(self):
        for name in WORDMARKS:
            frames = []
            for index in range(1, 5):
                frame_path = BRAND_DIR / f"{name}-frame-{index}.png"
                self.assertTrue(frame_path.exists(), frame_path)
                frames.append(Image.open(frame_path).convert("RGBA"))

            self.assertTrue(all(frame.size == frames[0].size for frame in frames))
            self.assertTrue(all(frame.getchannel("A").getbbox() for frame in frames))
            if name == "ao-li":
                self.assertGreaterEqual(frames[0].width, 1000)

    def test_growth_animation_is_initialized_for_entry_and_hover(self):
        app = (ROOT / "public" / "js" / "app.js").read_text(encoding="utf-8")
        cards = (ROOT / "public" / "css" / "cards.css").read_text(encoding="utf-8")
        base = (ROOT / "public" / "css" / "base.css").read_text(encoding="utf-8")

        self.assertIn("initBotanicalWordmarks()", app)
        self.assertIn("mouseenter", app)
        self.assertIn("botanical-wordmark__frame", app)
        self.assertNotIn("botanical-growth-layer", app)
        self.assertIn("onComplete: showComplete", app)
        self.assertIn("prefersReducedMotion()", app)
        self.assertIn(".botanical-wordmark", cards + base)
        self.assertIn("--hero-wordmark-height", cards + base)


if __name__ == "__main__":
    unittest.main()
