from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime 
import time

def setup_driver():

    #Setup with saved no user account edge profile 
    options = Options()
    options.add_argument(r"user-data-dir=C:\selenium-edge-profile")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--start-maximized")

    return webdriver.Edge(options=options)

def scrape():

    driver = setup_driver()

    #Start off in the work to do page
    driver.get('https://westernu.brightspace.com/d2l/le/worktodo/view')

    #It goes to the login page
    print("Waiting 30 seconds for manual login/page load...")
    time.sleep(30) #Sleep

    #Waiting for the main page content
    print("Waiting for Work To Do page content")
    wait = WebDriverWait(driver, 20)

    wait.until(EC.presence_of_element_located((By.TAG_NAME, "d2l-w2d-work-to-do")))
    print("Container found! Proceeding to Shadow DOM extraction...")

    # Javascript block to Scrape Shadow DOMS 

    print("Attempting full Shadow DOM extraction...")
    #Collecting the links
    script = """
    const foundItems = [];

    let root1 = document.querySelector("d2l-w2d-work-to-do")?.shadowRoot;
    let root2 = root1?.querySelector("d2l-w2d-collections")?.shadowRoot;

    for (let i = 1; i <= 100; i++) {
        let root3 = root2?.querySelector(`d2l-w2d-list:nth-child(${i})`)?.shadowRoot;
        if (!root3) continue;

        for (let j = 1; j <= 100; j++) {
            // Handle ASSIGNMENT types
            const item = root3.querySelector(`d2l-w2d-list-item-assignment:nth-child(${j})`);
            if (item) {
                const nameEl = item.shadowRoot?.querySelector("d2l-activity-name-assignment");
                const linkEl = item.shadowRoot?.querySelector("a");
                if (linkEl) {
                    foundItems.push({
                        "url": linkEl.href,
                        "name": nameEl ? nameEl.getAttribute("_label") : "Unknown Name"
                    });
                }
            }

            // Handle CONTENT types
            const content = root3.querySelector(`d2l-w2d-list-item-content:nth-child(${j})`);
            if (content) {
                const linkEl = content.shadowRoot?.querySelector("a");
                if (linkEl) {
                    foundItems.push({
                        "url": linkEl.href,
                        "name": "Content Item" // Content items might use different name labels
                    });
                }
            }
        }
    }
    return foundItems;
    """
    results = driver.execute_script(script)

    assignments = []

    for current_item in results:
        print(f"Scraping: {current_item['name']}")
        print(f"URL: {current_item['url']}")
        
        # Navigate to the assignment page
        driver.get(current_item['url'])
        
        # Use try/except because different assignment pages might have different structures
        try:
            
            description = driver.execute_script("""
            const block = document.querySelector("d2l-html-block");

            if (!block) return null;

            // Create temporary element
            const temp = document.createElement("div");

            // Insert HTML
            temp.innerHTML = block.getAttribute("html");

            // Return clean text
            return temp.innerText;
        """) 

            due_date = driver.execute_script("""return document.querySelector("#z_i > td > div > div")?.innerText""")

            raw_due = due_date.replace("Due on ", "").strip()

            parsed_due = datetime.strptime(
                raw_due,
                "%b %d, %Y %I:%M %p"
            )

            course_name = driver.find_element(
                By.CSS_SELECTOR,
                "a.d2l-navigation-s-link"
            ).text
            
            print(f"Course name: {course_name}")

            print(f"Description: {description}")
            print(f"Due Date: {due_date}")

            assignments.append({
            "name": current_item["name"],
            "url": current_item["url"],
            "course_name":course_name,
            "description": description,
            "due_date": parsed_due
        })

        except Exception as e:
            print(f"Could not extract details for this item: {e}")

    return assignments 
    #Cleanup 
    driver.quit()
