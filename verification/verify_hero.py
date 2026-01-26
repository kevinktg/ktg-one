
import os
from playwright.sync_api import sync_playwright, expect

def verify_hero_render(page):
    # Navigate to home
    page.goto("http://localhost:3000")

    # Wait for the canvas to be present (HeroImages renders a Canvas)
    # The canvas is inside HeroImages -> div -> Canvas -> div -> canvas
    # We can look for the canvas element.
    page.wait_for_selector("canvas", timeout=10000)

    # Give it a moment to load textures (though we can't easily detect "loaded" state from outside without console logs)
    # The HeroImages component has a transition delay.
    page.wait_for_timeout(2000)

    # Check if the canvas is visible
    canvas = page.locator("canvas").first
    expect(canvas).to_be_visible()

    # Take screenshot
    os.makedirs("/home/jules/verification", exist_ok=True)
    page.screenshot(path="/home/jules/verification/hero_render.png")
    print("Screenshot taken at /home/jules/verification/hero_render.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_hero_render(page)
        except Exception as e:
            print(f"Error: {e}")
            # Take error screenshot if possible
            try:
                page.screenshot(path="/home/jules/verification/error.png")
            except:
                pass
        finally:
            browser.close()
