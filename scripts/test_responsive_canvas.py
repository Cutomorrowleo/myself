from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ResponsiveCanvasTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.config = (ROOT / "public/js/config.js").read_text(encoding="utf-8")
        cls.engine = (ROOT / "public/js/canvas-engine.js").read_text(encoding="utf-8")
        cls.placer = (ROOT / "public/js/element-placer.js").read_text(encoding="utf-8")
        cls.app = (ROOT / "public/js/app.js").read_text(encoding="utf-8")
        cls.css = (ROOT / "public/css/responsive.css").read_text(encoding="utf-8")

    def test_zoom_is_interpolated_instead_of_breakpoint_only(self):
        self.assertIn("getResponsiveCanvasZoom", self.config)
        self.assertIn("progress", self.config)
        self.assertIn("CONFIG.getDefaultZoom", self.engine)

    def test_resize_reflows_elements_and_preserves_canvas_center(self):
        self.assertIn("refreshLayout(elements", self.placer)
        self.assertIn("engine.refreshLayout()", self.app)
        self.assertIn("const centerX", self.engine)
        self.assertIn("ResizeObserver", self.app)
        self.assertIn("orientationchange", self.app)

    def test_mobile_breakpoint_and_tap_targets_are_consistent(self):
        self.assertIn("window.innerWidth < 768", self.placer)
        self.assertIn("@media (max-width: 767px)", self.css)
        self.assertIn("min-height: 44px", self.css)

    def test_work_navigation_has_a_distinct_target(self):
        self.assertNotIn("work:    { x: 2500, y: 2000 }", self.config)


if __name__ == "__main__":
    unittest.main()
