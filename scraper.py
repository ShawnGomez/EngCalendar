from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# ---------------- SETUP ----------------
options = Options()
options.add_argument(r"user-data-dir=C:\selenium-edge-profile")
options.add_argument("--remote-debugging-port=9222")
options.add_argument("--start-maximized")

driver = webdriver.Edge(options=options)

try:
    # ---------------- OPEN PAGE ----------------
    driver.get('https://westernu.brightspace.com/d2l/le/worktodo/view')

    print("Waiting 30 seconds for manual login/page load...")
    time.sleep(30)

    # ---------------- HANDLE IFRAME (IF EXISTS) ----------------
    iframes = driver.find_elements(By.TAG_NAME, "iframe")
    if len(iframes) > 0:
        driver.switch_to.frame(iframes[0])
        print("Switched to iframe context.")

    # ---------------- WAIT FOR MAIN CONTAINER ----------------
    print("Waiting for Work To Do container...")
    wait = WebDriverWait(driver, 20)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "d2l-w2d-work-to-do")))

    # ---------------- METHOD 1: FULL SHADOW DOM SCRAPE ----------------
    print("Attempting full Shadow DOM extraction...")

    script = """
    const container = document.querySelector('d2l-w2d-work-to-do');
    if (!container || !container.shadowRoot) return [];

    const items = container.shadowRoot.querySelectorAll('d2l-activity-name-assignment');

    return Array.from(items).map(item => {
        try {
            return item.shadowRoot
                .querySelector('d2l-hc-name').shadowRoot
                .querySelector('span').innerText.trim();
        } catch (e) {
            return null;
        }
    }).filter(x => x !== null);
    """

    results = driver.execute_script(script)

    # ---------------- FALLBACK METHOD ----------------
    if not results:
        print("Fallback: Using per-element extraction...")

        activities = driver.find_elements(By.TAG_NAME, "d2l-activity-name-assignment")

        for i, activity in enumerate(activities, 1):
            try:
                name = driver.execute_script("""
                    return arguments[0]
                        .shadowRoot.querySelector('d2l-hc-name')
                        .shadowRoot.querySelector('span')
                        .innerText.trim();
                """, activity)

                print(f"{i}. {name}")
            except:
                print(f"{i}. Could not extract name")

    else:
        print(f"\n--- Found {len(results)} Items ---")
        for i, name in enumerate(results, 1):
            print(f"{i}. {name}")

# ---------------- CLEANUP ----------------
finally:
    time.sleep(10)
    driver.quit()