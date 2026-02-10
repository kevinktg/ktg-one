from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 720})

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3001")
            # Wait for the page to finish loading and network to be idle
            page.wait_for_load_state("networkidle")

            print("Checking for Canvas...")
            # Wait for at least one canvas to appear (or timeout)
            try:
                page.wait_for_selector("canvas", timeout=5000)
            except Exception:
                # If no canvas appears within the timeout, proceed to count (will be zero)
                pass
            canvas = page.locator("canvas")
            if canvas.count() > 0:
                print(f"Canvas found: {canvas.count()} instance(s)")
            else:
                print("ERROR: No canvas found!")

            print("Checking for CursorDot elements...")
            # CursorDot uses w-3 h-3 bg-white rounded-full mix-blend-difference
            # We can look for the container or the dots.
            # The container has z-[99999]

            # Let's move the mouse to trigger cursor
            page.mouse.move(500, 500)
            page.mouse.move(600, 600)

            # Wait for cursor dots to appear (or timeout)
            try:
                page.wait_for_selector(".mix-blend-difference.rounded-full", timeout=5000)
            except Exception:
                # If no dots appear within the timeout, proceed to count (will be zero)
                pass

            dots = page.locator(".mix-blend-difference.rounded-full")
            count = dots.count()
            print(f"Cursor dots found: {count}")

            if count >= 12:
                print("SUCCESS: CursorDot seems to be rendering (12+ dots found)")
            else:
                print(f"WARNING: Expected 12 dots, found {count}")

            print("Taking screenshot...")
            page.screenshot(path="verification/hero_and_cursor.png")
        finally:
            browser.close()
if __name__ == "__main__":
    run()
