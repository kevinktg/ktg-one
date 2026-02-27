from playwright.sync_api import Page, expect, sync_playwright

def test_styles(page: Page):
  # 1. Go to the test page
  page.goto("http://localhost:3000/test-styles")

  # Wait for content to load
  page.wait_for_selector("h1")

  # 2. Check UL style
  ul = page.locator("article ul").first
  expect(ul).to_be_visible()
  # Tailwind class 'list-disc' sets list-style-type: disc
  # We check computed style.
  expect(ul).to_have_css("list-style-type", "disc")
  # padding-left: 1.5rem (24px usually)
  expect(ul).to_have_css("padding-left", "24px") # 1.5rem * 16px = 24px

  # 3. Check OL style
  ol = page.locator("article ol").first
  expect(ol).to_be_visible()
  expect(ol).to_have_css("list-style-type", "decimal")
  expect(ol).to_have_css("padding-left", "24px")

  # 4. Check PRE block style
  pre = page.locator("article pre").first
  expect(pre).to_be_visible()
  # p-4 = 1rem = 16px
  expect(pre).to_have_css("padding", "16px")
  # background-color: rgb(23, 23, 23) (neutral-900)
  # Tailwind 4.0 'neutral-900' is likely 'rgb(23, 23, 23)'.
  # Actually, let's just check it's not transparent.
  bg_color = pre.evaluate("el => window.getComputedStyle(el).backgroundColor")
  print(f"PRE background color: {bg_color}")
  assert bg_color != "rgba(0, 0, 0, 0)" and bg_color != "transparent"

  # 5. Check Code inside Pre
  code_in_pre = pre.locator("code").first
  # Should have transparent background (reset)
  # But existing prose-code sets background.
  # We added [&_pre_code]:bg-transparent
  code_bg = code_in_pre.evaluate("el => window.getComputedStyle(el).backgroundColor")
  print(f"CODE inside PRE background: {code_bg}")
  assert code_bg == "rgba(0, 0, 0, 0)" or code_bg == "transparent"

  # 6. Screenshot
  page.screenshot(path="verification/styles_verification.png", full_page=True)

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      test_styles(page)
      print("Verification passed!")
    except Exception as e:
      print(f"Verification failed: {e}")
      # Take screenshot on failure too
      page.screenshot(path="verification/styles_failed.png", full_page=True)
      raise e
    finally:
      browser.close()
