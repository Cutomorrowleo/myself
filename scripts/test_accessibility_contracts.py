from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class AccessibilityContractsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.app = (ROOT / "public/js/app.js").read_text(encoding="utf-8")
        cls.transitions = (ROOT / "public/js/card-transitions.js").read_text(encoding="utf-8")
        cls.resume = (ROOT / "public/js/resume-panel.js").read_text(encoding="utf-8")
        cls.chai = (ROOT / "public/js/chai-panel.js").read_text(encoding="utf-8")

    def test_viewport_allows_user_zoom(self):
        self.assertNotIn("user-scalable=no", self.index)
        self.assertNotIn("maximum-scale=1.0", self.index)

    def test_main_has_static_heading_and_dialogs_are_named(self):
        self.assertIn('<h1 class="sr-only">', self.index)
        self.assertNotIn('role="application"', self.index)
        self.assertIn('aria-labelledby="resumePanelTitle"', self.index)
        self.assertIn('aria-labelledby="chaiPanelTitle"', self.index)

    def test_card_activation_preserves_trigger(self):
        self.assertIn("transitions.openCard(elementId, el)", self.app)
        self.assertIn("openCard(elementId, triggerEl", self.transitions)
        self.assertIn("this.triggerEl", self.transitions)

    def test_modal_scripts_manage_focus_and_inert_content(self):
        for source in (self.transitions, self.resume, self.chai):
            self.assertIn("inert", source)
            self.assertIn("focus()", source)
            self.assertRegex(source, r"event\.key\s*[!=]==?\s*'Tab'")

    def test_card_overlay_retries_initial_focus_without_stealing_it(self):
        self.assertIn("_moveFocusIntoOverlay(overlay, preferredFocus)", self.transitions)
        self.assertIn("overlay.contains(document.activeElement)", self.transitions)
        self.assertIn("target.focus({ preventScroll: true })", self.transitions)
        self.assertIn("[80, 180].map(delay => setTimeout(focus, delay))", self.transitions)
        self.assertIn("this._clearModalFocusTimers();", self.transitions)


if __name__ == "__main__":
    unittest.main()
